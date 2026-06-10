const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');
const User = require('../models/User');

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || '';

// Client to dynamically fetch Google's public certificates for Firebase Auth
const jwksClient = jwksRsa({
  jwksUri: 'https://www.googleapis.com/serviceaccounts/v1/jwk/securetoken@system.gserviceaccount.com',
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000 // 10 minutes
});

function getKey(header, callback) {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Main protect middleware
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode the JWT to check header KID and verify signature with Google certificates
      jwt.verify(
        token,
        getKey,
        {
          audience: FIREBASE_PROJECT_ID,
          issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
          algorithms: ['RS256']
        },
        async (err, decoded) => {
          if (err) {
            console.error('Token Verification Error:', err.message);
            return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
          }

          // Attach user claims to request object
          req.firebaseUser = decoded;

          // Find user in MongoDB
          const user = await User.findOne({ firebaseUid: decoded.uid });
          req.user = user; // Will be null if user registered in Firebase but not in MongoDB yet

          next();
        }
      );
    } catch (error) {
      console.error('Auth middleware execution error:', error);
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    // If authorization header is absent, check if we want to allow guest/public access, or block
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Admin authorization guard middleware
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Admin authorization required' });
  }
};

// Moderator/Admin guard middleware
const moderatorOnly = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'admin' ||
      req.user.role === 'super_admin' ||
      req.user.role === 'moderator')
  ) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Moderator authorization required' });
  }
};

module.exports = { protect, adminOnly, moderatorOnly };
