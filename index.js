const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const { connectToMongoDB } = require('./connection');
const { restrictToLoggedinUserOnly, checkAuth } = require("./Middleware/auth");
const URL = require('./models/url');

// Routes
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

const app = express();
const PORT = 8005;

connectToMongoDB('mongodb://localhost:27017')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/url', restrictToLoggedinUserOnly, urlRoute);
app.use('/user', userRoute);
app.use('/', checkAuth, staticRoute);

app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { 
        $push: { visitHistory: { timestamp: Date.now() } }
      },
      { new: true }
    );

    if (entry) {
      return res.redirect(entry.redirectURL);
    } else {
      return res.status(404).send('Short URL not found');
    }
  } catch (err) {
    console.error('Error during redirection:', err);
    return res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
