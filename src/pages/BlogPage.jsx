import React from 'react';
import { motion } from 'framer-motion';
import { Badge, Eyebrow, ChevronLink } from '../components/ui';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';

function PlaceholderImg({ className = '', style = {}, alt = '', gradient = 'linear-gradient(135deg, #1b1e1c 0%, #563401 50%, #d98204 100%)' }) {
  return <div className={className} style={{ ...style, background: gradient, width: '100%' }} role="img" aria-label={alt} />;
}

const posts = {
  EN: [
    { cat: 'Teaching', read: '3 min read', title: 'The practice of turning inward', excerpt: 'How silence becomes the truest teacher in our daily lives. In a world of noise and distraction, Kabir calls us to stillness — not as escape, but as arrival.' },
    { cat: 'Devotion', read: '4 min read', title: "Kabir's voice across the centuries", excerpt: 'Understanding the saint-poet\'s message for modern seekers. His words, woven five hundred years ago, speak to the anxieties and longings of our time.' },
    { cat: 'Community', read: '5 min read', title: 'What satsang truly means', excerpt: 'The alchemy of gathering with those who seek truth. When seekers sit together, something shifts — the air changes, the heart opens.' },
    { cat: 'Practice', read: '6 min read', title: 'Sumiran: the thread of remembrance', excerpt: 'The ancient practice of continuous divine remembrance, and how it transforms the texture of ordinary life into something luminous.' },
    { cat: 'Heritage', read: '4 min read', title: 'The weaver saint of Varanasi', excerpt: 'A journey through the life and times of Kabir — from the looms of Kashi to the hearts of millions across the world.' },
    { cat: 'Reflection', read: '3 min read', title: 'Finding stillness in Toronto', excerpt: 'How a small community in Canada keeps alive a tradition that began on the banks of the Ganges, five centuries ago.' },
  ],
  HI: [
    { cat: 'शिक्षा', read: '3 मिनट', title: 'अंतर्मुखी होने का अभ्यास', excerpt: 'कैसे मौन हमारे दैनिक जीवन में सबसे सच्चा शिक्षक बन जाता है। शोर और विकर्षण की दुनिया में, कबीर हमें शांति की ओर बुलाते हैं।' },
    { cat: 'भक्ति', read: '4 मिनट', title: 'सदियों से कबीर की आवाज़', excerpt: 'आधुनिक साधकों के लिए संत-कवि के संदेश को समझना। पांच सौ साल पहले बुने उनके शब्द हमारे समय की चिंताओं से बात करते हैं।' },
    { cat: 'समुदाय', read: '5 मिनट', title: 'सत्संग का सच्चा अर्थ', excerpt: 'सत्य की खोज करने वालों के साथ एकत्र होने का रसायन। जब साधक साथ बैठते हैं, कुछ बदलता है — हवा बदलती है, हृदय खुलता है।' },
    { cat: 'अभ्यास', read: '6 मिनट', title: 'सुमिरन: स्मरण का धागा', excerpt: 'निरंतर दिव्य स्मरण का प्राचीन अभ्यास, और कैसे यह सामान्य जीवन को कुछ प्रकाशमय में बदल देता है।' },
    { cat: 'विरासत', read: '4 मिनट', title: 'वाराणसी के जुलाहे संत', excerpt: 'कबीर के जीवन और काल की यात्रा — काशी के करघों से लेकर दुनिया भर के लाखों लोगों के दिलों तक।' },
    { cat: 'चिंतन', read: '3 मिनट', title: 'टोरंटो में शांति की खोज', excerpt: 'कनाडा में एक छोटा समुदाय कैसे एक परंपरा को जीवित रखता है जो पांच सदी पहले गंगा के तट पर शुरू हुई थी।' },
  ],
};

const gradients = [
  'linear-gradient(135deg, #2c5f3a 0%, #112617 100%)',
  'linear-gradient(135deg, #563401 0%, #d98204 100%)',
  'linear-gradient(135deg, #1b1e1c 0%, #4d504e 100%)',
  'linear-gradient(135deg, #412701 0%, #ad6803 100%)',
  'linear-gradient(135deg, #234c2e 0%, #6b8f75 100%)',
  'linear-gradient(135deg, #2a3138 0%, #6a7b8c 100%)',
];

export default function BlogPage({ lang, toast }) {
  const p = posts[lang];
  return (
    <div className="page-content">
      <section className="section scheme-2">
        <div className="container">
          <AnimatedSection>
            <div className="prose center" style={{ marginInline: 'auto' }}>
              <Eyebrow>{lang === 'EN' ? 'Writings' : 'लेख'}</Eyebrow>
              <h1 className="h1">{lang === 'EN' ? 'Sermons and reflections' : 'उपदेश और चिंतन'}</h1>
              <p className="lead" style={{ marginTop: '20px' }}>
                {lang === 'EN' ? 'Words that illuminate the path' : 'शब्द जो मार्ग को प्रकाशित करते हैं'}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section scheme-3">
        <div className="container">
          <StaggerContainer className="blog-grid">
            {p.map((post, i) => (
              <StaggerItem key={post.title}>
                <article className="blog-card" onClick={() => toast && toast(post.title)}>
                  <PlaceholderImg
                    className="rounded-img blog-img"
                    gradient={gradients[i % gradients.length]}
                    alt={post.title}
                  />
                  <div className="blog-meta">
                    <Badge>{post.cat}</Badge>
                    <span className="blog-read">{post.read}</span>
                  </div>
                  <h3 className="h5">{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <ChevronLink>{lang === 'EN' ? 'Read more' : 'और पढ़ें'}</ChevronLink>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
