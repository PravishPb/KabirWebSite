import React from 'react';
import { Eyebrow } from '../components/ui';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { useTranslation } from '../locales/useTranslation';

export default function EventsPage() {
  const t = useTranslation('EventsPage');

  return (
    <div className="page-content">
      <section className="section scheme-5">
        <div className="container">
          <AnimatedSection>
            <div className="prose center" style={{ marginInline: 'auto', textAlign: 'center' }}>
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h1 className="h1">{t.title}</h1>
              <p className="lead" style={{ marginTop: '24px' }}>{t.intro}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section scheme-3">
        <div className="container">
          <AnimatedSection>
            <div className="prose" style={{ marginInline: 'auto', maxWidth: '48rem', textAlign: 'center' }}>
              <p className="muted2">
                {t.detailsSoon}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
