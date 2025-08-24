const router = require('express').Router();
const https = require('https');

// Handles general text-based questions for the "Ask Gemini" page
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

// Handles meal suggestions for the "Ask Gemini" page
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

// Handles healthy swap suggestions from the "History" page
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

// --- DYNAMIC TRIVIA FACT ROUTE (UPDATED) ---
router.post('/trivia-fact', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured.' });
  }

  // --- CHANGE 1: Add a list of random topics ---
  const topics = [
    'the benefits of hydration', 'surprising vegetable nutrition', 'fruit facts',
    'the science of exercise', 'the history of a common food', 'vitamins and minerals',
    'healthy fats', 'the benefits of fiber', 'the human metabolism', 'unusual spices',
    'the history of pizza', 'the origin of coffee', 'facts about sleep and health'
  ];
  // --- Select a random topic from the list ---
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];

  // --- CHANGE 2: Inject the random topic into the prompt ---
  const prompt = `
    Tell me a surprising and fun fact about ${randomTopic}.
    Keep it concise (around 1-3 sentences) and easy to read.
    Start directly with the fact, without any introductory phrases like "Here's a fun fact:".
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
          return res.status(500).json({ error: 'Error from Gemini API.' });
        }
        const responseText = parsedData?.candidates?.[0]?.content?.parts?.[0]?.text;
        res.json({ fact: responseText });
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
