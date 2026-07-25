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
// @desc    Perform true Image-to-Image Virtual Try-On using Gemini 2.5 Flash Image or Replicate API
// @access  Public
router.post('/ai/tryon', async (req, res) => {
  try {
    const { userImage, clothingImage, clothingName } = req.body;

    if (!userImage || !clothingImage) {
      return res.status(400).json({ message: 'User photo and clothing image are required' });
    }

    const replicateToken = process.env.REPLICATE_API_TOKEN;
    const geminiKey = process.env.GEMINI_API_KEY;

    // Option 1: Use Replicate IDM-VTON model if REPLICATE_API_TOKEN is provided
    if (replicateToken) {
      try {
        console.log('AI Try-On: Executing Replicate IDM-VTON model...');
        const replicate = new Replicate({ auth: replicateToken });
        const output = await replicate.run(
          "cuuupid/idm-vton:c871d0b0b87d82361602e5e194655ad7923b0a7703c14d9d2078c71a80e8695b",
          {
            input: {
              crop: false,
              seed: 42,
              steps: 30,
              category: "upper_body",
              garm_img: clothingImage,
              human_img: userImage,
              garment_des: clothingName || "outfit"
            }
          }
        );

        let finalUrl = Array.isArray(output) ? output[0] : output;
        if (typeof finalUrl === 'object' && finalUrl.url) finalUrl = finalUrl.url();

        console.log('AI Try-On: Replicate IDM-VTON succeeded!');
        return res.json({
          generatedImage: String(finalUrl),
          provider: 'replicate-idm-vton'
        });
      } catch (repErr) {
        console.warn('Replicate execution error:', repErr.message);
      }
    }

    // Option 2: Use Gemini 2.5 Flash Image API
    if (!geminiKey) {
      return res.status(400).json({
        message: 'GEMINI_API_KEY is missing in server/.env. Please configure a free API key from https://aistudio.google.com/app/apikey'
      });
    }

    console.log('AI Try-On: Executing Gemini 2.5 Flash Image generation pipeline...');

    // Extract clean base64 and mime_type
    const parsedUserImg = parseDataURI(userImage);
    const parsedClothingImg = parseDataURI(clothingImage);

    if (!parsedUserImg || !parsedClothingImg) {
      return res.status(400).json({ message: 'Images must be valid base64 Data URIs' });
    }

    // Gemini 2.5 Flash Image VTON prompt payload
    const requestBody = {
      contents: [{
        role: "user",
        parts: [
          { 
            text: `Virtual Try-On Task: You are an expert AI fashion generator. Take the person from Image 1 and generate a new photorealistic image where they are wearing the exact outfit/garment shown in Image 2 (${clothingName || 'selected outfit'}).

Requirements:
- Preserve the person's face, body proportions, pose, and background from Image 1.
- Replace their current outfit with the garment shown in Image 2.
- Realistic fabric texture, lighting, and natural fit.
- You MUST output a generated image.`
          },
          { 
            inline_data: { 
              mime_type: parsedUserImg.mimeType, 
              data: parsedUserImg.data 
            } 
          },
          { 
            inline_data: { 
              mime_type: parsedClothingImg.mimeType, 
              data: parsedClothingImg.data 
            } 
          }
        ]
      }],
      generationConfig: {
        responseModalities: ["IMAGE"]
      }
    };

    const modelsToTry = [
      "gemini-2.5-flash-image",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-3.1-flash-image"
    ];

    let lastError = null;

    for (const modelName of modelsToTry) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;
      try {
        console.log(`Attempting Gemini model: ${modelName}`);
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (response.ok && data.candidates && data.candidates.length > 0) {
          const parts = data.candidates[0].content?.parts;
          const imagePart = parts?.find(p => p.inline_data);
          
          if (imagePart && imagePart.inline_data) {
            const generatedMimeType = imagePart.inline_data.mime_type || 'image/png';
            const generatedBase64 = imagePart.inline_data.data;
            const generatedDataUri = `data:${generatedMimeType};base64,${generatedBase64}`;

            console.log(`AI Try-On: Successfully generated image with ${modelName}`);
            return res.json({
              generatedImage: generatedDataUri,
              provider: modelName
            });
          }
        } else {
          lastError = data.error?.message || `Model ${modelName} returned status ${response.status}`;
          console.warn(`Model ${modelName} failed:`, lastError);
        }
      } catch (err) {
        lastError = err.message;
        console.warn(`Error connecting to model ${modelName}:`, err.message);
      }
    }

    // If all Gemini models fail or key hits quota limit:
    return res.status(400).json({
      message: `Gemini API Error: ${lastError || 'Quota limit reached'}. Please ensure your API key has active quota from https://aistudio.google.com/app/apikey`,
      error: lastError
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


