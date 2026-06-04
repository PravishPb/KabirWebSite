import React from 'react';
import Hero from '../components/Hero';
import QuoteSection from '../components/QuoteSection';
import WelcomeHeader from '../components/WelcomeHeader';
import Pillars from '../components/Pillars';
import Gathering from '../components/Gathering';
import RitualFeature from '../components/RitualFeature';
import BlogSection from '../components/BlogSection';
import LibraryFeature from '../components/LibraryFeature';
import CTASection from '../components/CTASection';

export default function HomePage({ lang, toast }) {
  return (
    <>
      <Hero lang={lang} toast={toast} />
      <QuoteSection lang={lang} />
      <WelcomeHeader lang={lang} toast={toast} />
      <Pillars lang={lang} />
      <Gathering lang={lang} />
      <RitualFeature lang={lang} toast={toast} />
      <BlogSection lang={lang} toast={toast} />
      <LibraryFeature lang={lang} toast={toast} />
      <CTASection lang={lang} toast={toast} />
    </>
  );
}
