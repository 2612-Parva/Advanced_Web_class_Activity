const { Product } = require('../models');
const { Op } = require('sequelize');

exports.getProducts = async (req, res) => {
  const { page = 1, limit = 10, sort = 'createdAt', keyword = '' } = req.query;

  const offset = (page - 1) * limit;

  try {
    const products = await Product.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${keyword}%` } },
          { description: { [Op.iLike]: `%${keyword}%` } }
        ]
      },
      order: [[sort.replace('-', ''), sort.startsWith('-') ? 'DESC' : 'ASC']],
      offset: parseInt(offset),
      limit: parseInt(limit)
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
