const express = require('express');
const router = express.Router();
const { getHeadlines, searchNews } = require('../controllers/newsController');

router.get('/headlines', getHeadlines);
router.get('/search', searchNews);

module.exports = router;
