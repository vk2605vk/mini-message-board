// test-supabase.js - Quick Connection Verification
const supabase = require('./supabase');

async function testConnection() {
  console.log('🔍 Testing connection to Supabase cloud...');

  try {
    // Attempt to query the messages table in Supabase
    const { data, error } = await supabase.from('messages').select('*');

    if (error) {
      console.error('❌ Connection failed:');
      console.error(error.message);
      console.log('\n💡 Tip: Check if the table name is exactly "messages" and if Row Level Security (RLS) is disabled.');
      return;
    }

    console.log('✅ SUCCESS! Successfully connected to Supabase PostgreSQL!');
    console.log(`📊 Found ${data.length} messages in your cloud database:`, data);
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testConnection();
