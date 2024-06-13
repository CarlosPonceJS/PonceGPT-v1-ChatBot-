// Import the mysql module 
const mysql = require("mysql");

// Load environment variables from dotenv
require('dotenv').config();

// DB CONNECTION
// Creation of an object that will contain 5 elements required to know which database we want to connect to.
const connection = mysql.createConnection({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    port: 3306
});

connection.connect((error) => {
    if (error) throw error;
    else console.log("Connection succeeded");
});

const controller = {}

controller.getAnswer = (req, res) => {
    // Get the question from the request body
    const question = req.body.question;
    
    // Define the SQL query to call the stored procedure
    const query = "CALL getAnswer(?)";

    // Execute the SQL query with the question parameter
    connection.query(query, [question], (error, results) => {
        // If there is an error, handle it
        if (error) {
            console.error(error);
            res.status(500).send("Error connecting to the database");
        } else {
            // Check if there are results returned from the stored procedure
            if (results && results.length > 0 && results[0][0]) {
                // Extract the answer from the first row of the first result set
                const answer = results[0][0].answer;
                res.json({ answer });
            } else {
                // If no answer is found, return a default message
                res.json({ answer: "I don't know how to answer your question. Please ask another question or submit it for review." });
            }
        }
    });
};


controller.getAll = (req, res) => {
    // Create the SQL query with an anonymous function with 2 parameters, error and results.
    connection.query('SELECT * from v_showAll;', (error, results) => {
        // If there is an error, show it.
        if (error) {
            console.error(error);
            res.status(500).send('Error querying the database');
        // If not, show the results.
        } else {
            res.json(results);
        }
    });
}

controller.getAQuestion =  (req, res) => {
    // Get the id as a parameter in a constant 
    const questionId = parseInt(req.params.id);
    // SQL query
    const query = "CALL showQuestion(?)";
    // Execute the query with prepared statements to avoid SQL injection.
    connection.query(query, [questionId], (error, results) => {
        // If there is an error, show it.
        if (error) {
            res.status(500).send("Error querying the database");
        // If not, show the results.
        } else {
            res.json(results[0]);
        }
    });
}

controller.insertQuestion =  (req, res) => {
    // Save the question as the body of an object.
    const questionValue = req.body.question;
    const answerValue = req.body.answer;
    // Query with prepared statement.
    const sqlQuery = 'CALL InsertBoth(?, ?);';
    // Execute the query
    connection.query(sqlQuery, [questionValue, answerValue], (error, results) => {
        // If there is an error, show it.
        if (error) {
            console.error(error);
            res.status(500).send("Error querying the database");
        // If not, show the results.
        } else {
            res.json(results);
        }
    });
}

controller.updateQuestion =  (req, res) => {
    // SQL query with prepared statements.
    const sql = 'CALL UpdateBoth(?, ?, ?);';
    // Object with the body as the body of the object and the id as API parameters.
    const values = [req.body.question, req.body.answer, parseInt(req.params.id)];
    
    // Execute the query with a function with 2 parameters, error and results.
    connection.query(sql, values, (error, results) => {
        // If there is an error, show it.
        if (error) {
            res.status(500).send('There was an error with the database');
        // If not, show the results.
        } else {
            res.json(results);
        }
    });
}

controller.deleteQuestion = (req, res) => {
    // Id as API parameter.
    const questionId = parseInt(req.params.id);
    // SQL query with prepared statements.
    const sql = `CALL DeleteBoth(?);`;
    // Execute the query.
    connection.query(sql, questionId, (error, results) => {
        // If there is an error, show it.
        if (error) {
            res.send(500).send("Error, that id doesn't exist");
        // If not, show the results.
        } else {
            res.json(results);
        }
    });
}


module.exports = controller;