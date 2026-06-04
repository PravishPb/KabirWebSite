import React from 'react';
import { AnimatedSection } from './ui';
import { Button, Eyebrow, ChevronLink } from './ui';

function PlaceholderImg({ className = '', style = {}, alt = '', gradient = 'linear-gradient(135deg, #1b1e1c 0%, #563401 50%, #d98204 100%)' }) {
  return <div className={className} style={{ ...style, background: gradient, width: '100%' }} role="img" aria-label={alt} />;
}

const TEXT = {
  EN: {
    eyebrow: 'Library',
    h2: 'Words to carry with you',
    body: 'Browse our growing collection of sacred texts, recorded satsangs, bhajans, and study materials. Whether you are new to the path or have walked it for years, there is always something waiting to be discovered.',
    visit: 'Visit the library',
    more: 'More resources',
  },
  HI: {
    eyebrow: 'पुस्तकालय',
    h2: 'अपने साथ ले जाने के शब्द',
    body: 'पवित्र ग्रंथों, रिकॉर्ड किए गए सत्संगों, भजनों और अध्ययन सामग्री के हमारे बढ़ते संग्रह को ब्राउज़ करें। चाहे आप इस मार्ग पर नए हों या वर्षों से चल रहे हों, खोजने के लिए हमेशा कुछ न कुछ होता है।',
    visit: 'पुस्तकालय देखें',
    more: 'और संसाधन',
  },
};

export default function LibraryFeature({ lang = 'EN', toast }) {
  const t = TEXT[lang] || TEXT.EN;

  return (
    <section
      className="scheme-5"
      style={{
        padding: 'clamp(4rem, 10vw, 8rem) 1.5rem',
        background: 'var(--color-bg, #3d2508)',
        color: 'var(--color-text, #f5f0e8)',
      }}
    >
      <AnimatedSection>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Text Content */}
          <div style={{ maxWidth: 640, marginBottom: '3rem' }}>
            <Eyebrow style={{ color: 'var(--color-accent, #d98204)' }}>{t.eyebrow}</Eyebrow>
            <h2
              style={{
                fontFamily: 'var(--font-heading, "Cormorant Unicase", serif)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.2,
                color: 'var(--color-text, #f5f0e8)',
                marginBottom: '1rem',
              }}
            >
              {t.h2}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body, sans-serif)',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'rgba(245,240,232,0.65)',
                marginBottom: '2rem',
              }}
            >
              {t.body}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Button
                onClick={() => toast && toast(t.visit)}
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
                {t.visit}
              </Button>
              <ChevronLink to="/library" style={{ color: 'var(--color-accent, #d98204)' }}>
                {t.more}
              </ChevronLink>
            </div>
          </div>

          {/* Large Image */}
          <PlaceholderImg
            alt="Library collection"
            gradient="linear-gradient(135deg, #1b1e1c 0%, #2a1a08 30%, #563401 60%, #8b5e0c 100%)"
            style={{
              aspectRatio: '16 / 9',
              borderRadius: 16,
              boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
            }}
          />
        </div>
      </AnimatedSection>
    </section>
  );
}
