const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user in MongoDB after Firebase user creation
// @access  Private (requires Firebase ID Token)
router.post('/register', protect, async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const { uid, email } = req.firebaseUser;

    if (!fullName) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    // Check if user already exists in MongoDB
    let user = await User.findOne({ firebaseUid: uid });
    if (user) {
      return res.status(400).json({ message: 'User already exists in database' });
    }

    // Determine initial role (automatic elevation for demo accounts)
    let role = 'customer';
    if (email === 'admin@zivara.com') {
      role = 'super_admin';
    } else if (email === 'moderator@zivara.com') {
      role = 'moderator';
    }

    // Create user profile in MongoDB
    user = new User({
      firebaseUid: uid,
      email,
      fullName,
      phone: phone || '',
      role
    });

    await user.save();

    res.status(201).json({
      message: 'User profile registered successfully',
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        full_name: user.fullName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration Route Error:', error);
    res.status(500).json({ message: 'Server error registering user profile' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile (syncs MongoDB and Firebase)
// @access  Private (requires Firebase ID Token)
router.get('/me', protect, async (req, res) => {
  try {
    const { uid, email, name } = req.firebaseUser;

    let user = req.user; // Retrieved in protect middleware

    // If user is authenticated in Firebase but doesn't exist in MongoDB yet
    // (e.g. Google Sign-In signup, or database was reset), auto-create profile
    if (!user) {
      let role = 'customer';
      if (email === 'admin@zivara.com') {
        role = 'super_admin';
      } else if (email === 'moderator@zivara.com') {
        role = 'moderator';
      }

      user = new User({
        firebaseUid: uid,
        email,
        fullName: name || email.split('@')[0],
        role
      });
      await user.save();
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account is blocked. Please contact support.' });
    }

    res.json({
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        full_name: user.fullName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Auth/Me Route Error:', error);
    res.status(500).json({ message: 'Server error retrieving user auth profile' });
  }
});

// @route   POST /api/auth/login
// @desc    Login sync route (verifies token, registers if not exists)
// @access  Private (requires Firebase ID Token)
router.post('/login', protect, async (req, res) => {
  try {
    const { uid, email, name } = req.firebaseUser;
    let user = req.user;

    // Auto-create if not exists
    if (!user) {
      let role = 'customer';
      if (email === 'admin@zivara.com') {
        role = 'super_admin';
      } else if (email === 'moderator@zivara.com') {
        role = 'moderator';
      }

      user = new User({
        firebaseUid: uid,
        email,
        fullName: name || email.split('@')[0],
        role
      });
      await user.save();
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account is blocked. Please contact support.' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        full_name: user.fullName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Auth/Login Sync Error:', error);
    res.status(500).json({ message: 'Server error in login sync' });
  }
});

module.exports = router;
