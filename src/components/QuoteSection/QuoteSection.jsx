import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from '../ui';
import { Button, Eyebrow } from '../ui';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import './QuoteSection.css';

export default function QuoteSection() {
  const { lang, toast } = useApp();
  const t = useTranslation('QuoteSection');
  const navigate = useNavigate();
  
  return (
    <section
      id="quote"
      className="scheme-2 quote-section"
    >
      <AnimatedSection>
        <div className="quote-container">
          <Eyebrow>{t.eyebrow}</Eyebrow>

          <h2 className="quote-title">
            {t.h2}
          </h2>

          <blockquote className="quote-blockquote">
            {t.quote}
          </blockquote>

          <div className="quote-buttons">
            <Button className="quote-btn" onClick={() => navigate('/teachings')}>
              {t.more}
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

