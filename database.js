// database.js - SQLite Database Initialization
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 1. Path to the database file on your hard drive
const dbPath = path.resolve(__dirname, 'messages.db');

// 2. Open (or automatically create) the SQLite database file
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Could not connect to SQLite database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database: messages.db');
  }
});

// 3. Initialize the "messages" table if it doesn't already exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating messages table:', err.message);
    } else {
      console.log('✅ Messages table is ready.');
    }
  });
});

// 4. Export the database connection so server.js can use it
module.exports = db;
