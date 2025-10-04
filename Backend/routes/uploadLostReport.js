const express = require('express');
const multer = require('multer');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware'); 
const { uploadToS3 } = require('../utils/s3upload'); // AWS S3 helper
require('dotenv').config();

// ======================
// Multer setup (in-memory storage for S3)
// ======================
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  }
});

// ======================
// POST /api/uploadLostReport
// Protected route — upload lost item
// ======================
router.post('/uploadLostReport', verifyToken, upload.single('image'), async (req, res) => {
  try {
    let imageUrl = null;
    console.log('File received:', req.file);
    // Upload to AWS S3 if image is provided
    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }

    const entry = {
      userId: req.user.id, // user from JWT
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      imagePath: imageUrl, // store S3 URL
      type: req.body.type || 'lost', 
      phone: req.body.mobile,
      category: req.body.category,
      location: req.body.location,
      createdAt: new Date()
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
    console.error('❌ Failed to fetch lost items:', err);
    res.status(500).json({ error: 'Server error' });
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
    console.error('❌ Failed to fetch user lost items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
