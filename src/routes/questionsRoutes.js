// Import express.js
const express = require("express");
//Import controllers
const controller = require("../controllers/questionController")

// variable that saves express.Router() function.
const router = express.Router();

// Get the answer that has the same id as the question.
router.post('/answer',controller.getAnswer);
//Get all the answers and questions 

// GET method to fetch all questions with request and response parameters.
router.get("/", controller.getAll);

// GET route to fetch a single element from the table with 2 parameters, request and response.
router.get("/:id",controller.getAQuestion);

// POST
// Insert a question.
router.post('/',controller.insertQuestion);

// PUT
// Update a record.
router.put("/:id",controller.updateQuestion);

// DELETE
// Delete a record.
router.delete('/:id', controller.deleteQuestion);

// Export the module created earlier.
module.exports = router;
