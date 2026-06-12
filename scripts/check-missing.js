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

async function check() {
  const { data, error } = await supabase.from('blogs').select('id, image_url, title');
  const defaults = data.filter(b => b.image_url && b.image_url.includes('unsplash.com'));
  const noImage = data.filter(b => !b.image_url);
  console.log('Total blogs:', data.length);
  console.log('Using default unsplash:', defaults.length);
  console.log('No image at all:', noImage.length);
}
check();
