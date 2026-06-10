const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/categories
// @desc    Get all active categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error('Fetch Categories Error:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// @route   GET /api/admin/categories
// @desc    Get all categories for admin
// @access  Private/Admin
router.get('/admin/categories', protect, adminOnly, async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ order: 1, createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error('Admin Fetch Categories Error:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// @route   POST /api/admin/categories
// @desc    Create a new category
// @access  Private/Admin
router.post('/admin/categories', protect, adminOnly, async (req, res) => {
  try {
    const { name, slug, description, image, isActive, order } = req.body;

    if (!name || !slug || !image) {
      return res.status(400).json({ message: 'Name, slug, and image are required' });
    }

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }

    const category = new Category({
      name,
      slug,
      description,
      image,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Create Category Error:', error);
    res.status(500).json({ message: 'Server error creating category' });
  }
});

// @route   PUT /api/admin/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put('/admin/categories/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, slug, description, image, isActive, order } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) category.name = name;
    if (slug) {
      if (slug !== category.slug) {
        const exists = await Category.findOne({ slug });
        if (exists) {
          return res.status(400).json({ message: 'Category with this slug already exists' });
        }
      }
      category.slug = slug;
    }
    if (description !== undefined) category.description = description;
    if (image) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;
    if (order !== undefined) category.order = order;

    await category.save();
    res.json(category);
  } catch (error) {
    console.error('Update Category Error:', error);
    res.status(500).json({ message: 'Server error updating category' });
  }
});

// @route   DELETE /api/admin/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete('/admin/categories/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete Category Error:', error);
    res.status(500).json({ message: 'Server error deleting category' });
  }
});

module.exports = router;
