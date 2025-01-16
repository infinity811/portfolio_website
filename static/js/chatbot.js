// Select DOM elements
const chatInput = document.getElementById('chat-input');
const chatBox = document.getElementById('chat-box');
const sendButton = document.getElementById('send-button');

// Function to append messages to the chat box
function appendMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageDiv.textContent = `${sender === 'user' ? 'You' : 'Bot'}: ${message}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
}

// Event listener for the send button
sendButton.addEventListener('click', () => {
    const query = chatInput.value.trim();
    if (!query) {
        alert('Please enter a question!');
        return;
    }

    // Append the user's message to the chat box
    appendMessage(query, 'user');

    // Send the query to the backend
    fetch('/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    })
        .then(response => response.json())
        .then(data => {
            // Append the bot's response to the chat box
            appendMessage(data.response, 'bot');
        })
        .catch(error => {
            console.error('Error:', error);
            appendMessage('Sorry, something went wrong. Please try again.', 'bot');
        });

    // Clear the input field
    chatInput.value = '';
});