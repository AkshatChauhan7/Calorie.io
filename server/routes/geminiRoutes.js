const router = require('express').Router();
const https = require('https');

// This route handles general text-based questions
router.post('/ask', (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'Gemini API key is not configured on the server.'
    });
  }

  const data = JSON.stringify({
    contents: [{
      parts: [{
        text: prompt
      }],
    }],
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  const geminiReq = https.request(options, (geminiRes) => {
    let responseData = '';
    geminiRes.on('data', (chunk) => {
      responseData += chunk;
    });

    geminiRes.on('end', () => {
      try {
        const parsedData = JSON.parse(responseData);
        if (geminiRes.statusCode !== 200 || parsedData.error) {
          const errorMessage = parsedData.error ? parsedData.error.message : 'An unknown error occurred with the Gemini API.';
          return res.status(geminiRes.statusCode || 500).json({
            error: errorMessage
          });
        }
        const responseText = parsedData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
          return res.status(500).json({ error: 'Could not find response text in Gemini API output.' });
        }
        res.json({ response: responseText });
      } catch (error) {
        res.status(500).json({ error: 'Error parsing Gemini response' });
      }
    });
  });

  geminiReq.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  geminiReq.write(data);
  geminiReq.end();
});

// This route handles meal suggestions
router.post('/suggest-meal', (req, res) => {
  const { ingredients, calorieGoal } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured.' });
  }

  const prompt = `
    I have the following ingredients: ${ingredients}.
    My daily calorie goal is approximately ${calorieGoal} calories.
    Please suggest a healthy and simple recipe I can make with these ingredients.
    Provide the recipe name, a short description, the list of ingredients needed, step-by-step instructions, and an estimated calorie count for one serving.
    Format the response nicely using markdown.
  `;

  const data = JSON.stringify({
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const geminiReq = https.request(options, (geminiRes) => {
    let responseData = '';
    geminiRes.on('data', (chunk) => { responseData += chunk; });
    geminiRes.on('end', () => {
      try {
        const parsedData = JSON.parse(responseData);
        if (geminiRes.statusCode !== 200 || parsedData.error) {
          const errorMessage = parsedData.error ? parsedData.error.message : 'An unknown error occurred with the Gemini API.';
          return res.status(geminiRes.statusCode || 500).json({ error: errorMessage });
        }
        const responseText = parsedData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
          return res.status(500).json({ error: 'Could not find response text in Gemini API output.' });
        }
        res.json({ response: responseText });
      } catch (error) {
        res.status(500).json({ error: 'Error parsing Gemini response' });
      }
    });
  });

  geminiReq.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  geminiReq.write(data);
  geminiReq.end();
});

// --- NEW ROUTE FOR HEALTHY SWAPS ---
router.post('/suggest-swap', (req, res) => {
  const { foodItem } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured.' });
  }

  const prompt = `
    What is a healthier alternative to eating "${foodItem}"?
    Please provide one or two suggestions. For each suggestion, give a brief, one-sentence explanation of why it's a healthier choice.
    Format the response in simple markdown, using bullet points for the suggestions.
  `;

  const data = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const geminiReq = https.request(options, (geminiRes) => {
    let responseData = '';
    geminiRes.on('data', (chunk) => { responseData += chunk; });
    geminiRes.on('end', () => {
      try {
        const parsedData = JSON.parse(responseData);
        if (geminiRes.statusCode !== 200 || parsedData.error) {
          const errorMessage = parsedData.error ? parsedData.error.message : 'An unknown error occurred with the Gemini API.';
          return res.status(geminiRes.statusCode || 500).json({ error: errorMessage });
        }
        const responseText = parsedData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
          return res.status(500).json({ error: 'Could not find response text in Gemini API output.' });
        }
        res.json({ response: responseText });
      } catch (error) {
        res.status(500).json({ error: 'Error parsing Gemini response' });
      }
    });
  });
  
  geminiReq.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  geminiReq.write(data);
  geminiReq.end();
});

module.exports = router;