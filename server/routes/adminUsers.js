const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin only
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({
      users: users.map(u => ({
        id: u._id,
        firebaseUid: u.firebase_uid,
        email: u.email,
        full_name: u.full_name,
        phone: u.phone,
        role: u.role,
        is_blocked: u.is_blocked,
        created_at: u.createdAt
      }))
    });
  } catch (error) {
    console.error('Admin GET /users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Super Admin only
router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
  try {
    // Only super_admin can change roles
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only super admins can change user roles' });
    }

    const { role } = req.body;
    const validRoles = ['super_admin', 'admin', 'moderator', 'customer'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent changing your own role
    if (user.firebase_uid === req.firebaseUser.user_id) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin PUT /users/:id/role error:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
});

// @route   PUT /api/admin/users/:id/block
// @desc    Toggle block/unblock a user
// @access  Admin only
router.put('/users/:id/block', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent blocking yourself
    if (user.firebase_uid === req.firebaseUser.user_id) {
      return res.status(400).json({ message: 'You cannot block yourself' });
    }

    // Prevent non-super-admins from blocking admins
    if (
      (user.role === 'super_admin' || user.role === 'admin') &&
      req.user.role !== 'super_admin'
    ) {
      return res.status(403).json({ message: 'You cannot block an admin user' });
    }

    user.is_blocked = !user.is_blocked;
    await user.save();

    res.json({
      message: user.is_blocked ? 'User blocked successfully' : 'User unblocked successfully',
      is_blocked: user.is_blocked
    });
  } catch (error) {
    console.error('Admin PUT /users/:id/block error:', error);
    res.status(500).json({ message: 'Server error toggling user block status' });
  }
});

module.exports = router;
