const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware'); // JWT auth middleware
const { ObjectId } = require('mongodb');

// ======================
// GET /api/myitems
// Fetch all items posted by the logged-in user
// ======================
router.get('/myitems', verifyToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.id; // from JWT
    const items = await db.collection('formEntries')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(items);
  } catch (err) {
    console.error('Failed to fetch user items:', err);
    res.status(500).send('Server error');
  }
});

// ======================
// DELETE /api/item/:id
// Delete an item posted by the logged-in user
// ======================
router.delete('/item/:id', verifyToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const id = req.params.id;

    // Find the item
    const item = await db.collection('formEntries').findOne({ _id: new ObjectId(id) });
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Check if the logged-in user owns this item
    if (item.userId !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    // Delete the item
    await db.collection('formEntries').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error('Failed to delete item:', err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
