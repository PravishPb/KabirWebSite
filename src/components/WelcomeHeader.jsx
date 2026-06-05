import React from 'react';
import { AnimatedSection, StaggerContainer, StaggerItem } from './ui';
import { Button, Eyebrow } from './ui';

const TEXT = {
  EN: {
    eyebrow: 'Welcome',
    h1: 'A spiritual home, founded in devotion',
    body: 'Established in 2011 as a registered charitable non-profit in Ontario, the Kabir Association of Toronto carries the teachings of the 15th-century mystic saint-poet Kabir to a community drawn from across the world. We gather each week for satsang, devotional song, and the quiet practice of turning inward — open and welcoming to all.',
    learn: 'Learn more',
    explore: 'Explore',
  },
  HI: {
    eyebrow: 'स्वागत',
    h1: 'भक्ति में स्थापित, एक आध्यात्मिक घर',
    body: '2011 में ओंटारियो में एक पंजीकृत धर्मार्थ गैर-लाभकारी संस्था के रूप में स्थापित, कबीर एसोसिएशन ऑफ़ टोरंटो 15वीं सदी के रहस्यवादी संत-कवि कबीर की शिक्षाओं को दुनिया भर से आए समुदाय तक पहुंचाता है। हम हर सप्ताह सत्संग, भक्ति गीत और अंतर्मुखी होने के शांत अभ्यास के लिए एकत्र होते हैं — सभी का स्वागत है।',
    learn: 'और जानें',
    explore: 'अन्वेषण करें',
  },
};

export default function WelcomeHeader({ lang = 'EN', toast }) {
  const t = TEXT[lang] || TEXT.EN;

  return (
    <section
      className="scheme-1"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #0d0f0e 0%, #1b1e1c 40%, #2a1a08 80%, #3d2508 100%)',
      }}
    >
      <AnimatedSection style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <StaggerContainer>
          <div
            style={{
              maxWidth: 1280,
              margin: '0 auto',
              padding: 'clamp(3rem, 8vw, 6rem) 1.5rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(2rem, 4vw, 4rem)',
              alignItems: 'center',
            }}
            className="welcome-grid"
          >
            {/* Left Column — Image */}
            <StaggerItem>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-image, 1rem)',
                  overflow: 'hidden',
                  aspectRatio: '4 / 5',
                  boxShadow: '0 20px 60px -15px rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src="/spiritual-home.png"
                  alt="A spiritual home, founded in devotion"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {/* Subtle gradient vignette on the image edges */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(13,15,14,0.3) 0%, transparent 40%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </StaggerItem>

            {/* Right Column — Text */}
            <StaggerItem>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Eyebrow style={{ color: 'var(--tahiti-gold, #d98204)', marginBottom: 0 }}>{t.eyebrow}</Eyebrow>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading, "Cormorant Unicase", serif)',
                    fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                    fontWeight: 300,
                    lineHeight: 1.15,
                    color: '#f5f0e8',
                    margin: 0,
                  }}
                >
                  {t.h1}
                </h1>
                <p
                  style={{
                    fontFamily: 'var(--font-body, sans-serif)',
                    fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
                    lineHeight: 1.8,
                    color: 'rgba(245,240,232,0.75)',
                    margin: 0,
                  }}
                >
                  {t.body}
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  <Button
                    onClick={() => toast && toast(t.learn)}
                    style={{
                      padding: '0.8rem 1.8rem',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      background: 'var(--tahiti-gold, #d98204)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      boxShadow: '0 4px 20px rgba(217,130,4,0.25)',
                    }}
                  >
                    {t.learn}
                  </Button>
                  <Button
                    onClick={() => toast && toast(t.explore)}
                    style={{
                      padding: '0.8rem 1.8rem',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      background: 'transparent',
                      color: '#f5f0e8',
                      border: '1px solid rgba(245,240,232,0.2)',
                      borderRadius: 8,
                      cursor: 'pointer',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    {t.explore}
                  </Button>
                </div>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </AnimatedSection>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .welcome-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}

