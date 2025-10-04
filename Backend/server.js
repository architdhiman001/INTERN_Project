const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const uploadFoundReport = require('./routes/uploadFoundReport');
const uploadLostReport =require('./routes/uploadLostReport');
const authRoutes = require('./routes/auth');
const app = express();
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', uploadFoundReport);
app.use('/api', uploadLostReport);
// Home route
app.get('/', (req, res) => {
  res.send('Image Upload API is running');
});

// MongoDB Connection
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'Reportfound'; 

MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then(client => {
    console.log('✅ Connected to MongoDB');
    const db = client.db(dbName);
    app.locals.db = db;
    const PORT = 5050;
    app.listen(PORT, () => {
      console.log(` Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

  // Single item detail route
app.get('/api/item/:id', async (req, res) => {
  const db = req.app.locals.db;
  const { ObjectId } = require('mongodb');
  const id = req.params.id;

  try {
    const item = await db.collection('formEntries').findOne({ _id: new ObjectId(id) });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  
  
