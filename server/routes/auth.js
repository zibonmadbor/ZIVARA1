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
    const { user_id: uid, email } = req.firebaseUser;

    if (!fullName) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    // Determine initial role
    let role = 'customer';
    if (email === 'zibonmadbor@gmail.com') {
      role = 'super_admin';
    }

    // Upsert: create if not exists, update if exists
    let user = await User.findOne({ firebase_uid: uid });
    if (user) {
      // Update existing user info
      user.full_name = fullName;
      if (phone) user.phone = phone;
      // Upgrade role if they're the super admin email but were created as customer
      if (email === 'zibonmadbor@gmail.com' && user.role === 'customer') {
        user.role = 'super_admin';
      }
      await user.save();
    } else {
      // Create new user profile in MongoDB
      user = new User({
        firebase_uid: uid,
        email,
        full_name: fullName,
        phone: phone || null,
        role
      });
      await user.save();
    }

    res.status(201).json({
      message: 'User profile registered successfully',
      user: {
        id: user._id,
        firebase_uid: user.firebase_uid,
        email: user.email,
        full_name: user.full_name,
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
    const { user_id: uid, email, name } = req.firebaseUser;

    let user = req.user; // Retrieved in protect middleware

    // If user is authenticated in Firebase but doesn't exist in MongoDB yet
    // (e.g. Google Sign-In signup, or database was reset), auto-create profile
    if (!user) {
      let role = 'customer';
      if (email === 'zibonmadbor@gmail.com') {
        role = 'super_admin';
      }

      user = new User({
        firebase_uid: uid,
        email,
        full_name: name || email.split('@')[0],
        role
      });
      await user.save();
    }

    if (user.is_blocked) {
      return res.status(403).json({ message: 'Account is blocked. Please contact support.' });
    }

    res.json({
      user: {
        id: user._id,
        firebase_uid: user.firebase_uid,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zip_code: user.zip_code,
        country: user.country,
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
    const { user_id: uid, email, name } = req.firebaseUser;
    let user = req.user;

    // Auto-create if not exists
    if (!user) {
      let role = 'customer';
      if (email === 'zibonmadbor@gmail.com') {
        role = 'super_admin';
      }

      user = new User({
        firebase_uid: uid,
        email,
        full_name: name || email.split('@')[0],
        role
      });
      await user.save();
    }

    if (user.is_blocked) {
      return res.status(403).json({ message: 'Account is blocked. Please contact support.' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        firebase_uid: user.firebase_uid,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zip_code: user.zip_code,
        country: user.country,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Auth/Login Sync Error:', error);
    res.status(500).json({ message: 'Server error in login sync' });
  }
});

// @route   PUT /api/auth/me
// @desc    Update current user profile info
// @access  Private (requires Firebase ID Token)
router.put('/me', protect, async (req, res) => {
  try {
    const { full_name, phone, address, city, state, zip_code, country } = req.body;
    let user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    if (full_name !== undefined) user.full_name = full_name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (zip_code !== undefined) user.zip_code = zip_code;
    if (country !== undefined) user.country = country;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firebase_uid: user.firebase_uid,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zip_code: user.zip_code,
        country: user.country,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error updating user profile' });
  }
});

module.exports = router;
