// ==========================================================================
// Mini Message Board - Client-Side JavaScript (app.js)
// ==========================================================================

// 1. Grab HTML elements from the DOM using their unique IDs
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const postButton = document.getElementById('post-button');
const errorBanner = document.getElementById('error-banner');
const messagesContainer = document.getElementById('messages-container');
const messageCount = document.getElementById('message-count');

// ==========================================================================
// Helper Functions: Error Display
// ==========================================================================

// Display a helpful error message to the user
function showError(msg) {
  errorBanner.textContent = msg;
  errorBanner.classList.remove('hidden');
}

// Hide the error banner when things are good
function clearError() {
  errorBanner.textContent = '';
  errorBanner.classList.add('hidden');
}

// Format timestamp into human-readable time (e.g. "3:45 PM")
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ==========================================================================
// Feature 1: Load and Display Messages (GET /api/messages)
// ==========================================================================
async function loadMessages() {
  try {
    // Send a GET request to our Express backend
    const response = await fetch('/api/messages');

    if (!response.ok) {
      throw new Error(`Failed to load messages (Status: ${response.status})`);
    }

    // Parse the JSON array received from the server
    const messages = await response.json();

    // Update message counter badge
    messageCount.textContent = `${messages.length} ${messages.length === 1 ? 'message' : 'messages'}`;

    // If no messages exist, display an empty state
    if (messages.length === 0) {
      messagesContainer.innerHTML = '<div class="empty-state">No messages yet. Be the first to post!</div>';
      return;
    }

    // Render messages: newest at the top
    messagesContainer.innerHTML = '';
    const reversedMessages = [...messages].reverse();

    reversedMessages.forEach((msg) => {
      const messageCard = document.createElement('div');
      messageCard.className = 'message-item';
      
      const timeString = msg.id && typeof msg.id === 'number' 
        ? formatTime(msg.id) 
        : 'Just now';

      messageCard.innerHTML = `
        <p>${escapeHTML(msg.text)}</p>
        <span class="message-time">${timeString}</span>
      `;
      messagesContainer.appendChild(messageCard);
    });

  } catch (err) {
    console.error('Error fetching messages:', err);
    showError('Could not connect to the server to load messages. Is the server running?');
    messagesContainer.innerHTML = '<div class="empty-state">Failed to load messages.</div>';
  }
}

// Security helper: prevent XSS by escaping HTML special characters in user input
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ==========================================================================
// Feature 2: Post a New Message (POST /api/messages)
// ==========================================================================
messageForm.addEventListener('submit', async (event) => {
  // Prevent browser from reloading the entire page
  event.preventDefault();
  clearError();

  const text = messageInput.value.trim();

  // Frontend quick-validation: check before bothering the server
  if (!text) {
    showError('Please type a message before posting!');
    messageInput.focus();
    return;
  }

  // Provide visual feedback: disable button while waiting for server response
  postButton.disabled = true;
  postButton.textContent = 'Posting...';

  try {
    // Send POST request with JSON body to Express backend
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    });

    const data = await response.json();

    // Check if the backend rejected our request (e.g. Status 400)
    if (!response.ok) {
      // Show the exact error message sent by the server!
      showError(data.error || 'Something went wrong on the server.');
      return;
    }

    // SUCCESS! Clear the input field
    messageInput.value = '';

    // Refresh the messages feed to show the newly added post
    await loadMessages();

  } catch (err) {
    console.error('Network error during post:', err);
    showError('Could not reach the server. Please check your connection.');
  } finally {
    // Always re-enable the button when done
    postButton.disabled = false;
    postButton.textContent = 'Post Message';
  }
});

// ==========================================================================
// Initial Load: Fetch messages when the page first opens
// ==========================================================================
loadMessages();
