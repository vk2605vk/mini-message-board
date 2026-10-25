// 1. Import Express
const express = require('express');

// 2. Initialize the Express app
const app = express();
const PORT = 3000;

// 3. Middleware: Enables Express to understand incoming JSON in request bodies
app.use(express.json());

// 4. In-memory storage: a simple JavaScript array to hold messages
const messages = [
  { id: 1, text: 'Welcome to the Mini Message Board!' }
];

// 5. Serve static frontend files from the "public" directory
app.use(express.static('public'));

// 6. GET endpoint: returns all stored messages as JSON
app.get('/api/messages', (req, res) => {
  console.log(`[GET /api/messages] Sending ${messages.length} messages to client`);
  res.json(messages);
});

// 7. POST endpoint: receives, validates, and stores a new message
app.post('/api/messages', (req, res) => {
  console.log('[POST /api/messages] Incoming body:', req.body);
  const { text } = req.body;

  // Validation: Ensure text is provided and not just empty spaces
  if (!text || text.trim() === '') {
    console.log('[POST /api/messages] Rejected: Message was empty');
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  // Create a new message object with a unique ID (timestamp)
  const newMessage = {
    id: Date.now(),
    text: text.trim()
  };

  // Add the message to our in-memory array
  messages.push(newMessage);
  console.log('[POST /api/messages] Success: Stored message with ID:', newMessage.id);

  // Send back 201 Created with the saved message
  res.status(201).json(newMessage);
});

// 8. Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
