const express = require('express');
const multer = require('multer');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware'); 
const { uploadToS3 } = require('../utils/s3upload');
require('dotenv').config();

// ======================
// Multer setup (in-memory storage for S3)
// ======================
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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
    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }

    const createdAt = new Date();
    const baseUrgency = req.body.type === 'lost' ? 10 : 5;
    const hoursSinceReported = 0; // just created
    const urgencyScore = Math.max(baseUrgency - Math.floor(hoursSinceReported / 24), 1);

    const entry = {
      userId: req.user.id,
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      imagePath: imageUrl,
      type: req.body.type || 'found',
      phone: req.body.mobile,
      category: req.body.category,
      location: req.body.location,
      createdAt,
      urgencyScore
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
router.get('/founditems', async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // Fetch items of type 'found'
    let foundItems = await db.collection('formEntries').find({ type: 'found' }).toArray();

    // Optional: You can compute urgencyScore for found items if you want
    // Example: sorting by recent reports
    foundItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(foundItems);
  } catch (err) {
    console.error('❌ Failed to fetch found items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ======================
// GET /api/allitems
// Fetch all items sorted by urgency
// ======================
router.get('/allitems', async (req, res) => {
  try {
    const db = req.app.locals.db;
    let allItems = await db.collection('formEntries').find({}).toArray();

    allItems = allItems.map(item => {
      const baseUrgency = item.type === 'lost' ? 10 : 5;
      const hoursSinceReported = (Date.now() - new Date(item.createdAt)) / (1000 * 60 * 60);
      item.urgencyScore = Math.max(baseUrgency - Math.floor(hoursSinceReported / 24), 1);
      return item;
    });

    allItems.sort((a, b) => b.urgencyScore - a.urgencyScore);
    res.json(allItems);
  } catch (err) {
    console.error('❌ Failed to fetch all items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
