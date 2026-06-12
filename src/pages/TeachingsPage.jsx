import React from 'react';
import { motion } from 'framer-motion';
import { Button, Eyebrow, ChevronLink } from '../components/ui';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../locales/useTranslation';

export default function TeachingsPage() {
  const { lang } = useApp();
  const c = useTranslation('TeachingsPage');
  return (
    <div className="page-content">
      <section className="section scheme-5">
        <div className="container">
          <AnimatedSection>
            <div className="prose center" style={{ marginInline: 'auto' }}>
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1">{c.title}</h1>
              <p className="lead" style={{ marginTop: '24px' }}>{c.intro}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {c.sections.map((sec, i) => (
        <section key={sec.title} className={`section ${i % 2 === 0 ? 'scheme-3' : 'scheme-2'}`}>
          <div className="container">
            <AnimatedSection>
              <div className="prose" style={{ marginInline: 'auto', maxWidth: '48rem' }}>
                <h2 className="h3" style={{ marginBottom: '24px' }}>{sec.title}</h2>
                <p className="lead" style={{ marginBottom: '24px' }}>{sec.body}</p>
                <blockquote style={{
                  borderLeft: '3px solid var(--tahiti-gold)',
                  paddingLeft: '24px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-h5)',
                  lineHeight: 'var(--leading-heading)',
                  fontStyle: 'italic',
                  color: 'var(--fg2)',
                  margin: '32px 0',
                }}>
                  {sec.quote}
                </blockquote>
              </div>
            </AnimatedSection>
          </div>
        </section>
      ))}
    </div>
  );
}
