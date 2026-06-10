const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Helper to extract base64 and mime type from Data URI
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

// Helper: sleep for retry delays
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Models to try in order (fallback chain)
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

// Try calling Gemini with automatic model fallback and retry
async function callGeminiWithFallback(genAI, prompt, imageParts) {
  for (const modelName of GEMINI_MODELS) {
    // Each model gets 2 attempts
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`AI Try-On: Trying model "${modelName}" (attempt ${attempt}/2)...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();
        console.log(`AI Try-On: Success with model "${modelName}"!`);
        return { text, modelUsed: modelName };
      } catch (err) {
        const status = err.status || 0;
        console.warn(`AI Try-On: Model "${modelName}" attempt ${attempt} failed (HTTP ${status}): ${err.message}`);

        // If 503 (overloaded) or 429 (rate limit), wait and retry or try next model
        if (status === 503 || status === 429) {
          if (attempt < 2) {
            console.log('AI Try-On: Waiting 3s before retrying...');
            await sleep(3000);
          }
          // After 2nd attempt, fall through to next model
        } else {
          // For other errors (400, 403, etc.), skip to next model immediately
          break;
        }
      }
    }
  }
  // All models exhausted
  return null;
}

// @route   POST /api/ai/tryon
// @desc    Perform virtual AI Try-On using Gemini for fashion analysis
// @access  Public
router.post('/ai/tryon', async (req, res) => {
  try {
    const { userImage, clothingImage, clothingName } = req.body;

    if (!userImage || !clothingImage) {
      return res.status(400).json({ message: 'User photo and clothing images are required' });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      // Fallback Simulator if no key is provided
      console.log('AI Try-On: [FALLBACK MODE] Simulating processing...');
      await sleep(2500);
      return res.json({
        generatedImage: userImage,
        analysis: 'Mock simulation success! Provide GEMINI_API_KEY in .env for real AI VTON analysis.',
        provider: 'fallback-simulator'
      });
    }

    console.log('AI Try-On: Launching Gemini fashion analysis...');
    
    // Parse the data URIs
    const parsedUserImg = parseDataURI(userImage);
    const parsedClothingImg = parseDataURI(clothingImage);

    if (!parsedUserImg || !parsedClothingImg) {
      return res.status(400).json({ message: 'Images must be valid base64 Data URIs' });
    }

    // Initialize Gemini SDK
    const genAI = new GoogleGenerativeAI(geminiKey);

    // Prepare prompt and image parts
    const prompt = `Act as an expert AI Fashion Stylist.
I have provided two images:
1. A photo of a person (User).
2. A photo of a clothing item (${clothingName || 'a garment'}).

Please analyze the user's body type, skin tone, and overall vibe, and then analyze the clothing item. 
Provide a detailed, flattering, and honest review of how this clothing would look on them. Focus on:
- Color matching and contrast.
- Fit, drape, and silhouette.
- Suggested styling tips (e.g., "Pair this with dark denim...").

Keep the response concise (1-2 short paragraphs) and enthusiastic!`;

    const imageParts = [
      {
        inlineData: {
          data: parsedUserImg.data,
          mimeType: parsedUserImg.mimeType
        }
      },
      {
        inlineData: {
          data: parsedClothingImg.data,
          mimeType: parsedClothingImg.mimeType
        }
      }
    ];

    // Call Gemini with automatic fallback across models
    const geminiResult = await callGeminiWithFallback(genAI, prompt, imageParts);

    if (geminiResult) {
      return res.json({
        generatedImage: userImage,
        analysis: geminiResult.text,
        provider: 'gemini',
        model: geminiResult.modelUsed
      });
    } else {
      // All models failed — return a graceful error with user's image so UI doesn't break
      console.error('AI Try-On: All Gemini models failed. Returning fallback.');
      return res.json({
        generatedImage: userImage,
        analysis: '⚠️ All Gemini models are currently experiencing high demand. Your photo is displayed above. Please try again in a minute — the AI fashion analysis will appear here when servers are available!',
        provider: 'gemini-unavailable'
      });
    }

  } catch (error) {
    console.error('AI Try-On Route Error:', error);
    res.status(500).json({ 
      message: 'Server error during Gemini fashion analysis',
      error: error.message
    });
  }
});

module.exports = router;
