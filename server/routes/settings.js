const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, adminOnly } = require('../middleware/auth');

// Helper to get or create settings
const getSettings = async () => {
  let settings = await Settings.findOne({});
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

// @route   GET /api/settings
// @desc    Get global settings (public)
// @access  Public
router.get('/settings', async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Fetch Settings Error:', error);
    res.status(500).json({ message: 'Server error fetching settings' });
  }
});

// @route   PUT /api/admin/settings
// @desc    Update global settings
// @access  Private/Admin
router.put('/admin/settings', protect, adminOnly, async (req, res) => {
  try {
    let settings = await getSettings();

    const updates = req.body;
    updates.updatedAt = Date.now();

    settings = await Settings.findOneAndUpdate({}, updates, { new: true, runValidators: true });
    
    res.json(settings);
  } catch (error) {
    console.error('Update Settings Error:', error);
    res.status(500).json({ message: 'Server error updating settings' });
  }
});

module.exports = router;
