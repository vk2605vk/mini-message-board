// 1. Import Express and our Database connection
const express = require('express');
const db = require('./database');

// 2. Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Middleware: Enables Express to understand incoming JSON in request bodies
app.use(express.json());

// 4. Serve static frontend files from the "public" directory
app.use(express.static('public'));

// ==========================================================================
// 5. GET endpoint: retrieves all messages from SQLite database
// ==========================================================================
app.get('/api/messages', (req, res) => {
  const sql = 'SELECT * FROM messages ORDER BY id ASC';

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Database query error:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve messages from database.' });
    }

    console.log(`[GET /api/messages] Retrieved ${rows.length} messages from database`);
    res.json(rows);
  });
});

// ==========================================================================
// 6. POST endpoint: validates and inserts a new message into SQLite database
// ==========================================================================
app.post('/api/messages', (req, res) => {
  const { text } = req.body;

  // Validation: Check that text is not empty or just spaces
  if (!text || text.trim() === '') {
    console.log('[POST /api/messages] Rejected: Message was empty');
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  // Parameterized SQL query (using ? prevents SQL Injection attacks)
  const sql = 'INSERT INTO messages (text) VALUES (?)';

  db.run(sql, [text.trim()], function (err) {
    if (err) {
      console.error('❌ Database insert error:', err.message);
      return res.status(500).json({ error: 'Failed to save message to database.' });
    }

    // this.lastID contains the auto-incremented ID assigned by SQLite
    const newMessage = {
      id: this.lastID,
      text: text.trim()
    };

    console.log('[POST /api/messages] Successfully saved to database with ID:', newMessage.id);
    res.status(201).json(newMessage);
  });
});

// ==========================================================================
// 7. Start the server
// ==========================================================================
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
