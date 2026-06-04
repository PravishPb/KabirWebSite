import React from 'react';
import { AnimatedSection } from './ui';
import { Button, Eyebrow, ChevronLink } from './ui';

const TEXT = {
  EN: {
    eyebrow: 'Stillness',
    h2: 'The drop merges into the ocean',
    quote:
      '"I went looking for the wicked, I found none. When I looked inside myself, I found none worse than me. Kabir says, the seeker of truth is the one who recognises their own ignorance and, with humility, seeks the company of the wise."',
    breathe: 'Breathe',
    more: 'More teachings',
  },
  HI: {
    eyebrow: 'शांति',
    h2: 'बूंद सागर में मिल जाती है',
    quote:
      '"बुरा जो देखन मैं चला, बुरा न मिलिया कोय। जो दिल खोजा आपना, मुझसे बुरा न कोय।। कबीर कहते हैं, सत्य का साधक वही है जो अपनी अज्ञानता को पहचानता है और, विनम्रता से, बुद्धिमानों की संगत चाहता है।"',
    breathe: 'श्वास लें',
    more: 'और शिक्षाएँ',
  },
};

export default function QuoteSection({ lang = 'EN' }) {
  const t = TEXT[lang] || TEXT.EN;

  return (
    <section
      id="quote"
      className="scheme-2"
      style={{
        padding: 'clamp(4rem, 10vw, 8rem) 1.5rem',
        background: 'var(--color-bg, #f5f0e8)',
      }}
    >
      <AnimatedSection>
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <Eyebrow>{t.eyebrow}</Eyebrow>

          <h2
            style={{
              fontFamily: 'var(--font-heading, "Cormorant Unicase", serif)',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 300,
              lineHeight: 1.2,
              color: 'var(--color-text, #1b1e1c)',
              marginBottom: '2rem',
            }}
          >
            {t.h2}
          </h2>

          <blockquote
            style={{
              fontFamily: 'var(--font-body, sans-serif)',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              lineHeight: 1.8,
              color: 'var(--color-text-muted, rgba(27,30,28,0.7))',
              fontStyle: 'italic',
              marginBottom: '2.5rem',
              padding: 0,
              border: 'none',
            }}
          >
            {t.quote}
          </blockquote>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Button
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
              {t.breathe}
            </Button>
            <ChevronLink to="/teachings">{t.more}</ChevronLink>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
