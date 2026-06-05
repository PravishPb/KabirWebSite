import React from 'react';
import { AnimatedSection, StaggerContainer, StaggerItem } from './ui';
import { Button, Eyebrow, Badge, ChevronLink } from './ui';

const BLOG_IMAGES = [
  '/writings-teaching.png',
  '/writings-devotion.png',
  '/writings-community.png',
];

const TEXT = {
  EN: {
    eyebrow: 'Writings',
    h2: 'Sermons and reflections',
    allWritings: 'All writings',
    readSuffix: 'min read',
    posts: [
      {
        category: 'Teaching',
        readTime: 3,
        title: 'The practice of turning inward',
        excerpt: 'How silence becomes the truest teacher in our daily lives.',
      },
      {
        category: 'Devotion',
        readTime: 4,
        title: "Kabir's voice across the centuries",
        excerpt: "Understanding the saint-poet's message for modern seekers.",
      },
      {
        category: 'Community',
        readTime: 5,
        title: 'What satsang truly means',
        excerpt: 'The alchemy of gathering with those who seek truth.',
      },
    ],
  },
  HI: {
    eyebrow: 'लेख',
    h2: 'उपदेश और चिंतन',
    allWritings: 'सभी लेख',
    readSuffix: 'मिनट पढ़ें',
    posts: [
      {
        category: 'शिक्षा',
        readTime: 3,
        title: 'अंतर्मुखी होने का अभ्यास',
        excerpt: 'कैसे मौन हमारे दैनिक जीवन में सबसे सच्चा गुरु बन जाता है।',
      },
      {
        category: 'भक्ति',
        readTime: 4,
        title: 'सदियों में कबीर की वाणी',
        excerpt: 'आधुनिक साधकों के लिए संत-कवि के संदेश को समझना।',
      },
      {
        category: 'समुदाय',
        readTime: 5,
        title: 'सत्संग का सही अर्थ',
        excerpt: 'सत्य के साधकों के साथ एकत्र होने की कीमिया।',
      },
    ],
  },
};

export default function BlogSection({ lang = 'EN', toast }) {
  const t = TEXT[lang] || TEXT.EN;

  return (
    <section
      className="scheme-3"
      style={{
        padding: 'clamp(4rem, 10vw, 8rem) 1.5rem',
        background: 'var(--color-bg, #eae3d5)',
      }}
    >
      <AnimatedSection>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ maxWidth: 640, marginBottom: '3rem' }}>
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <h2
              style={{
                fontFamily: 'var(--font-heading, "Cormorant Unicase", serif)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.2,
                color: 'var(--color-text, #1b1e1c)',
              }}
            >
              {t.h2}
            </h2>
          </div>

          {/* Blog Cards */}
          <StaggerContainer>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                marginBottom: '2.5rem',
              }}
              className="blog-grid"
            >
              {t.posts.map((post, i) => (
                <StaggerItem key={i}>
                  <article
                    className="blog-card"
                    style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: 'var(--color-surface, #fff)',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        overflow: 'hidden',
                        height: 200,
                      }}
                    >
                      <img
                        src={BLOG_IMAGES[i]}
                        alt={post.title}
                        loading="lazy"
                        className="blog-card-img"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.5s ease',
                        }}
                      />
                    </div>
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <Badge>{post.category}</Badge>
                        <span
                          style={{
                            fontFamily: 'var(--font-body, sans-serif)',
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted, rgba(27,30,28,0.5))',
                          }}
                        >
                          {post.readTime} {t.readSuffix}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading, "Cormorant Unicase", serif)',
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          color: 'var(--color-text, #1b1e1c)',
                          marginBottom: '0.5rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {post.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: 'var(--font-body, sans-serif)',
                          fontSize: '0.88rem',
                          lineHeight: 1.6,
                          color: 'var(--color-text-muted, rgba(27,30,28,0.6))',
                          flex: 1,
                          marginBottom: '1rem',
                        }}
                      >
                        {post.excerpt}
                      </p>
                      <ChevronLink to="/blog" style={{ marginTop: 'auto' }}>
                        {lang === 'HI' ? 'पढ़ें' : 'Read'}
                      </ChevronLink>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          {/* Button */}
          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={() => toast && toast(t.allWritings)}
              style={{
                padding: '0.85rem 2rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                background: 'var(--color-accent, #d98204)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              {t.allWritings}
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <style>{`
        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
        }
        .blog-card:hover .blog-card-img {
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
