import React from 'react';
import { AnimatedSection } from './ui';
import { Button, ChevronLink } from './ui';

const TEXT = {
  EN: {
    h2: 'Come, sit a while with us',
    lead: 'Toronto. Satsang each week. All are welcome.',
    visit: 'Plan your visit',
    more: 'Get in touch',
  },
  HI: {
    h2: 'आइए, कुछ देर हमारे साथ बैठिए',
    lead: 'टोरंटो। हर सप्ताह सत्संग। सभी का स्वागत है।',
    visit: 'अपनी यात्रा की योजना बनाएं',
    more: 'संपर्क करें',
  },
};

export default function CTASection({ lang = 'EN', toast }) {
  const t = TEXT[lang] || TEXT.EN;

  return (
    <section
      className="scheme-2"
      style={{
        background: 'var(--color-bg, #f5f0e8)',
      }}
    >
      <AnimatedSection>
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            padding: 'clamp(4rem, 10vw, 8rem) 1.5rem',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading, "Cormorant Unicase", serif)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 300,
              lineHeight: 1.15,
              color: 'var(--color-text, #1b1e1c)',
              marginBottom: '1.25rem',
            }}
          >
            {t.h2}
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body, sans-serif)',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              lineHeight: 1.7,
              color: 'var(--color-text-muted, rgba(27,30,28,0.65))',
              marginBottom: '2.5rem',
            }}
          >
            {t.lead}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Button
              onClick={() => toast && toast(t.visit)}
              style={{
                padding: '0.9rem 2rem',
                fontSize: '0.95rem',
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
            <ChevronLink to="/contact">{t.more}</ChevronLink>
          </div>
        </div>
      </AnimatedSection>

      {/* Full-bleed Image */}
      <div style={{ overflow: 'hidden' }}>
        <img
          src="/above-footer.png"
          alt="Kabir Association community"
          loading="lazy"
          style={{
            width: '100%',
            height: 'clamp(250px, 40vw, 480px)',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    </section>
  );
}
