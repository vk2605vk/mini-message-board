// supabase.js - Supabase Client Initialization
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL or SUPABASE_KEY is missing from your .env file!');
}

// Initialize Supabase Client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
