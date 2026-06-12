import React from 'react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui';
import { Button, Eyebrow } from '../ui';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import './Pillars.css';

const PILLAR_IMAGES = [
  '/pillar-satsang.png',
  '/pillar-sumiran.png',
  '/pillar-sewa.png',
];

export default function Pillars() {
  const { lang, toast } = useApp();
  const t = useTranslation('Pillars');
  
  return (
    <section className="scheme-3 pillars-section">
      <AnimatedSection>
        <div className="pillars-container">
          {/* Header */}
          <div className="pillars-header">
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <h2 className="pillars-title">
              {t.title}
            </h2>
            <p className="pillars-body">
              {t.body}
            </p>
          </div>

          {/* Pillar Cards */}
          <StaggerContainer>
            <div className="pillars-grid">
              {t.pillars && t.pillars.map((pillar, i) => (
                <StaggerItem key={i}>
                  <div className="pillar-card">
                    <div className="pillar-img-wrapper">
                      <img
                        src={PILLAR_IMAGES[i]}
                        alt={pillar.title}
                        loading="lazy"
                        className="pillar-img"
                      />
                    </div>
                    <div className="pillar-card-content">
                      <h3 className="pillar-card-title">
                        {pillar.title}
                      </h3>
                      <p className="pillar-card-desc">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          {/* Button */}
          <div className="pillars-btn-wrapper">
            <Button className="pillars-btn">
              {t.button}
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

