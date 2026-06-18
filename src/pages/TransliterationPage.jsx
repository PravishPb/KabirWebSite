import React from 'react';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { Eyebrow } from '../components/ui';

export default function TransliterationPage() {
  return (
    <div className="page-content scheme-2" style={{ minHeight: '100vh' }}>
      <section className="section">
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto">
              <Eyebrow>Library</Eyebrow>
              <h1 className="h2" style={{ marginBottom: '24px' }}>Transliteration Guide</h1>
              <p className="lead muted2">Content coming soon...</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
