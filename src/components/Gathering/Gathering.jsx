import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui';
import { Button, Eyebrow } from '../ui';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import './Gathering.css';

const GATHERING_IMAGES = [
  '/gathering-satsang.png',
  '/gathering-bhajan.png',
  '/gathering-yoga.png',
];

export default function Gathering() {
  const { lang, toast } = useApp();
  const t = useTranslation('Gathering');
  const navigate = useNavigate();
  
  return (
    <section className="scheme-4 gathering-section">
      <AnimatedSection>
        <div className="gathering-container">
          {/* Header */}
          <div className="gathering-header">
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <h2 className="gathering-title">
              {t.title}
            </h2>
            <p className="gathering-body">
              {t.body}
            </p>
          </div>

          {/* Gathering Cards */}
          <StaggerContainer>
            <div className="gathering-grid">
              {t.items && t.items.map((item, i) => (
                <StaggerItem key={i}>
                  <div className="gathering-card">
                    <div className="gathering-img-wrapper">
                      <img
                        src={GATHERING_IMAGES[i]}
                        alt={item.title}
                        loading="lazy"
                        className="gathering-img"
                      />
                    </div>
                    <div className="gathering-card-content">
                      <h3 className="gathering-card-title">
                        {item.title}
                      </h3>
                      <p className="gathering-card-desc">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          {/* Button */}
          <div className="gathering-btn-wrapper">
            <Button className="gathering-btn" onClick={() => navigate('/events')}>
              {t.button}
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}


