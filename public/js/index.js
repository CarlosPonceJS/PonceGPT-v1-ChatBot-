// Messages Area (Global Variable)
var messages = document.getElementById('messageArea');
var image = document.getElementById('imgLogo');
var navChatButton = document.getElementById('btnGPT');
// Function to be executed when the document is loaded.
document.addEventListener('DOMContentLoaded', () => {
    // Get the ids of:
    // Message to be sent.
    var message = document.getElementById('chatBox');
    // Button to send the message.
    var askButton = document.getElementById('btnAsk');
    // Button to clear messages in the navbar.
    var clearNavButton = document.getElementById('btnClearNav');

    // Load saved messages.
    loadSavedMessages();


    // Keydown event for ENTER.
    message.addEventListener('keydown', (event) => {
        // If ENTER is pressed, send the message.
        if (event.key == "Enter") {
            sendMessage();
        }
    });

    // Click event for the send button.
    askButton.addEventListener('click', () => {
        // If the button is clicked, send the message.
        sendMessage();
    });

    // Click event for the clear messages button in the navbar.
    clearNavButton.addEventListener('click', () => {
        clearMessages();
    });

    // Function to send message.
    function sendMessage() {
        // Text value of the entered message without whitespace using .trim()
        var textMessage = message.value.trim();
        // Transparent color button
        askButton.style.backgroundColor = "#00000000";
        // If the message is not empty
        if (textMessage !== "") {
            // Remove the logo
            if (image) {
                image.style.display = 'none';
            }
            // Add the message
            addMessage('You', textMessage);
            // Save the message to localStorage
            saveMessage('You', textMessage);
            // Get response from the chatbot
            getResponse(textMessage);
            // Clear the text box
            message.value = "";
            // Scroll down
            scrollToBottom();
        }
    }
});

// Function to always scroll to the latest sent message
function scrollToBottom() {
    // Scroll down.
    messages.scrollTop = messages.scrollHeight;
}

// Function to add a message to the message container
function addMessage(sender, text) {
    // Create a div
    var messageElement = document.createElement('div');
    // Specify message styles and structure
    messageElement.innerHTML = `
        <div style="padding: 10px; border-radius: 15px; margin-bottom:20px;">
            <span class="fw-bold">${sender}</span>
            <p>${text}</p>
        </div>
    `;
    // Add to the message container
    messages.appendChild(messageElement);
}

function showResponse(response) {
    addMessage('ponceGPT', response);
    // Save the response to localStorage
    saveMessage('ponceGPT', response);
}

function colorButton() {
    let message = document.getElementById("chatBox");
    let button = document.getElementById("btnAsk");
    if (message.value !== "")
        button.style.backgroundColor = "#198754";
    else
        button.style.backgroundColor = "#00000000";
}

function getResponse(question) {
    fetch('http://localhost:2000/api/questions/answer', {
        // Post method to display on screen
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // Retrieved object
        body: JSON.stringify({ question: question }),
    })
        // Get response in json
        .then(response => response.json())
        // If there is data
        .then(data => {
            showResponse(data.answer);
        })
        // If there is an error
        .catch(error => {
            console.error('Error getting response:', error);
        });
}

function saveMessage(sender, text) {
    // Get existing messages from localStorage
    let savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    // Add the new message
    savedMessages.push({ sender, text });
    // Save the updated messages to localStorage
    localStorage.setItem('messages', JSON.stringify(savedMessages));

    // Hide the image if there are messages
    if (savedMessages.length > 0) {
        image.style.display = 'none';
    }
}

function loadSavedMessages() {
    // Get saved messages from localStorage
    let savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    // If there are saved messages, hide the image
    if (savedMessages.length > 0) {
        image.style.display = 'none';
    } else {
        image.style.display = 'block';
    }
    // Add each message to the message container
    savedMessages.forEach(message => {
        addMessage(message.sender, message.text);
    });
}

function clearMessages() {
    // Clear messages in the container
    messages.innerHTML = '';
    // Clear messages in localStorage
    localStorage.removeItem('messages');
    // Show the logo image again
    image.style.display = 'block';
}
