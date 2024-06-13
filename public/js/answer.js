const table = document.getElementById("tableQuestions");
let Id = null;

function showAnswers() {
    // Fetch data from the API endpoint
    fetch('http://localhost:2000/api/questions/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Clear any existing content in the table
            table.innerHTML = '';

            // Populate the table with questions and answers
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="t">${item.question}</td>
                    <td class="t">${item.answer}</td>
                    <td class="t">
                        <button class="btn btn-primary edit" data-id="${item.id}" style="width:120px">Edit</button>
                        <button class="btn btn-danger delete" data-id="${item.id}" style="width:120px">Delete</button>
                    </td>
                `;
                table.appendChild(row);
            });

            // Add event listeners for delete buttons
            document.querySelectorAll('.delete').forEach(button => {
                button.addEventListener('click', function() {
                    Id = this.getAttribute('data-id');
                    $('#deleteModal').modal('show');
                });
            });

            // Add event listeners for edit buttons
            document.querySelectorAll('.edit').forEach(button => {
                button.addEventListener('click', function() {
                    Id = this.getAttribute('data-id');
                    $('#editModal').modal('show'); 
                    loadRecordData(Id);
                });
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle error if needed
        });
}

function closeModal() {
    // Hide the modal using Bootstrap's modal method
    $('#deleteModal').modal('hide');
    $('#editModal').modal('hide');
}

function loadRecordData(recordId) {
    fetch(`http://localhost:2000/api/questions/${recordId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(recordData => {
            // Process the fetched record data
            displayRecordData(recordData);
        })
        .catch(error => {
            console.error('There was a problem loading the record data:', error);
            // Handle error if needed
        });
}

function displayRecordData(recordData) {
    // Update your frontend interface with the fetched record data
    document.getElementById('question').value = recordData[0].question;
    document.getElementById('answer').value = recordData[0].answer;
    // Update other elements as needed
}

// Event listener for editing a record
document.getElementById("confirmEdit").addEventListener("click", function(){
    const question = document.getElementById("question");
    const answer = document.getElementById("answer");
    const values = {
        question: question.value,
        answer: answer.value
    };
    if (Id) {
        fetch(`http://localhost:2000/api/questions/${Id}`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(values)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not okay");
            }

            showAnswers();
            $('#editModal').modal('hide');
        })
        .catch(err => {
            console.error(err);
        });
    }
});

// Event listener for confirming the deletion
document.getElementById('confirmDelete').addEventListener('click', function() {
    if (Id) {
        fetch(`http://localhost:2000/api/questions/${Id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Refresh the table data
            showAnswers();
            // Hide the modal
            $('#deleteModal').modal('hide');
        })
        .catch(error => {
            console.error('There was a problem with the delete operation:', error);
            // Handle error if needed
        });
    }
});

// Ensure the modal is properly hidden and backdrop removed when modal is hidden
$('#deleteModal').on('hidden.bs.modal', function () {
    // Ensure no backdrop is left behind
    $('.modal-backdrop').remove();
});

$('#editModal').on('hidden.bs.modal', function () {
    // Ensure no backdrop is left behind
    $('.modal-backdrop').remove();
});

// Add event listener to the close button to call closeModal
document.getElementById('closeButton').addEventListener('click', closeModal);

// Call the showAnswers function when the DOM is loaded
document.addEventListener('DOMContentLoaded', showAnswers);
