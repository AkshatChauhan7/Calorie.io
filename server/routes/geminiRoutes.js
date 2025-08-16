const router = require('express').Router();
const https = require('https');

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
    // --- THIS LINE IS THE FIX ---
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
          console.error('Gemini API Error:', parsedData.error);
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
        console.error('Error parsing Gemini response:', error);
        res.status(500).json({ error: 'Error parsing Gemini response' });
      }
    });
  });

  geminiReq.on('error', (error) => {
    console.error('Request to Gemini API failed:', error);
    res.status(500).json({ error: error.message });
  });

  geminiReq.write(data);
  geminiReq.end();
});

module.exports = router;