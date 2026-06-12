import React from 'react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui';
import { Button, Eyebrow, Badge, ChevronLink } from '../ui';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import './BlogSection.css';

const BLOG_IMAGES = [
  '/writings-teaching.png',
  '/writings-devotion.png',
  '/writings-community.png',
];

export default function BlogSection() {
  const { lang, toast } = useApp();
  const t = useTranslation('BlogSection');
  
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
              {t.posts && t.posts.map((post, i) => (
                <StaggerItem key={i}>
                  <article className="blog-card">
                    <div className="blog-card-img-wrapper">
                      <img
                        src={BLOG_IMAGES[i]}
                        alt={post.title}
                        loading="lazy"
                        className="blog-card-img"
                      />
                    </div>
                    <div className="blog-card-content">
                      <div className="blog-card-meta">
                        <Badge>{post.category}</Badge>
                        <span className="blog-card-readtime">
                          {post.readTime} {t.readSuffix}
                        </span>
                      </div>
                      <h3 className="blog-card-title">
                        {post.title}
                      </h3>
                      <p className="blog-card-excerpt">
                        {post.excerpt}
                      </p>
                      <ChevronLink to="/blog" style={{ marginTop: 'auto' }}>
                        {t.readMore}
                      </ChevronLink>
                    </div>
                  </article>
                </StaggerItem>
              ))}
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

