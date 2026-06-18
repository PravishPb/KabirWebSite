import React from 'react';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { Eyebrow } from '../components/ui';

export default function ContactPage() {
  return (
    <div className="page-content scheme-2" style={{ minHeight: '100vh' }}>
      <section className="section">
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto">
              <Eyebrow>Get in Touch</Eyebrow>
              <h1 className="h2" style={{ marginBottom: '24px' }}>Contact Us</h1>
              <p className="lead muted2">Content coming soon...</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
