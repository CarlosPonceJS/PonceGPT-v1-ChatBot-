// Get input and button by id
const question = document.getElementById('txtQuestion');
const answer = document.getElementById('txtAnswer');
const btnSave = document.getElementById('btnSave');

// Event when clicking save button
btnSave.addEventListener('click', () => {
    if (question.value != "" && answer.value!="")
        saveQuestion();
    else{
        notification("color:white; background-color: rgba(212, 171, 49, 0.703); width: 800px; padding: 10px; border: none;", "Text cannot be empty");
    }
});

//Function that checks if question doesn't already exist on DB and insert it into database 
function saveQuestion() {
    // Object to send as in the API
    const data = {
        question: question.value,
        answer: answer.value
    };
    //API to get all records
    fetch('http://localhost:2000/api/questions/')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(existingQuestions => {
        // Check if the question already exists
        const questionExists = existingQuestions.some(item => item.question === data.question);

        if (questionExists) {
            // Show notification if question already exists
            notification("color:white; background-color: rgba(212, 171, 49, 0.703); !important; width: 800px; padding: 10px; border: none;", "Question already exists");
        } else {
            // Insert a new question
            fetch('http://localhost:2000/api/questions/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                // Show success notification
                notification("color:white; background-color: #1987547d !important; width: 800px; padding: 10px; border: none;", "Question saved successfully!");
                question.value = "";
                answer.value = "";
            })
            .catch(error => {
                //Default error message
                console.log("Error: " + error);
                notification("color:white; background-color: #c226368b !important; width: 800px; padding: 10px; border: none;", "Error connecting to the database");
            });
        }
    })
    .catch(error => {
        console.log("Error: " + error);
        notification("color:white; background-color: #c226368b !important; width: 800px; padding: 10px; border: none;", "Error connecting to the database");
    });
}


// Function to create event alerts, with the CSS style parameters and the text to be displayed
function notification(style, text) {
    var message = document.createElement("div");
    message.innerHTML = `
    <div class="container d-flex justify-content-center">
    <div class="alert alert-success" style="${style}" role="alert">
        <p>${text}</p>
    </div>
</div>
`;
    // Add the notification to the document
    document.body.appendChild(message);

    // After 4 seconds, remove the notification
    setTimeout(() => {
        document.body.removeChild(message);
    }, 4000);
}
