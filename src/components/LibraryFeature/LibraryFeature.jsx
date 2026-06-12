import React from 'react';
import { AnimatedSection } from '../ui';
import { Button, Eyebrow, ChevronLink } from '../ui';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import './LibraryFeature.css';

export default function LibraryFeature() {
  const { lang, toast } = useApp();
  const t = useTranslation('LibraryFeature');
  
  return (
    <section className="scheme-5 library-section">
      <AnimatedSection>
        <div className="library-container">
          {/* Text Content */}
          <div className="library-content">
            <Eyebrow className="library-eyebrow">{t.eyebrow}</Eyebrow>
            <h2 className="library-title">
              {t.h2}
            </h2>
            <p className="library-body">
              {t.body}
            </p>
            <div className="library-actions">
              <Button
                onClick={() => toast && toast(t.visit)}
                className="library-btn"
              >
                {t.visit}
              </Button>
              <ChevronLink to="/library" className="library-link">
                {t.more}
              </ChevronLink>
            </div>
          </div>

          {/* Large Image */}
          <div className="library-image-wrapper">
            <img
              src="/library.png"
              alt="Library collection"
              loading="lazy"
              className="library-img"
            />
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

