const Product = require('../models/product');

// @desc    Get all products with pagination, search, and sorting
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = 'createdAt',
    keyword = ''
  } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, parseInt(limit)); // Prevent excessive limits
  const skip = (pageNum - 1) * limitNum;

  const sortField = sort.replace('-', '');
  const sortOrder = sort.startsWith('-') ? -1 : 1;

  try {
    const searchFilter = keyword ? {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    } : {};

    const [products, total] = await Promise.all([
      Product.find(searchFilter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(), // Convert to plain JS objects
      Product.countDocuments(searchFilter)
    ]);

    // Ensure image field exists in all responses
    const normalizedProducts = products.map(product => ({
      ...product,
      image: product.image || null // Explicit null instead of undefined
    }));

    res.json({
      products: normalizedProducts,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    console.error('Get Products Error:', err);
    res.status(500).json({ 
      msg: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Create a new product with image validation
// @route   POST /api/products
// @access  Private (Add your auth middleware)
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    
    // Required field validation
    if (!title || !price) {
      return res.status(400).json({ 
        msg: 'Title and price are required',
        fields: { title: !title, price: !price }
      });
    }

    // Image URL validation
    if (image && !isValidUrl(image)) {
      return res.status(400).json({ 
        msg: 'Invalid image URL format',
        field: 'image'
      });
    }

    const newProduct = new Product({
      title: title.trim(),
      description: description?.trim(),
      price: parseFloat(price),
      image: image?.trim() || null // Explicit null for empty
    });

    const savedProduct = await newProduct.save();
    
    res.status(201).json({
      _id: savedProduct._id,
      title: savedProduct.title,
      description: savedProduct.description || null,
      price: savedProduct.price,
      image: savedProduct.image, // Will be null if not provided
      createdAt: savedProduct.createdAt
    });
    
  } catch (err) {
    console.error('Create Product Error:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        msg: 'Validation failed',
        errors: Object.entries(err.errors).reduce((acc, [field, { message }]) => {
          acc[field] = message;
          return acc;
        }, {})
      });
    }

    res.status(500).json({ 
      msg: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Update product by ID with proper image handling
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, description, price, image } = req.body;

    // Validate image URL if provided
    if (image !== undefined && image !== null && !isValidUrl(image)) {
      return res.status(400).json({ 
        msg: 'Invalid image URL format',
        field: 'image'
      });
    }

    // Build update object
    const updates = {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description?.trim() }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(image !== undefined && { image: image?.trim() || null }) // Explicit null
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updates,
      { 
        new: true,
        runValidators: true,
        context: 'query' // Required for proper validation
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json({
      _id: updatedProduct._id,
      title: updatedProduct.title,
      description: updatedProduct.description || null,
      price: updatedProduct.price,
      image: updatedProduct.image, // Will reflect the update
      updatedAt: updatedProduct.updatedAt
    });
    
  } catch (err) {
    console.error('Update Product Error:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        msg: 'Validation failed',
        errors: Object.entries(err.errors).reduce((acc, [field, { message }]) => {
          acc[field] = message;
          return acc;
        }, {})
      });
    }

    res.status(500).json({ 
      msg: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Delete product by ID
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ 
      msg: 'Product deleted successfully',
      deletedProduct: {
        _id: deletedProduct._id,
        title: deletedProduct.title,
        image: deletedProduct.image // Include image in response
      }
    });
    
  } catch (err) {
    console.error('Delete Product Error:', err);
    res.status(500).json({ 
      msg: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};