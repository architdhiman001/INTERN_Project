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
// POST /api/uploadFormData
// Protected route — upload found/lost item
// ======================
router.post('/uploadFoundReport', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file ? req.file.path : null;

    const entry = {
      userId: req.user.id, // 🔑 track user
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      imagePath: imagePath,
      type: req.body.type, // "found" or "lost"
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
    console.error('Failed to fetch user items:', err);
    res.status(500).send('Server error');
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
    console.error('Failed to fetch found items:', err);
    res.status(500).send('Server error');
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
// GET /api/allitems
// Fetch all items
// ======================
router.get('/allitems', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const allItems = await db.collection('formEntries').find({}).sort({ createdAt: -1 }).toArray();
    res.json(allItems);
  } catch (err) {
    console.error('Failed to fetch all items:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;