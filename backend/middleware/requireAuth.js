const admin = require('../firebaseAdmin');
const User = require('../Model/User');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify Firebase JWT
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Fetch user from DB
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User record not found' });
    }

    // Check Candidate Role
    if (user.role !== 'Candidate') {
      return res.status(403).json({ error: 'Forbidden: Candidate role required' });
    }

    // Check if account is blocked
    if (user.isBlocked) {
      return res.status(403).json({ error: 'Forbidden: Account is blocked' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = requireAuth;
