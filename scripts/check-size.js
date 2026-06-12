import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function checkSize() {
  const { data, error } = await supabase.storage.from('blog-images').list(undefined, {
    limit: 1000,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error) {
    console.error(error);
    return;
  }
  
  let totalBytes = 0;
  for (const file of data) {
    if (file.metadata && file.metadata.size) {
      totalBytes += file.metadata.size;
    }
  }
  
  const mb = totalBytes / (1024 * 1024);
  console.log(`Total Files: ${data.length}`);
  console.log(`Total Size: ${mb.toFixed(2)} MB`);
}

checkSize();
