import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui';
import { Button, Eyebrow } from '../ui';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import './WelcomeHeader.css';

export default function WelcomeHeader() {
  const { lang, toast } = useApp();
  const t = useTranslation('WelcomeHeader');
  const navigate = useNavigate();
  
  return (
    <section className="scheme-1 welcome-section">
      <AnimatedSection className="welcome-animated-wrapper">
        <StaggerContainer>
          <div className="welcome-grid">
            {/* Left Column — Image */}
            <StaggerItem>
              <div className="welcome-img-wrapper">
                <img
                  src="/welcome.jpg"
                  alt="A spiritual home, founded in devotion"
                  loading="lazy"
                  className="welcome-img"
                />
                {/* Subtle gradient vignette on the image edges */}
                <div aria-hidden="true" className="welcome-img-vignette" />
              </div>
            </StaggerItem>

            {/* Right Column — Text */}
            <StaggerItem>
              <div className="welcome-content">
                <Eyebrow className="welcome-eyebrow">{t.eyebrow}</Eyebrow>
                <h1 className="welcome-title">
                  {t.h1}
                </h1>
                <p className="welcome-body">
                  {t.body}
                </p>
                <div className="welcome-btn-wrapper">
                  <Button
                    onClick={() => navigate('/about')}
                    className="welcome-btn-primary"
                  >
                    {t.learn}
                  </Button>
                </div>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </AnimatedSection>
    </section>
  );
}


