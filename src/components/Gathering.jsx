import React from 'react';
import { AnimatedSection, StaggerContainer, StaggerItem } from './ui';
import { Button, Eyebrow } from './ui';

const GATHERING_IMAGES = [
  '/gathering-satsang.png',
  '/gathering-bhajan.png',
  '/gathering-yoga.png',
];

const TEXT = {
  EN: {
    eyebrow: 'Gathering',
    title: 'How we come together',
    body: 'Each gathering is an invitation to pause, listen, and reconnect with something deeper than the surface of daily life.',
    button: 'Explore',
    items: [
      {
        title: 'Satsang',
        description:
          'A weekly gathering centred on the teachings of Kabir. Through readings, reflection, and shared silence, we explore the path of truth together.',
      },
      {
        title: 'Bhajan performances',
        description:
          'Devotional singing that opens the heart. In the tradition of the nirgun saints, these songs carry the listener beyond words into direct experience.',
      },
      {
        title: 'Yoga',
        description:
          'Gentle practice rooted in classical tradition. We move, breathe, and still the body — preparing ourselves for the inner journey of meditation.',
      },
    ],
  },
  HI: {
    eyebrow: 'एकत्रित',
    title: 'हम कैसे एक साथ आते हैं',
    body: 'प्रत्येक सभा दैनिक जीवन की सतह से परे किसी गहरे से पुनः जुड़ने का निमंत्रण है।',
    button: 'अन्वेषण',
    items: [
      {
        title: 'सत्संग',
        description:
          'कबीर की शिक्षाओं पर केंद्रित एक साप्ताहिक सभा। पठन, चिंतन और साझा मौन के माध्यम से, हम एक साथ सत्य के मार्ग का अन्वेषण करते हैं।',
      },
      {
        title: 'भजन प्रस्तुतियाँ',
        description:
          'भक्ति गायन जो हृदय को खोलता है। निर्गुण संतों की परंपरा में, ये गीत श्रोता को शब्दों से परे प्रत्यक्ष अनुभव में ले जाते हैं।',
      },
      {
        title: 'योग',
        description:
          'शास्त्रीय परंपरा में निहित सौम्य अभ्यास। हम चलते हैं, श्वास लेते हैं, और शरीर को स्थिर करते हैं — ध्यान की आंतरिक यात्रा के लिए स्वयं को तैयार करते हुए।',
      },
    ],
  },
};

export default function Gathering({ lang = 'EN' }) {
  const t = TEXT[lang] || TEXT.EN;

  return (
    <section
      className="scheme-4"
      style={{
        padding: 'clamp(4rem, 10vw, 8rem) 1.5rem',
        background: 'var(--color-bg, #d9cfbf)',
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

          {/* Gathering Cards */}
          <StaggerContainer>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                marginBottom: '2.5rem',
              }}
              className="gathering-grid"
            >
              {t.items.map((item, i) => (
                <StaggerItem key={i}>
                  <div
                    className="gathering-card"
                    style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: 'var(--color-surface, #fff)',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        overflow: 'hidden',
                        borderRadius: '12px 12px 0 0',
                        height: 240,
                      }}
                    >
                      <img
                        src={GATHERING_IMAGES[i]}
                        alt={item.title}
                        loading="lazy"
                        className="gathering-img"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.5s ease',
                        }}
                      />
                    </div>
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
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: 'var(--font-body, sans-serif)',
                          fontSize: '0.9rem',
                          lineHeight: 1.7,
                          color: 'var(--color-text-muted, rgba(27,30,28,0.65))',
                        }}
                      >
                        {item.description}
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
        .gathering-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
        }
        .gathering-card:hover .gathering-img {
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .gathering-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

