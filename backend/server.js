const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/config'); // Adjust path if needed
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for your frontend origin
app.use(cors({
  origin: 'http://localhost:5177', // your React app URL and port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // enable if you use cookies or auth headers
}));

// Handle preflight requests
app.options('*', cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
