import React from 'react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui';
import { Button, Eyebrow, Badge, ChevronLink } from '../ui';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import { useBlogs } from '../../hooks/useBlogs';
import { useNavigate } from 'react-router-dom';
import { Icon, PlaceholderImg, AsyncImage } from '../ui';
import './BlogSection.css';

const BLOG_IMAGES = [
  '/writings-teaching.png',
  '/writings-devotion.png',
  '/writings-community.png',
];

export default function BlogSection() {
  const { lang, toast } = useApp();
  const t = useTranslation('BlogSection');
  const { blogs, loading } = useBlogs();
  const navigate = useNavigate();
  
  const displayPosts = blogs.length > 0 ? blogs.slice(0, 3) : (t.posts || []).slice(0, 3);
  
  const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handlePostClick = (id) => {
    if (blogs.length > 0) {
      navigate(`/blog?read=${id}`);
    } else {
      navigate('/blog');
    }
  };
  
  return (
    <section className="scheme-3 blog-section">
      <AnimatedSection>
        <div className="blog-container">
          {/* Header */}
          <div className="blog-header">
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <h2 className="blog-title">
              {t.h2}
            </h2>
          </div>

          {/* Blog Cards */}
          <StaggerContainer>
            <div className="blog-grid">
              {displayPosts.map((post, i) => {
                const cats = Array.isArray(post.categories) && post.categories.length > 0 
                  ? post.categories 
                  : (post.category ? [post.category] : ['KAOT']);
                const title = post.title ? decodeHTML(post.title) : '';
                const excerpt = post.excerpt ? decodeHTML(post.excerpt).replace(/<[^>]+>/g, '') : '';
                const readTime = '5 min read';
                const author = post.author || (lang === 'HI' ? 'एसोसिएशन' : 'Association');
                const commentCount = post.comment_count || 0;
                
                return (
                  <StaggerItem key={post.id || i}>
                    <article className="blog-card" onClick={() => handlePostClick(post.id)}>
                      <div className="blog-card-img-wrapper">
                        {post.image_url ? (
                          <AsyncImage
                            src={post.image_url}
                            alt={title}
                            className="blog-card-img"
                            fallbackGradient="linear-gradient(135deg, #2c5f3a 0%, #112617 100%)"
                          />
                        ) : (
                          <img
                            src={BLOG_IMAGES[i % BLOG_IMAGES.length]}
                            alt={title}
                            loading="lazy"
                            className="blog-card-img"
                          />
                        )}
                      </div>
                      <div className="blog-card-content">
                        <div className="blog-card-meta" style={{ flexWrap: 'wrap', gap: '8px' }}>
                          {cats.slice(0, 2).map((c, idx) => (
                            <Badge key={idx}>{c}</Badge>
                          ))}
                          {cats.length > 2 && <Badge>+{cats.length - 2}</Badge>}
                          <span className="blog-card-readtime">
                            {readTime}
                          </span>
                        </div>
                        <h3 className="blog-card-title">
                          {title}
                        </h3>
                        <p className="blog-card-excerpt">
                          {excerpt}
                        </p>

                        <div className="blog-card-meta-secondary" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem', color: 'var(--fg2)', marginTop: 'auto', marginBottom: '0.5rem' }}>
                          <span className="blog-card-author" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icon name="person" size={14} />
                            <span>{author}</span>
                          </span>
                          {post.published_at && (
                            <span className="blog-card-date" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Icon name="calendar_today" size={14} />
                              <span>
                                {new Date(post.published_at).toLocaleDateString(lang === 'HI' ? 'hi-IN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </span>
                          )}
                          <span className="blog-card-comments" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icon name="chat_bubble_outline" size={14} />
                            <span>{commentCount} {lang === 'HI' ? 'टिप्पणियाँ' : 'Comments'}</span>
                          </span>
                        </div>

                        <ChevronLink 
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePostClick(post.id);
                          }}
                          style={{ marginTop: '1rem' }}
                        >
                          {t.readMore}
                        </ChevronLink>
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>

          {/* Button */}
          <div className="blog-btn-wrapper">
            <Button
              onClick={() => toast && toast(t.allWritings)}
              className="blog-btn"
            >
              {t.allWritings}
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

