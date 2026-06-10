const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// All admin user routes require authentication + admin role
router.use(protect);
router.use(adminOnly);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin only
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({
      users: users.map(u => ({
        id: u._id,
        firebaseUid: u.firebaseUid,
        email: u.email,
        full_name: u.fullName,
        phone: u.phone,
        role: u.role,
        is_blocked: u.isBlocked,
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
router.put('/users/:id/role', async (req, res) => {
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
    if (user.firebaseUid === req.firebaseUser.uid) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        email: user.email,
        full_name: user.fullName,
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
router.put('/users/:id/block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent blocking yourself
    if (user.firebaseUid === req.firebaseUser.uid) {
      return res.status(400).json({ message: 'You cannot block yourself' });
    }

    // Prevent non-super-admins from blocking admins
    if (
      (user.role === 'super_admin' || user.role === 'admin') &&
      req.user.role !== 'super_admin'
    ) {
      return res.status(403).json({ message: 'You cannot block an admin user' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
      is_blocked: user.isBlocked
    });
  } catch (error) {
    console.error('Admin PUT /users/:id/block error:', error);
    res.status(500).json({ message: 'Server error toggling user block status' });
  }
});

module.exports = router;
