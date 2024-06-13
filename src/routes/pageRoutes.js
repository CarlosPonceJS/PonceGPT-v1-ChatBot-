//Express.js module
const express = require('express');
const router = express.Router();
//Require path module
const path = require("path");
//Go to root directory
const rootDir = path.resolve(__dirname, '..','..');

// Constants to save the paths to the JavaScript and CSS folders
router.use(express.static(path.join(rootDir, 'public')))


router.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'index.html'));
});

router.get('/insertQuestion', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'question.html'));
});

router.get('/questionsCRUD', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'answer.html'));
});

module.exports = router;