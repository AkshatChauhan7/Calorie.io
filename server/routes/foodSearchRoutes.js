const router = require('express').Router();
const https = require('https');

// Simple in-memory cache with expiration
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

router.route('/').get((req, res) => {
  const { query } = req.query;
  const lowerCaseQuery = query.toLowerCase();

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Check if a valid result is in the cache
  if (cache.has(lowerCaseQuery) && Date.now() - cache.get(lowerCaseQuery).timestamp < CACHE_TTL) {
    console.log(`Serving "${lowerCaseQuery}" from cache.`);
    return res.json(cache.get(lowerCaseQuery).data);
  }

  console.log(`Fetching "${lowerCaseQuery}" from API.`);
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`;

  https.get(url, (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => { data += chunk; });
    apiRes.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        const products = jsonData.products.map(p => ({
          id: p.code,
          name: p.product_name,
          calories: p.nutriments['energy-kcal_100g'] || 0,
          protein: p.nutriments.proteins_100g || 0,
          carbs: p.nutriments.carbohydrates_100g || 0,
          fats: p.nutriments.fat_100g || 0,
        }));

        // Store the result in the cache
        cache.set(lowerCaseQuery, {
          data: products,
          timestamp: Date.now()
        });

        res.json(products);
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse API response' });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ error: 'Failed to fetch data from Open Food Facts' });
  });
});

module.exports = router;