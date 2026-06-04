import React from 'react';
import { AnimatedSection } from './ui';
import { Button, Eyebrow, ChevronLink } from './ui';

function PlaceholderImg({ className = '', style = {}, alt = '', gradient = 'linear-gradient(135deg, #1b1e1c 0%, #563401 50%, #d98204 100%)' }) {
  return <div className={className} style={{ ...style, background: gradient, width: '100%' }} role="img" aria-label={alt} />;
}

const TEXT = {
  EN: {
    eyebrow: 'Ritual',
    h5: 'The Chowka Aarti is a sacred ceremony of light — four lamps turned slowly before the divine, each one symbolising a stage of awakening. Performed in the stillness of satsang, it gathers the community in reverence, gratitude, and surrender.',
    learn: 'Learn about our rituals',
    more: 'More traditions',
  },
  HI: {
    eyebrow: 'अनुष्ठान',
    h5: 'चौका आरती प्रकाश का एक पवित्र अनुष्ठान है — चार दीपक धीरे-धीरे परमात्मा के सामने घुमाए जाते हैं, प्रत्येक जागृति की एक अवस्था का प्रतीक है। सत्संग की शांति में संपन्न, यह समुदाय को श्रद्धा, कृतज्ञता और समर्पण में एकत्र करती है।',
    learn: 'हमारे अनुष्ठानों के बारे में जानें',
    more: 'और परंपराएँ',
  },
};

export default function RitualFeature({ lang = 'EN', toast }) {
  const t = TEXT[lang] || TEXT.EN;

  return (
    <section
      className="scheme-2"
      style={{
        background: 'var(--color-bg, #f5f0e8)',
      }}
    >
      {/* Full-bleed image */}
      <PlaceholderImg
        alt="Chowka Aarti ceremony"
        gradient="linear-gradient(135deg, #2a1a08 0%, #6b3f00 30%, #d98204 60%, #f0b840 100%)"
        style={{
          height: 'clamp(300px, 45vw, 520px)',
        }}
      />

      {/* Text Section */}
      <AnimatedSection>
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: 'clamp(3rem, 8vw, 5rem) 1.5rem',
            textAlign: 'center',
          }}
        >
          <Eyebrow>{t.eyebrow}</Eyebrow>

          <h5
            style={{
              fontFamily: 'var(--font-heading, "Cormorant Unicase", serif)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              fontWeight: 400,
              lineHeight: 1.7,
              color: 'var(--color-text, #1b1e1c)',
              marginBottom: '2rem',
            }}
          >
            {t.h5}
          </h5>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
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
            <ChevronLink to="/teachings">{t.more}</ChevronLink>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
