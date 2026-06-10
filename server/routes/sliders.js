const express = require('express');
const router = express.Router();
const Slider = require('../models/Slider');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/sliders
// @desc    Get all active sliders for homepage
// @access  Public
router.get('/sliders', async (req, res) => {
  try {
    const sliders = await Slider.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(sliders);
  } catch (error) {
    console.error('Fetch Sliders Error:', error);
    res.status(500).json({ message: 'Server error fetching sliders' });
  }
});

// @route   GET /api/admin/sliders
// @desc    Get all sliders (including inactive) for admin
// @access  Private/Admin
router.get('/admin/sliders', protect, adminOnly, async (req, res) => {
  try {
    const sliders = await Slider.find({}).sort({ order: 1, createdAt: -1 });
    res.json(sliders);
  } catch (error) {
    console.error('Admin Fetch Sliders Error:', error);
    res.status(500).json({ message: 'Server error fetching sliders' });
  }
});

// @route   POST /api/admin/sliders
// @desc    Create a new slider
// @access  Private/Admin
router.post('/admin/sliders', protect, adminOnly, async (req, res) => {
  try {
    const { title, subtitle, image, link, buttonText, isActive, order } = req.body;

    if (!title || !image) {
      return res.status(400).json({ message: 'Title and image are required' });
    }

    const slider = new Slider({
      title,
      subtitle,
      image,
      link: link || '/products',
      buttonText: buttonText || 'Shop Now',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    await slider.save();
    res.status(201).json(slider);
  } catch (error) {
    console.error('Create Slider Error:', error);
    res.status(500).json({ message: 'Server error creating slider' });
  }
});

// @route   PUT /api/admin/sliders/:id
// @desc    Update a slider
// @access  Private/Admin
router.put('/admin/sliders/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, subtitle, image, link, buttonText, isActive, order } = req.body;

    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' });
    }

    if (title) slider.title = title;
    if (subtitle !== undefined) slider.subtitle = subtitle;
    if (image) slider.image = image;
    if (link !== undefined) slider.link = link;
    if (buttonText !== undefined) slider.buttonText = buttonText;
    if (isActive !== undefined) slider.isActive = isActive;
    if (order !== undefined) slider.order = order;

    await slider.save();
    res.json(slider);
  } catch (error) {
    console.error('Update Slider Error:', error);
    res.status(500).json({ message: 'Server error updating slider' });
  }
});

// @route   DELETE /api/admin/sliders/:id
// @desc    Delete a slider
// @access  Private/Admin
router.delete('/admin/sliders/:id', protect, adminOnly, async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' });
    }

    await Slider.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slider deleted successfully' });
  } catch (error) {
    console.error('Delete Slider Error:', error);
    res.status(500).json({ message: 'Server error deleting slider' });
  }
});

module.exports = router;
