const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// Helper to generate unique slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// @route   GET /api/products
// @desc    Get all active products with optional category filters
// @access  Public
router.get('/products', async (req, res) => {
  try {
    const { category, subcategory, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (subcategory) {
      query.subcategory = subcategory;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Fetch Products Error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// @route   GET /api/products/:idOrSlug
// @desc    Get a single product by ID or slug
// @access  Public
router.get('/products/:idOrSlug', async (req, res) => {
  try {
    let product;

    // Check if valid mongoose ID
    if (req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.idOrSlug);
    }

    // Fallback to slug search if not found or not ID
    if (!product) {
      product = await Product.findOne({ slug: req.params.idOrSlug });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Fetch Single Product Error:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

// @route   POST /api/admin/products
// @desc    Create a new product (Admin only)
// @access  Private/Admin
router.post('/admin/products', protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      subcategory,
      image,
      images,
      colors,
      sizes,
      description,
      isNew,
      isBestSeller,
      isSale
    } = req.body;

    if (!name || !price || !category || !subcategory || !image) {
      return res.status(400).json({ message: 'Please provide all required fields (name, price, category, subcategory, image)' });
    }

    let slug = generateSlug(name);
    // Ensure slug uniqueness
    let slugExists = await Product.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${generateSlug(name)}-${counter}`;
      slugExists = await Product.findOne({ slug });
      counter++;
    }

    const product = new Product({
      name,
      slug,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      category,
      subcategory,
      image,
      images: images || [image],
      colors: colors || [],
      sizes: sizes || [],
      description: description || '',
      isNew: isNew || false,
      isBestSeller: isBestSeller || false,
      isSale: isSale || false
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
router.put('/admin/products/:id', protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      subcategory,
      image,
      images,
      colors,
      sizes,
      description,
      isNew,
      isBestSeller,
      isSale
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name) {
      product.name = name;
      // Regenerate slug if name changes
      let slug = generateSlug(name);
      let slugExists = await Product.findOne({ slug, _id: { $ne: req.params.id } });
      let counter = 1;
      while (slugExists) {
        slug = `${generateSlug(name)}-${counter}`;
        slugExists = await Product.findOne({ slug, _id: { $ne: req.params.id } });
        counter++;
      }
      product.slug = slug;
    }

    if (price !== undefined) product.price = parseFloat(price);
    if (originalPrice !== undefined) product.originalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    if (category) product.category = category;
    if (subcategory) product.subcategory = subcategory;
    if (image) product.image = image;
    if (images) product.images = images;
    if (colors) product.colors = colors;
    if (sizes) product.sizes = sizes;
    if (description !== undefined) product.description = description;
    if (isNew !== undefined) product.isNew = isNew;
    if (isBestSeller !== undefined) product.isBestSeller = isBestSeller;
    if (isSale !== undefined) product.isSale = isSale;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/admin/products/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

module.exports = router;
