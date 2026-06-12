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

async function clear() {
  const { data } = await supabase.from('blogs').select('id, image_url');
  const unsplashBlogs = data.filter(b => b.image_url && b.image_url.includes('unsplash.com'));
  
  console.log(`Clearing ${unsplashBlogs.length} blogs...`);
  
  for (const blog of unsplashBlogs) {
    await supabase.from('blogs').update({ image_url: null }).eq('id', blog.id);
  }
  
  console.log('Done clearing unsplash placeholders!');
}
clear();
