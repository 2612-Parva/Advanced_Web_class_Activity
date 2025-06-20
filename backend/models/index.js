const { Sequelize, DataTypes } = require('sequelize'); 
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);


const User = require('./user')(sequelize, DataTypes);
const Product = require('./product')(sequelize, DataTypes);


sequelize.sync({ alter: true })
  .then(() => console.log('Tables synced successfully.'))
  .catch(err => console.error(' Sync error:', err));

module.exports = {
  sequelize,
  User,
  Product,
};