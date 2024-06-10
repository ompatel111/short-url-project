const express = require('express');
const URL = require('../models/url');
const router = express.Router();

router.get('/', async (req, res) => {
  if (!req.user) return res.redirect('/login');

  try {
    const allUrls = await URL.find({ createdBy: req.user._id });
    return res.render('home', { urls: allUrls });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return res.status(500).send('Internal Server Error');
  }
});

router.get('/signup', (req, res) => res.render('signup'));

router.get('/login', (req, res) => res.render('login'));

module.exports = router;
