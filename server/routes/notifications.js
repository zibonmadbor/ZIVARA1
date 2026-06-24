const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect, moderatorOnly } = require('../middleware/auth');

// @route   GET /api/admin/notifications
// @desc    Get all notifications
// @access  Private/Admin
router.get('/', protect, moderatorOnly, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).lean();
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
});

// @route   PUT /api/admin/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private/Admin
router.put('/mark-all-read', protect, moderatorOnly, async (req, res) => {
  try {
    await Notification.updateMany({ is_read: false }, { is_read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error marking notifications read' });
  }
});

// @route   PUT /api/admin/notifications/:id/read
// @desc    Mark single notification as read
// @access  Private/Admin
router.put('/:id/read', protect, moderatorOnly, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { is_read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating notification' });
  }
});

// @route   DELETE /api/admin/notifications/:id
// @desc    Delete a notification
// @access  Private/Admin
router.delete('/:id', protect, moderatorOnly, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting notification' });
  }
});

module.exports = router;
