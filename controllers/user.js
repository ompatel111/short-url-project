const User = require('../models/user');
const { setUser } = require('../service/auth');

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already exists');
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal server error');
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('login', { error: 'Invalid Email or Password' });
    }
    const token = setUser(user);
    res.cookie('uid', token);
    return res.redirect('/');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin
}; 
