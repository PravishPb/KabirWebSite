import React from 'react';
import { AnimatedSection } from '../ui';
import { Button, Eyebrow, ChevronLink } from '../ui';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import './QuoteSection.css';

export default function QuoteSection() {
  const { lang, toast } = useApp();
  const t = useTranslation('QuoteSection');
  
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
            <Button className="quote-btn">
              {t.breathe}
            </Button>
            <ChevronLink to="/teachings">{t.more}</ChevronLink>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

