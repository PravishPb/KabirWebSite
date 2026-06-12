import React from 'react';
import { motion } from 'framer-motion';
import { Button, Eyebrow } from '../components/ui';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../locales/useTranslation';

export default function AboutPage() {
  const { lang } = useApp();
  const c = useTranslation('AboutPage');
  return (
    <div className="page-content">
      <section className="section scheme-2">
        <div className="container">
          <AnimatedSection>
            <div className="prose center" style={{ marginInline: 'auto' }}>
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1">{c.title}</h1>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section scheme-3">
        <div className="container">
          <AnimatedSection>
            <div className="prose" style={{ marginInline: 'auto', maxWidth: '48rem' }}>
              {c.body.split('\n\n').map((para, i) => (
                <p key={i} className="lead" style={{ marginBottom: '1.5rem' }}>{para}</p>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section scheme-1">
        <div className="container">
          <AnimatedSection>
            <div className="prose center" style={{ marginInline: 'auto' }}>
              <Eyebrow>{c.mission}</Eyebrow>
              <h2 className="h3" style={{ color: '#fff' }}>{c.missionText}</h2>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section scheme-3">
        <div className="container">
          <AnimatedSection>
            <div className="prose center" style={{ marginInline: 'auto', marginBottom: '48px' }}>
              <Eyebrow>{c.values}</Eyebrow>
            </div>
          </AnimatedSection>
          <div className="trio" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {c.valueItems.map((item, i) => (
              <motion.div
                key={item.title}
                className="trio-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <h3 className="h5">{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
