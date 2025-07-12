const mongoose = require('mongoose');
const validator = require('validator');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      minlength: [3, 'Title must be at least 3 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be at least 0'],
      set: v => parseFloat(v.toFixed(2)) // Ensure 2 decimal places
    },
    image: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          // Validate only if URL is provided
          if (!v) return true;
          return validator.isURL(v, {
            protocols: ['http', 'https'],
            require_protocol: true,
            allow_underscores: true
          });
        },
        message: props => `${props.value} is not a valid image URL!`
      },
      default: null // Explicit null instead of undefined
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for formatted image URL
productSchema.virtual('imageUrl').get(function() {
  if (!this.image) return null;
  
  // Transform to HTTPS if needed
  if (this.image.startsWith('http://')) {
    return this.image.replace('http://', 'https://');
  }
  return this.image;
});

// Middleware to clean data before saving
productSchema.pre('save', function(next) {
  // Remove any URL fragments or query params if needed
  if (this.image) {
    try {
      const url = new URL(this.image);
      url.hash = '';
      url.search = '';
      this.image = url.toString();
    } catch (err) {
      // If URL is invalid, set to null
      this.image = null;
    }
  }
  next();
});

// Query helper for products with images
productSchema.query.withImages = function() {
  return this.where({ image: { $ne: null } });
};

// Static method for price range search
productSchema.statics.findByPriceRange = function(min, max) {
  return this.find({ price: { $gte: min, $lte: max } });
};

module.exports = mongoose.model('Product', productSchema);