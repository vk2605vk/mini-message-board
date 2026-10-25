// 1. Load environment variables from .env
require('dotenv').config();

// 2. Import Express and Supabase client
const express = require('express');
const supabase = require('./supabase');

// 3. Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// 4. Middleware: Parse incoming JSON bodies
app.use(express.json());

// 5. Serve static frontend files from the "public" directory
app.use(express.static('public'));

// ==========================================================================
// 6. GET endpoint: retrieves all messages from Supabase PostgreSQL
// ==========================================================================
app.get('/api/messages', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ Supabase fetch error:', error.message);
      return res.status(500).json({ error: 'Failed to retrieve messages from cloud database.' });
    }

    console.log(`[GET /api/messages] Retrieved ${data.length} messages from Supabase`);
    res.json(data);
  } catch (err) {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ error: 'Server error retrieving messages.' });
  }
});

// ==========================================================================
// 7. POST endpoint: validates and saves a new message to Supabase
// ==========================================================================
app.post('/api/messages', async (req, res) => {
  const { text } = req.body;

  // Validation: Check that text is not empty or just spaces
  if (!text || text.trim() === '') {
    console.log('[POST /api/messages] Rejected: Message was empty');
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  try {
    // Insert new message into Supabase
    const { data, error } = await supabase
      .from('messages')
      .insert([{ text: text.trim() }])
      .select(); // .select() returns the newly created row!

    if (error) {
      console.error('❌ Supabase insert error:', error.message);
      return res.status(500).json({ error: 'Failed to save message to cloud database.' });
    }

    const newMessage = data[0];
    console.log('[POST /api/messages] Successfully saved to Supabase with ID:', newMessage.id);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ error: 'Server error saving message.' });
  }
});

// ==========================================================================
// 8. Start the server
// ==========================================================================
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
