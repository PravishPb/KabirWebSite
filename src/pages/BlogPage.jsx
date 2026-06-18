import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Eyebrow, ChevronLink, AsyncImage, PlaceholderImg } from '../components/ui';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../locales/useTranslation';
import { useBlogs } from '../hooks/useBlogs';
import './BlogPage.css';

const gradients = [
  'linear-gradient(135deg, #2c5f3a 0%, #112617 100%)',
  'linear-gradient(135deg, #563401 0%, #d98204 100%)',
  'linear-gradient(135deg, #1b1e1c 0%, #4d504e 100%)',
  'linear-gradient(135deg, #412701 0%, #ad6803 100%)',
  'linear-gradient(135deg, #234c2e 0%, #6b8f75 100%)',
  'linear-gradient(135deg, #2a3138 0%, #6a7b8c 100%)',
];

export default function BlogPage() {
  const { toast } = useApp();
  const t = useTranslation('BlogPage');
  
  const { blogs: livePosts, loading } = useBlogs();
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const filter = searchParams.get('filter') || 'All';

  const setFilter = (f) => {
    navigate(`/blog${f === 'All' ? '' : `?filter=${encodeURIComponent(f)}`}`);
  };

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const currentPosts = livePosts.map(p => ({
    id: p.id,
    cat: p.category || 'KAOT',
    read: '5 min read',
    title: p.title ? decodeHTML(p.title) : '',
    excerpt: p.excerpt ? decodeHTML(p.excerpt) : 'Read more...',
    image_url: p.image_url
  }));

  const filteredPosts = filter === 'All' ? currentPosts : currentPosts.filter(p => p.cat === filter);

  return (
    <div className="page-content" style={{ position: 'relative' }}>
      <section className="section scheme-2">
        <div className="container">
          <AnimatedSection>
            <div className="prose center" style={{ marginInline: 'auto' }}>
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h1 className="h1">{t.h1}</h1>
              <p className="lead" style={{ marginTop: '20px' }}>
                {t.lead}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section scheme-3">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--fg2)' }}>Loading blogs...</div>
          ) : (
            <motion.div className="blog-grid" layout>
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, i) => (
                  <motion.div 
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <article 
                      className="blog-card" 
                      onClick={() => toast && toast(post.title)}
                      style={{ position: 'relative', height: '100%' }}
                    >
                      {post.image_url ? (
                        <AsyncImage
                          src={post.image_url}
                          alt={post.title}
                          className="rounded-img blog-img"
                          style={{ height: '200px', width: '100%' }}
                          fallbackGradient={gradients[i % gradients.length]}
                        />
                      ) : (
                        <PlaceholderImg
                          className="rounded-img blog-img"
                          gradient={gradients[i % gradients.length]}
                          alt={post.title}
                          style={{ height: '200px' }}
                        />
                      )}
                      <div className="blog-meta">
                        <Badge>{post.cat}</Badge>
                        <span className="blog-read">{post.read}</span>
                      </div>
                      <h3 className="h5">{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <ChevronLink>{t.readMore}</ChevronLink>
                    </article>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
