import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import WebSocket from 'ws';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  realtime: {
    transport: WebSocket
  }
});

const CSV_FILE = path.resolve(__dirname, '../wp_posts (1).csv');

// Helper to generate a slug from title if missing
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const extractFirstImage = (html) => {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
};

async function runMigration() {
  console.log('Starting migration...');
  const blogs = [];

  fs.createReadStream(CSV_FILE)
    .pipe(csv())
    .on('data', (row) => {
      // Filter for published posts
      if (row.post_type === 'post' && row.post_status === 'publish') {
        const title = row.post_title || 'Untitled';
        const slug = row.post_name || generateSlug(title);
        
        // Exclude empty content posts if necessary, but keep for now
        if (row.post_content && row.post_content.trim() !== '') {
          blogs.push({
            title: title,
            content: row.post_content,
            excerpt: row.post_excerpt || '',
            image_url: extractFirstImage(row.post_content) || 'https://images.unsplash.com/photo-1499209974431-9dddcece7fdd?q=80&w=2070&auto=format&fit=crop',
            slug: slug,
            published_at: row.post_date ? new Date(row.post_date).toISOString() : null,
          });
        }
      }
    })
    .on('end', async () => {
      console.log(`Parsed ${blogs.length} published blogs. Inserting to Supabase...`);
      
      if (blogs.length === 0) {
        console.log('No blogs found to migrate.');
        return;
      }

      // Supabase has limits on batch inserts, doing it in chunks or all at once if small
      const chunkSize = 50;
      let successCount = 0;

      for (let i = 0; i < blogs.length; i += chunkSize) {
        const chunk = blogs.slice(i, i + chunkSize);
        const { data, error } = await supabase.from('blogs').insert(chunk);
        
        if (error) {
          console.error(`Error inserting chunk ${i / chunkSize + 1}:`, error.message);
        } else {
          successCount += chunk.length;
          console.log(`Inserted chunk ${i / chunkSize + 1} (${chunk.length} items)`);
        }
      }

      console.log(`Migration complete! Successfully migrated ${successCount} blogs.`);
    });
}

runMigration();
