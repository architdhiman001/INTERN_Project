const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const verifyToken = require('../middleware/authMiddleware'); // JWT auth middleware

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // make sure 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ======================
// POST /api/uploadFormDatalost
// Protected route — upload lost item
// ======================
router.post('/uploadLostReport', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file ? req.file.path : null;

    const entry = {
      userId: req.user.id, // 🔑 track user
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      imagePath: imagePath,
      type: req.body.type || 'lost', // default to lost
      phone: req.body.mobile,
      category: req.body.category,
      location: req.body.location,
      createdAt: new Date()
    };

    const db = req.app.locals.db;
    const result = await db.collection('formEntries').insertOne(entry);

    res.status(201).json({ message: 'Data saved', id: result.insertedId });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).send('Upload and save failed');
  }
});

// ======================
// GET /api/lostitems
// Fetch all lost items
// ======================
router.get('/lostitems', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const lostItems = await db
      .collection('formEntries')
      .find({ type: 'lost' })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(lostItems);
  } catch (err) {
    console.error('Failed to fetch lost items:', err);
    res.status(500).send('Server error');
  }
});

// ======================
// GET /api/items/user/lost
// Fetch lost items posted by logged-in user
// ======================
router.get('/items/user/lost', verifyToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userLostItems = await db
      .collection('formEntries')
      .find({ userId: req.user.id, type: 'lost' })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(userLostItems);
  } catch (err) {
    console.error('Failed to fetch user lost items:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
