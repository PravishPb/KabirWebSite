import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import he from 'he';

// Bypass SSL/TLS certificate expiration issues for the live site
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function fixEntities() {
  console.log('Fetching all blogs to fix HTML entities...');
  
  // We can just fetch all rows, we know there are 151.
  const { data: blogs, error: fetchError } = await supabase.from('blogs').select('*');
  
  if (fetchError) {
    console.error('Error fetching blogs:', fetchError);
    return;
  }
  
  console.log(`Found ${blogs.length} blogs. Checking for HTML entities...`);
  
  let updatedCount = 0;
  
  for (const blog of blogs) {
    const decodedTitle = he.decode(blog.title || '');
    const decodedExcerpt = he.decode(blog.excerpt || '');
    
    let needsUpdate = false;
    const updates = {};
    
    if (decodedTitle !== blog.title) {
      updates.title = decodedTitle;
      needsUpdate = true;
    }
    
    if (decodedExcerpt !== blog.excerpt) {
      updates.excerpt = decodedExcerpt;
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      const { error: updateError } = await supabase.from('blogs').update(updates).eq('id', blog.id);
      if (updateError) {
        console.error(`Error updating blog ${blog.id}:`, updateError);
      } else {
        updatedCount++;
        console.log(`Updated blog ID ${blog.id} - New Title: "${updates.title || blog.title}"`);
      }
    }
  }
  
  console.log(`Done! Fixed HTML entities in ${updatedCount} blogs.`);
}

fixEntities();
