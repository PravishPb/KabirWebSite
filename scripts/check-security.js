import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function checkSecurity() {
  console.log("Checking RLS Policies...");
  // We can query pg_policies using RPC or direct SQL if we had postgres connection string, but with JS client we can only call RPC.
  // We'll check if anon key can insert or delete.
  
  const anonClient = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    realtime: { transport: WebSocket }
  });

  // Try to insert a dummy blog using Anon key
  console.log("\nTesting Anon Key Database Access...");
  const { error: insertError } = await anonClient.from('blogs').insert([{ title: 'Security Test', excerpt: 'Test', content: '<p>test</p>' }]);
  if (insertError) {
    console.log("✅ Anon Insert BLOCKED: " + insertError.message);
  } else {
    console.log("❌ Anon Insert ALLOWED! (DANGER: Anyone can create blogs)");
    // cleanup
    await supabase.from('blogs').delete().eq('title', 'Security Test');
  }

  // Try to upload to storage using Anon key
  console.log("\nTesting Anon Key Storage Access...");
  const { error: uploadError } = await anonClient.storage.from('blog-images').upload('test.txt', 'test');
  if (uploadError) {
    console.log("✅ Anon Upload BLOCKED: " + uploadError.message);
  } else {
    console.log("❌ Anon Upload ALLOWED! (DANGER: Anyone can upload files)");
    await supabase.storage.from('blog-images').remove(['test.txt']);
  }
}
checkSecurity();
