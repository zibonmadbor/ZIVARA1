const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect, moderatorOnly } = require('../middleware/auth');

// @route   GET /api/admin/reviews
// @desc    Get all reviews
// @access  Private/Admin
router.get('/', protect, moderatorOnly, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// @route   PUT /api/admin/reviews/:id/status
// @desc    Update review status (approve/reject)
// @access  Private/Admin
router.put('/:id/status', protect, moderatorOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    res.json({ message: 'Review status updated', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating review' });
  }
});

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete a review
// @access  Private/Admin
router.delete('/:id', protect, moderatorOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting review' });
  }
});

module.exports = router;
