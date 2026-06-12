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

const IMAGES = [
  "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1455218873509-8097305ee378?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=1200&auto=format&fit=crop"
];

async function fix() {
  const { data, error } = await supabase.from('blogs').select('id, image_url, title');
  const defaults = data.filter(b => b.image_url && b.image_url.includes('unsplash.com'));
  
  console.log(`Fixing ${defaults.length} blogs...`);
  
  for (let i = 0; i < defaults.length; i++) {
    const blog = defaults[i];
    // Assign a deterministic but varied image based on index
    const randomImage = IMAGES[i % IMAGES.length];
    
    await supabase.from('blogs').update({ image_url: randomImage }).eq('id', blog.id);
    console.log(`Updated: ${blog.title}`);
  }
  
  console.log('Done!');
}
fix();
