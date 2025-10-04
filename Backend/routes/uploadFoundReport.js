const express = require('express');
const multer = require('multer');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware'); 
const { uploadToS3 } = require('../utils/s3upload'); // ✅ AWS S3 helper
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
// POST /api/uploadFoundReport
// Protected route — upload found item
// ======================
router.post('/uploadFoundReport', verifyToken, upload.single('image'), async (req, res) => {
  try {
    let imageUrl = null;
    console.log('File received:', req.file);

    // Upload to AWS S3 if image is provided
    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }

    const entry = {
      userId: req.user.id,
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      imagePath: imageUrl, // ✅ store S3 URL
      type: req.body.type || 'found', 
      phone: req.body.mobile,
      category: req.body.category,
      location: req.body.location,
      createdAt: new Date()
    };

    const db = req.app.locals.db;
    const result = await db.collection('formEntries').insertOne(entry);

    res.status(201).json({
      message: 'Found item uploaded successfully',
      id: result.insertedId,
      imageUrl
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Upload and save failed' });
  }
});

// ======================
// GET /api/items/user
// Fetch items uploaded by logged-in user
// ======================
router.get('/items/user', verifyToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userItems = await db
      .collection('formEntries')
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(userItems);
  } catch (err) {
    console.error('❌ Failed to fetch user items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ======================
// GET /api/founditems
// Fetch all found items
// ======================
router.get('/founditems', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const foundItems = await db
      .collection('formEntries')
      .find({ type: 'found' })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(foundItems);
  } catch (err) {
    console.error('❌ Failed to fetch found items:', err);
    res.status(500).json({ error: 'Server error' });
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
// GET /api/allitems
// Fetch all items
// ======================
router.get('/allitems', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const allItems = await db.collection('formEntries').find({}).sort({ createdAt: -1 }).toArray();
    res.json(allItems);
  } catch (err) {
    console.error('❌ Failed to fetch all items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
