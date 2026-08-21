const express = require('express');
const router = express.Router();
const Replicate = require('replicate');

// Helper to extract clean base64 data and mime type from Data URI
function parseDataURI(dataUri) {
  const matches = dataUri.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }
  return {
    mimeType: matches[1],
    data: matches[2]
  };
}

// @route   POST /api/ai/tryon
// @desc    Virtual Try-On using Replicate google/nano-banana (Gemini 2.5 Flash Image) - Fast & Cost-Effective
// @access  Public
router.post('/ai/tryon', async (req, res) => {
  try {
    const { userImage, clothingImage, clothingName, clothingType, clothingDescription, clothingGender, clothingColors } = req.body;

    if (!userImage || !clothingImage) {
      return res.status(400).json({ message: 'User photo and clothing image are required' });
    }

    const replicateToken = process.env.REPLICATE_API_TOKEN;

    if (!replicateToken) {
      return res.status(500).json({
        message: 'REPLICATE_API_TOKEN is missing in server/.env. Please configure your token.'
      });
    }

    console.log('AI Try-On: Executing Replicate google/nano-banana (Gemini 2.5 Flash Image)...');

    const replicate = new Replicate({ auth: replicateToken });

    // Parse base64 Data URIs
    const parsedUser = parseDataURI(userImage);
    const parsedClothing = parseDataURI(clothingImage);

    if (!parsedUser || !parsedClothing) {
      return res.status(400).json({ message: 'Images must be valid base64 Data URIs' });
    }

    const userBuffer = Buffer.from(parsedUser.data, 'base64');
    const clothingBuffer = Buffer.from(parsedClothing.data, 'base64');

    const userFile = new File([userBuffer], 'user_photo.jpg', { type: parsedUser.mimeType });
    const clothingFile = new File([clothingBuffer], 'garment_product.jpg', { type: parsedClothing.mimeType });

    const genderTag = (clothingGender || '').toLowerCase();
    let genderDirective = '';
    if (genderTag.includes('women') || genderTag.includes('female')) {
      genderDirective = `\n- Women's Tailoring: Ensure accurate feminine tailoring, delicate neckline, elegant waist and bust contouring, and authentic women's fit conforming naturally to a female body.`;
    } else if (genderTag.includes('men') || genderTag.includes('male')) {
      genderDirective = `\n- Men's Tailoring: Ensure masculine tailoring, broad shoulder alignment, proper chest and collar structure, and authentic men's fit conforming naturally to a male body.`;
    } else if (genderTag.includes('kid') || genderTag.includes('child')) {
      genderDirective = `\n- Kids' Tailoring: Fit appropriately for juvenile/kids proportions.`;
    }

    const colorHint = Array.isArray(clothingColors) && clothingColors.length > 0
      ? `\n- Primary Product Colors: ${clothingColors.join(', ')}`
      : '';

    console.log(`  → User image: ${(userBuffer.length / 1024).toFixed(0)}KB | Garment image: ${(clothingBuffer.length / 1024).toFixed(0)}KB`);
    console.log(`  → Product: ${clothingName || 'Garment'} [Category: ${clothingGender || 'Unspecified'}] (${clothingType || 'Apparel'})`);

    // Hyper-realistic precision inpainting & identity-locked virtual try-on prompt
    const prompt = `[PHOTO INPAINTING & CLOTHING REPLACEMENT TASK]

ROLES OF INPUT IMAGES:
- Image 1 (PRIMARY MASTER): The real photo of the person. You MUST preserve their exact real identity, original face, eyes, nose, lips, facial hair, skin texture and pores, hair, head shape, body build, posture, and original background 100% untouched and identical.
- Image 2 (GARMENT REFERENCE): The exact target clothing item to be transferred onto the person's body: "${clothingName || 'Garment'}" (${clothingGender || 'Apparel'} - ${clothingType || 'Clothing'}).
${colorHint}
${clothingDescription ? `- Garment Description: ${clothingDescription}` : ''}

MANDATORY EDITING RULES:
1. ZERO FACE / IDENTITY MODIFICATION (CRITICAL):
   - DO NOT redraw, morph, generate, beautify, or alter the person's face in any way.
   - Retain 100% of their exact facial features, skin tone, natural pores, expression, blemishes, eyeglasses, and hairstyle exactly as seen in Image 1.
   - Avoid artificial plastic smoothing or cartoonish AI look; preserve raw photographic reality.

2. SEAMLESS CLOTHING TRANSFER:
   - Carefully remove ONLY the clothes currently worn in Image 1, and dress the person in the EXACT clothing from Image 2.
   - The new garment must conform naturally to the person's physical body contours, shoulder width, and pose with realistic fabric drape, organic folds, and natural gravity.
   - Ensure clean, realistic transitions and contact shadows around the neckline, collar, shoulders, arms, and waist.

3. COLOR & DETAIL LOCK:
   - Accurately replicate the exact color shades, patterns, fabric textures, buttons, zippers, lapels, and stitching from Image 2.
   - If Image 2 is a suit, blazer, or jacket, ALWAYS include an appropriate inner shirt (such as a crisp white dress shirt or matching inner tee) underneath, ensuring natural and complete professional layering. NEVER render an open blazer over a bare chest.${genderDirective}

OUTPUT: A single ultra-realistic, natural photographic result showing the exact person from Image 1 naturally wearing the outfit from Image 2.`;

    console.log('  → Calling Replicate google/nano-banana (Gemini 2.5 Flash Image)...');

    const output = await replicate.run(
      "google/nano-banana:5bdc2c7cd642ae33611d8c33f79615f98ff02509ab8db9d8ec1cc6c36d378fba",
      {
        input: {
          prompt: prompt,
          image_input: [userFile, clothingFile],
          aspect_ratio: 'match_input_image',
          output_format: 'png'
        }
      }
    );

    console.log('  → Model output received, type:', typeof output);

    let generatedDataUri;

    if (typeof output === 'string') {
      console.log('  → Downloading image from output URL...');
      const imageResponse = await fetch(output);
      if (!imageResponse.ok) {
        throw new Error('Failed to download generated image from Replicate');
      }
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const contentType = imageResponse.headers.get('content-type') || 'image/png';
      generatedDataUri = `data:${contentType};base64,${base64Image}`;
    } else if (output && typeof output[Symbol.asyncIterator] === 'function') {
      console.log('  → Reading stream output chunks...');
      const chunks = [];
      for await (const chunk of output) {
        chunks.push(chunk);
      }
      const imageBuffer = Buffer.concat(chunks);
      generatedDataUri = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    } else {
      throw new Error('Unexpected output format from Replicate model');
    }

    console.log('AI Try-On: ✅ Successfully generated with google/nano-banana (Gemini 2.5)!');

    return res.json({
      generatedImage: generatedDataUri,
      provider: 'google/nano-banana',
      message: `Generated virtual try-on with Gemini 2.5 Flash for "${clothingName}"`
    });

  } catch (error) {
    console.error('AI Try-On Route Error:', error);
    res.status(500).json({
      message: error.message || 'Server error during virtual try-on generation',
      error: error.message
    });
  }
});

module.exports = router;
