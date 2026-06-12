import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import he from 'he';
import fs from 'fs';

// Bypass SSL/TLS certificate expiration issues for the live site
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function migrateImages() {
  console.log("Starting Image Migration...");
  
  // 1. Fetch all blogs that have WordPress image URLs
  const { data: blogs, error: fetchError } = await supabase
    .from('blogs')
    .select('id, image_url, title')
    .like('image_url', '%kabirassociationoftoronto.org%');

  if (fetchError) {
    console.error("Error fetching blogs:", fetchError);
    return;
  }

  console.log(`Found ${blogs.length} blogs with WordPress images.`);

  let successCount = 0;
  let failCount = 0;

  for (const blog of blogs) {
    try {
      console.log(`Processing: ${blog.title}`);
      
      // 2. Download the image
      const response = await fetch(blog.image_url);
      if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Extract original filename, clean it up
      const urlObj = new URL(blog.image_url);
      let filename = path.basename(urlObj.pathname);
      // Ensure unique filenames to avoid overwrites
      filename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // 3. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('blog-images')
        .upload(filename, buffer, {
          contentType: response.headers.get('content-type') || 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`);
      }

      // 4. Get the new public URL
      const { data: publicUrlData } = supabase
        .storage
        .from('blog-images')
        .getPublicUrl(filename);
        
      const newUrl = publicUrlData.publicUrl;

      // 5. Update the database record
      const { error: updateError } = await supabase
        .from('blogs')
        .update({ image_url: newUrl })
        .eq('id', blog.id);

      if (updateError) {
        throw new Error(`DB Update error: ${updateError.message}`);
      }

      console.log(`✅ Success: Migrated image for ${blog.title}`);
      successCount++;
    } catch (err) {
      console.error(`❌ Failed: ${blog.title}`, err.message);
      failCount++;
    }
    
    // Add a small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\nMigration Complete!`);
  console.log(`Successfully migrated: ${successCount}`);
  console.log(`Failed to migrate: ${failCount}`);
}

migrateImages();
