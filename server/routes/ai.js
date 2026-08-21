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

    // High-precision prompt with strict color, pattern, and design replication
    const prompt = `High-end photorealistic virtual try-on fashion photography.
TASK: Dress the person in Image 1 in the EXACT clothing shown in Image 2.

GARMENT SPECIFICATIONS:
- Item: "${clothingName || 'Garment'}" (${clothingGender || 'Apparel'} - ${clothingType || 'Clothing'})
- Description: ${clothingDescription || 'Matching image 2'}
${colorHint}

CRITICAL RULES FOR ACCURACY:
1. STRICT VISUAL COLOR & PATTERN FIDELITY: The clothing worn on the person MUST match the EXACT colors, hues, prints, textures, patterns, and fabric material visible in Image 2. Look closely at Image 2: if Image 2 shows a Navy Blue suit, the person MUST wear a Navy Blue suit; if Image 2 is white/gold, output white/gold; if red, output red. NEVER invert, change, or substitute colors.
2. EXACT GARMENT & COMPLETE LAYERING: Replicate the precise apparel design and cut from Image 2. If the garment is a blazer, suit jacket, or coat, ALWAYS include an appropriate inner shirt (e.g. a crisp collared white dress shirt or undershirt as seen in Image 2). NEVER render a suit or blazer over bare skin.
3. PRESERVE IDENTITY & BACKGROUND 100%: Keep the person's exact face, facial features, sunglasses/glasses, eyes, hair, skin tone, body pose, and natural background from Image 1 100% authentic and unchanged. ONLY replace their current clothes with the new outfit from Image 2.
4. REALISTIC DRAPING & LIGHTING: The clothing must fit naturally with organic fabric folds, contact shadows under the collar and seams, conforming to their body posture.${genderDirective}`;

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
