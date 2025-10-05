// server.js
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const uploadFoundReport = require('./routes/uploadFoundReport');
const uploadLostReport = require('./routes/uploadLostReport');
const authRoutes = require('./routes/auth');
const myItemsRoutes = require('./routes/myitems');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Home route
app.get('/', (req, res) => {
  res.send('✅ Lost & Found API is running');
});

// MongoDB Atlas Connection
const mongoUrl = process.env.MONGO_URI;
const dbName = 'Reportfound';

async function startServer() {
  try {
    // Use the modern connection method (no custom TLS options)
    const client = new MongoClient(mongoUrl);
    await client.connect();

    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db(dbName);
    app.locals.db = db;

    // Register routes only after DB is ready
    app.use('/api/auth', authRoutes);
    app.use('/api', uploadFoundReport);
    app.use('/api', uploadLostReport);
    app.use('/api', myItemsRoutes);

    // Single item detail route
    app.get('/api/item/:id', async (req, res) => {
      const { ObjectId } = require('mongodb');
      const id = req.params.id;
      try {
        const item = await db.collection('formEntries').findOne({ _id: new ObjectId(id) });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
      } catch (err) {
        console.error('Error fetching item:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Start server
    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

startServer();
