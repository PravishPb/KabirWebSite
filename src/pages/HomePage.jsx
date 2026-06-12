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

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuoteSection />
      <WelcomeHeader />
      <Pillars />
      <Gathering />
      <RitualFeature />
      <BlogSection />
      <LibraryFeature />
      <CTASection />
    </>
  );
}
