const express = require('express');
const cors = require('cors');
const { sequelize, User, Product } = require('./models'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }) 
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });