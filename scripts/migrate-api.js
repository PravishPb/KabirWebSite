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

const stripHtml = (html) => html.replace(/<[^>]+>/g, '').trim();

async function runMigration() {
  console.log('Starting live API migration...');
  let page = 1;
  let hasMore = true;
  let totalBlogs = 0;

  while (hasMore) {
    console.log(`Fetching page ${page}...`);
    try {
      const response = await fetch(`https://kabirassociationoftoronto.org/wp-json/wp/v2/posts?per_page=100&page=${page}`);
      
      if (!response.ok) {
        if (response.status === 400) {
          // Reached end of pages
          hasMore = false;
          break;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const posts = await response.json();
      
      if (posts.length === 0) {
        hasMore = false;
        break;
      }

      console.log(`Downloaded ${posts.length} posts. Formatting for Supabase...`);
      
      const blogsToInsert = posts.map(post => {
        let mappedCat = 'KAOT';
        if (post.categories && post.categories.includes(96)) {
          mappedCat = 'Dr. J Das';
        }

        return {
          title: post.title.rendered ? he.decode(post.title.rendered) : 'Untitled',
          content: post.content.rendered || '',
          excerpt: post.excerpt.rendered ? he.decode(stripHtml(post.excerpt.rendered)) : '',
          image_url: post.jetpack_featured_media_url || 'https://images.unsplash.com/photo-1499209974431-9dddcece7fdd?q=80&w=2070&auto=format&fit=crop',
          slug: post.slug,
          published_at: post.date ? new Date(post.date).toISOString() : null,
          category: mappedCat
        };
      });

      const { data, error } = await supabase.from('blogs').insert(blogsToInsert);
      
      if (error) {
        console.error(`Error inserting page ${page}:`, error.message);
      } else {
        console.log(`Successfully inserted ${blogsToInsert.length} blogs to Supabase!`);
        totalBlogs += blogsToInsert.length;
      }
      
      page++;
    } catch (error) {
      console.error('Migration failed:', error);
      break;
    }
  }

  console.log(`Live API Migration Complete! Total modern blogs migrated: ${totalBlogs}`);
}

runMigration();
