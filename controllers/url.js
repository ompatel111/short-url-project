const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortUrl(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "URL is required" });
  const shortID = shortid.generate(); // Generate random short id
  
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });

  const allUrls = await URL.find({}); // Fetch all URLs to display in the table
  return res.render('home', {
    id: shortID,
    urls: allUrls,
  });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  try {
    const result = await URL.findOne({ shortId });
    if (result) {
      return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory });
    } else {
      return res.status(404).json({ error: "Short URL not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
};
