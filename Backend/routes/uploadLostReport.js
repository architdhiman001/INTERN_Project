const express = require('express');
const multer = require('multer');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware'); 
const { uploadToS3 } = require('../utils/s3upload');
require('dotenv').config();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  }
});

// POST /api/uploadLostReport
router.post('/uploadLostReport', verifyToken, upload.single('image'), async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }

    const createdAt = new Date();
    const baseUrgency = 10; // lost items are higher urgency
    const hoursSinceReported = 0;
    const urgencyScore = Math.max(baseUrgency - Math.floor(hoursSinceReported / 24), 1);

    const entry = {
      userId: req.user.id,
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      imagePath: imageUrl,
      type: req.body.type || 'lost',
      phone: req.body.mobile,
      category: req.body.category,
      location: req.body.location,
      createdAt,
      urgencyScore
    };

    const db = req.app.locals.db;
    const result = await db.collection('formEntries').insertOne(entry);

    res.status(201).json({
      message: 'Lost item uploaded successfully',
      id: result.insertedId,
      imageUrl
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Upload and save failed' });
  }
});

// GET /api/lostitems
router.get('/lostitems', async (req, res) => {
  try {
    const db = req.app.locals.db;
    let lostItems = await db.collection('formEntries').find({ type: 'lost' }).toArray();

    lostItems = lostItems.map(item => {
      const baseUrgency = 10;
      const hoursSinceReported = (Date.now() - new Date(item.createdAt)) / (1000 * 60 * 60);
      item.urgencyScore = Math.max(baseUrgency - Math.floor(hoursSinceReported / 24), 1);
      return item;
    });

    lostItems.sort((a, b) => b.urgencyScore - a.urgencyScore);
    res.json(lostItems);
  } catch (err) {
    console.error('❌ Failed to fetch lost items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/items/user/lost
router.get('/items/user/lost', verifyToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userLostItems = await db
      .collection('formEntries')
      .find({ userId: req.user.id, type: 'lost' })
      .toArray();

    userLostItems.forEach(item => {
      const baseUrgency = 10;
      const hoursSinceReported = (Date.now() - new Date(item.createdAt)) / (1000 * 60 * 60);
      item.urgencyScore = Math.max(baseUrgency - Math.floor(hoursSinceReported / 24), 1);
    });

    userLostItems.sort((a, b) => b.urgencyScore - a.urgencyScore);
    res.json(userLostItems);
  } catch (err) {
    console.error('❌ Failed to fetch user lost items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
