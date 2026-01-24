import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Missing lat or lon' });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'your-app-name/1.0 (contact@email.com)',
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: 'Nominatim request failed' });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Reverse geocode error:', err);
    res.status(500).json({ message: 'Reverse geocoding failed' });
  }
});

export default router;
