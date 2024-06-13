// IMPORT VARIABLES AND USE JSON DATA TYPE.
const express = require("express");
// Middleware cors used to open the app from another server.
const cors = require("cors");
// Save a express type constant.
const app = express();
// API questions.
const questions = require('./routes/questionsRoutes');
//Page routes
const pageRoutes = require('./routes/pageRoutes')

// Use cors.
app.use(cors());
// Use files to display .json
app.use(express.json());
// Use questions API
app.use('/api/questions', questions);
//Use pageRoutes
app.use(require('./routes/pageRoutes'))

const port = process.env.PORT || 2000;
app.listen(port, () => console.log("Listening on port " + port));