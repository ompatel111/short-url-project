const { getUser } = require('../service/auth');
const User = require('../models/user');

async function restrictToLoggedinUserOnly(req, res, next) {
  const token = req.cookies?.uid;
  if (!token) return res.redirect('/login');

  const decodedToken = getUser(token);
  if (!decodedToken) return res.redirect('/login');

  req.user = await User.findById(decodedToken.id);
  next();
}

async function checkAuth(req, res, next) {
  const token = req.cookies?.uid;
  if (token) {
    const decodedToken = getUser(token);
    if (decodedToken) {
      req.user = await User.findById(decodedToken.id);
    }
  }
  next();
}

module.exports = {
  restrictToLoggedinUserOnly,
  checkAuth
};
