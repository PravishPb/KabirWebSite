import React from 'react';
import { AnimatedSection, StaggerContainer, StaggerItem } from './ui';
import { Button, Eyebrow } from './ui';

function PlaceholderImg({ className = '', style = {}, alt = '', gradient = 'linear-gradient(135deg, #1b1e1c 0%, #563401 50%, #d98204 100%)' }) {
  return <div className={className} style={{ ...style, background: gradient, width: '100%' }} role="img" aria-label={alt} />;
}

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
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <PlaceholderImg
        alt="Welcome background"
        gradient="linear-gradient(145deg, #1b1e1c 0%, #2a1a08 40%, #3d2508 70%, #563401 100%)"
        style={{
          position: 'absolute',
          inset: 0,
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <AnimatedSection style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <StaggerContainer>
          <div
            style={{
              maxWidth: 1280,
              margin: '0 auto',
              padding: 'clamp(4rem, 10vw, 8rem) 1.5rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4rem',
              alignItems: 'center',
            }}
            className="welcome-grid"
          >
            {/* Left Column */}
            <StaggerItem>
              <div>
                <Eyebrow style={{ color: 'var(--color-accent, #d98204)' }}>{t.eyebrow}</Eyebrow>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading, "Cormorant Unicase", serif)',
                    fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                    fontWeight: 300,
                    lineHeight: 1.15,
                    color: 'var(--color-text, #f5f0e8)',
                  }}
                >
                  {t.h1}
                </h1>
              </div>
            </StaggerItem>

            {/* Right Column */}
            <StaggerItem>
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-body, sans-serif)',
                    fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
                    lineHeight: 1.8,
                    color: 'rgba(245,240,232,0.75)',
                    marginBottom: '2rem',
                  }}
                >
                  {t.body}
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Button
                    onClick={() => toast && toast(t.learn)}
                    style={{
                      padding: '0.8rem 1.8rem',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      background: 'var(--color-accent, #d98204)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
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
                      color: 'var(--color-text, #f5f0e8)',
                      border: '1px solid rgba(245,240,232,0.2)',
                      borderRadius: 8,
                      cursor: 'pointer',
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
          .welcome-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  );
}
