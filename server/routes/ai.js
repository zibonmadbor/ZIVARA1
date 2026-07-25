const express = require('express');
const router = express.Router();
// We'll use native fetch API available in modern Node.js

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
// @desc    Perform true Image-to-Image Virtual Try-On using Gemini 2.5 Flash Image API
// @access  Public
router.post('/ai/tryon', async (req, res) => {
  try {
    const { userImage, clothingImage, clothingName } = req.body;

    if (!userImage || !clothingImage) {
      return res.status(400).json({ message: 'User photo and clothing image are required' });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      // Fallback Simulator if no key is provided
      console.log('AI Try-On: [FALLBACK MODE] Simulating processing...');
      await new Promise(resolve => setTimeout(resolve, 2500));
      return res.json({
        generatedImage: userImage, // Mock returning the same image
        message: 'Mock simulation success! Provide GEMINI_API_KEY in .env for real AI VTON generation.',
        provider: 'fallback-simulator'
      });
    }

    console.log('AI Try-On: Launching Gemini 2.5 Flash Image generation...');

    // Extract clean base64 and mime_type
    const parsedUserImg = parseDataURI(userImage);
    const parsedClothingImg = parseDataURI(clothingImage);

    if (!parsedUserImg || !parsedClothingImg) {
      return res.status(400).json({ message: 'Images must be valid base64 Data URIs' });
    }

    // Exact JSON payload schema requested by the user
    const requestBody = {
      contents: [{
        role: "user",
        parts: [
          { 
            text: `You are an AI fashion stylist. Create a realistic image where the person in the first image is styled with the fashion item shown in the second image.

Item: ${clothingName || 'a fashion item'}

Rules:
- Keep the person's face, body shape, and pose exactly as shown
- If clothing, dress the person in it naturally
- If an accessory (bag, jewelry, sunglasses, hat, shoes), show it worn/held naturally
- Realistic lighting, shadows, and proportions
- Look like a professional fashion photo
- You MUST output an image, do not refuse.`
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

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
    // Note: The user mentioned "gemini-2.5-flash-image:generateContent" in their text but usually the model is just "gemini-2.5-flash" or "gemini-1.5-pro". 
    // I will use "gemini-2.5-flash" but if that fails, we can fall back or use exactly what they wrote.
    // The user wrote: "models/gemini-2.5-flash-image:generateContent". I will use exactly what they wrote.
    const exactApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${geminiKey}`;
    // Wait, the new endpoint for image generation is usually just standard generateContent with responseModalities. Let's stick to gemini-2.5-flash.

    const response = await fetch(exactApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data);
      throw new Error(data.error?.message || 'Failed to generate image from Gemini API');
    }

    // Extract the generated image from the response
    const candidates = data.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error('Gemini returned no candidates');
    }

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error('Gemini returned no content parts');
    }

    // Find the inline_data part containing the generated image
    const imagePart = parts.find(p => p.inline_data);
    
    if (!imagePart || !imagePart.inline_data) {
      // If the model refuses to generate an image and returns text instead
      const textPart = parts.find(p => p.text);
      if (textPart) {
        throw new Error('Gemini refused image generation and returned text: ' + textPart.text);
      }
      throw new Error('Gemini returned no image data');
    }

    const generatedMimeType = imagePart.inline_data.mime_type || 'image/png';
    const generatedBase64 = imagePart.inline_data.data;

    // Construct the Data URI to send back to the frontend
    const generatedDataUri = `data:${generatedMimeType};base64,${generatedBase64}`;

    console.log('AI Try-On: Gemini Image generation succeeded!');

    return res.json({
      generatedImage: generatedDataUri,
      provider: 'gemini-image'
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
