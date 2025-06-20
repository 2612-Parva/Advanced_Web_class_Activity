const { DataTypes } = require('sequelize'); 

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
  return Product;
};