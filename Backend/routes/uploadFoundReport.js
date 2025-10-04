const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const verifyToken = require('../middleware/authMiddleware'); // ✅ add auth middleware

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // make sure the 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ✅ Protected route — only logged-in users can upload found items
router.post('/uploadFormData', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const entry = {
      userId: req.user.id, // store user id from JWT
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      imagePath: imagePath,
      type: req.body.type,
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

// Public route — fetch all found items
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

// Public route — fetch all items
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
