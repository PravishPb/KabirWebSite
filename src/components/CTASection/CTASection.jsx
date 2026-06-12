import React from 'react';
import { AnimatedSection } from '../ui';
import { Button, ChevronLink } from '../ui';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import './CTASection.css';

export default function CTASection() {
  const { lang, toast } = useApp();
  const t = useTranslation('CTASection');
  
  return (
    <section className="scheme-2 cta-section">
      <AnimatedSection>
        <div className="cta-container">
          <h2 className="cta-title">
            {t.h2}
          </h2>

          <p className="cta-lead">
            {t.lead}
          </p>

          <div className="cta-buttons">
            <Button
              onClick={() => toast && toast(t.visit)}
              className="cta-btn"
            >
              {t.visit}
            </Button>
            <ChevronLink to="/contact">{t.more}</ChevronLink>
          </div>
        </div>
      </AnimatedSection>

      {/* Full-bleed Image */}
      <div className="cta-image-wrapper">
        <img
          src="/above-footer.png"
          alt="Kabir Association community"
          loading="lazy"
          className="cta-image"
        />
      </div>
    </section>
  );
}

