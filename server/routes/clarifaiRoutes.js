const router = require('express').Router();
const https = require('https');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Test route to check API key validity
router.get('/test-key', (req, res) => {
  console.log("DEBUG: Clarifai API Key =", process.env.CLARIFAI_API_KEY);

  const options = {
    hostname: 'api.clarifai.com',
    path: '/v2/models',
    method: 'GET',
    headers: {
      'Authorization': `Key ${process.env.CLARIFAI_API_KEY}`,
      'Accept': 'application/json'
    }
  };

  const clarifaiReq = https.request(options, (clarifaiRes) => {
    let data = '';
    clarifaiRes.on('data', (chunk) => data += chunk);
    clarifaiRes.on('end', () => {
      try {
        res.json(JSON.parse(data));
      } catch (err) {
        res.status(500).json({ error: 'Could not parse Clarifai JSON' });
      }
    });
  });

  clarifaiReq.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });

  clarifaiReq.end();
});

// POST /api/clarifai/analyze-upload
router.post('/analyze-upload', upload.single('imageFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: { description: 'No image file was uploaded.' } });
  }

  const imageBase64 = req.file.buffer.toString('base64');

  const body = JSON.stringify({
    user_app_id: {
      user_id: 'my-id',
      app_id: 'calorieio-test'
    },
    inputs: [
      {
        data: {
          image: { base64: imageBase64 }
        }
      }
    ]
  });

  const options = {
    hostname: 'api.clarifai.com',
    path: '/v2/models/food-item-recognition/outputs',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Key ${process.env.CLARIFAI_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  console.log("DEBUG: Sending request to Clarifai...");

  const clarifaiReq = https.request(options, (clarifaiRes) => {
    let data = '';
    clarifaiRes.on('data', (chunk) => data += chunk);
    clarifaiRes.on('end', () => {
      console.log("DEBUG: Clarifai raw response:", data);
      try {
        res.json(JSON.parse(data));
      } catch (err) {
        res.status(500).json({ status: { description: 'Error parsing Clarifai response' } });
      }
    });
  });

  clarifaiReq.on('error', (err) => {
    res.status(500).json({ status: { description: 'Error connecting to Clarifai API', details: err.message } });
  });

  clarifaiReq.write(body);
  clarifaiReq.end();
});

module.exports = router;
