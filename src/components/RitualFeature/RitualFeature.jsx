import React from 'react';
import { AnimatedSection } from '../ui';
import { Button, Eyebrow, ChevronLink } from '../ui';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import './RitualFeature.css';

export default function RitualFeature() {
  const { lang, toast } = useApp();
  const t = useTranslation('RitualFeature');
  
  return (
    <section className="scheme-2 ritual-section">
      {/* Full-bleed image */}
      <div className="ritual-image-wrapper">
        <img
          src="/ritual-chowka.png"
          alt="Chowka Aarti ceremony"
          loading="lazy"
          className="ritual-img"
        />
      </div>

      {/* Text Section */}
      <AnimatedSection>
        <div className="ritual-content">
          <Eyebrow>{t.eyebrow}</Eyebrow>

          <h5 className="ritual-title">
            {t.h5}
          </h5>

          <div className="ritual-actions">
            <Button
              onClick={() => toast && toast(t.learn)}
              className="ritual-btn"
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

