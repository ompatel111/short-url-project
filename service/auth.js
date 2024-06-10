const jwt = require('jsonwebtoken');
const secret = 'YourSecureSecretKey'; // Replace this with a strong secret key

function setUser(user) {
  const payload = { id: user._id, email: user.email };
  return jwt.sign(payload, secret, { expiresIn: '1h' }); // Token valid for 1 hour
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    console.error('JWT verification error:', err);
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
