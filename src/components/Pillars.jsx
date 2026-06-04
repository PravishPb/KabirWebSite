import React from 'react';
import { AnimatedSection, StaggerContainer, StaggerItem } from './ui';
import { Button, Eyebrow } from './ui';

function PlaceholderImg({ className = '', style = {}, alt = '', gradient = 'linear-gradient(135deg, #1b1e1c 0%, #563401 50%, #d98204 100%)' }) {
  return <div className={className} style={{ ...style, background: gradient, width: '100%' }} role="img" aria-label={alt} />;
}

const TEXT = {
  EN: {
    eyebrow: 'Foundation',
    title: 'Three pillars of our practice',
    body: 'Our spiritual life is built on three inseparable disciplines — each one a doorway into deeper awareness and selfless love.',
    button: 'Discover',
    pillars: [
      {
        title: 'Satsang',
        description:
          'To keep the company of the truthful. In the gathering of sincere seekers, the teachings come alive and the heart is drawn toward what is real.',
      },
      {
        title: 'Sumiran',
        description:
          'The inner remembrance of the divine. Through quiet devotion we loosen our grip on the outer world and turn, with love, toward the Higher Self.',
      },
      {
        title: 'Sewa',
        description:
          'Selfless service to all beings. Seeing the divine in everyone, we care for one another and offer ourselves in love, asking nothing in return.',
      },
    ],
  },
  HI: {
    eyebrow: 'आधार',
    title: 'हमारे अभ्यास के तीन स्तंभ',
    body: 'हमारा आध्यात्मिक जीवन तीन अविभाज्य अनुशासनों पर बना है — प्रत्येक गहन जागरूकता और निःस्वार्थ प्रेम का द्वार है।',
    button: 'खोजें',
    pillars: [
      {
        title: 'सत्संग',
        description:
          'सत्य के साथियों का साथ रखना। सच्चे साधकों की सभा में शिक्षाएँ जीवंत हो उठती हैं और हृदय सत्य की ओर खिंचा चला जाता है।',
      },
      {
        title: 'सुमिरन',
        description:
          'परमात्मा का आंतरिक स्मरण। शांत भक्ति के माध्यम से हम बाहरी संसार से अपनी पकड़ ढीली करते हैं और प्रेम से उच्च आत्मा की ओर मुड़ते हैं।',
      },
      {
        title: 'सेवा',
        description:
          'सभी प्राणियों की निःस्वार्थ सेवा। हर किसी में परमात्मा को देखते हुए, हम एक-दूसरे की देखभाल करते हैं और बदले में कुछ भी न मांगते हुए प्रेम में स्वयं को अर्पित करते हैं।',
      },
    ],
  },
};

const pillarGradients = [
  'linear-gradient(135deg, #2a1a08 0%, #563401 50%, #d98204 100%)',
  'linear-gradient(135deg, #1b1e1c 0%, #3d2508 50%, #b87203 100%)',
  'linear-gradient(135deg, #0d0f0e 0%, #2a1a08 50%, #c48a1a 100%)',
];

export default function Pillars({ lang = 'EN' }) {
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
                marginBottom: '1rem',
              }}
            >
              {t.title}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body, sans-serif)',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'var(--color-text-muted, rgba(27,30,28,0.65))',
              }}
            >
              {t.body}
            </p>
          </div>

          {/* Pillar Cards */}
          <StaggerContainer>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                marginBottom: '2.5rem',
              }}
              className="pillars-grid"
            >
              {t.pillars.map((pillar, i) => (
                <StaggerItem key={i}>
                  <div
                    style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: 'var(--color-surface, #fff)',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                    }}
                  >
                    <PlaceholderImg
                      alt={pillar.title}
                      gradient={pillarGradients[i]}
                      style={{ height: 220, borderRadius: '12px 12px 0 0' }}
                    />
                    <div style={{ padding: '1.5rem' }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading, "Cormorant Unicase", serif)',
                          fontSize: '1.35rem',
                          fontWeight: 600,
                          color: 'var(--color-text, #1b1e1c)',
                          marginBottom: '0.75rem',
                        }}
                      >
                        {pillar.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: 'var(--font-body, sans-serif)',
                          fontSize: '0.9rem',
                          lineHeight: 1.7,
                          color: 'var(--color-text-muted, rgba(27,30,28,0.65))',
                        }}
                      >
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          {/* Button */}
          <div style={{ textAlign: 'center' }}>
            <Button
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
              {t.button}
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <style>{`
        @media (max-width: 768px) {
          .pillars-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
