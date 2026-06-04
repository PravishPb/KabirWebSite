import React from 'react';
import { motion } from 'framer-motion';
import { Button, Eyebrow, ChevronLink } from '../components/ui';
import { AnimatedSection } from '../components/ui/AnimatedSection';

const content = {
  EN: {
    eyebrow: 'Teachings',
    title: 'The path of Kabir',
    intro: 'Kabir\'s teachings are a call to the innermost self — a rejection of empty ritual and a celebration of direct, personal experience of the divine. His dohas (couplets) cut through the noise of the world with startling clarity.',
    sections: [
      {
        title: 'The Inner Light',
        body: 'Kabir speaks of a light that burns within every being — unchanged by time, untouched by death. He urges us to turn our gaze inward, away from the distractions of the material world, to discover the divine presence that has always been there.',
        quote: '"The moon shines in my body, but my blind eyes cannot see it."',
      },
      {
        title: 'Beyond Religion',
        body: 'In an age of rigid religious boundaries, Kabir stood apart. He belonged to no sect, followed no single scripture. He drew from the well of universal truth, challenging both Hindu ritual and Islamic orthodoxy with equal fearlessness.',
        quote: '"I am not Hindu, nor Muslim. I am a body made of five elements where the Unknown plays."',
      },
      {
        title: 'The Satguru',
        body: 'Central to Kabir\'s path is the role of the Satguru — the true teacher. Not a figure of authority, but a light-bearer who awakens the sleeping soul. Without the Guru\'s grace, Kabir tells us, the eye remains closed to the world within.',
        quote: '"Guru Govind dono khade, kake laagoon paay. Balihari Guru aapne, Govind diyo bataye."',
      },
      {
        title: 'Sahaj — Natural Ease',
        body: 'Kabir\'s spirituality is not one of struggle and strain. He teaches sahaj — a state of natural, effortless being. Truth is not attained through austerity alone, but through surrender, love, and the gentle dissolution of the ego.',
        quote: '"Slowly, slowly O mind... everything happens at its own pace."',
      },
    ],
  },
  HI: {
    eyebrow: 'शिक्षाएं',
    title: 'कबीर का मार्ग',
    intro: 'कबीर की शिक्षाएं अंतरात्मा की पुकार हैं — खोखले कर्मकांडों का त्याग और दिव्य के प्रत्यक्ष, व्यक्तिगत अनुभव का उत्सव। उनके दोहे दुनिया के शोर को चौंकाने वाली स्पष्टता से काटते हैं।',
    sections: [
      {
        title: 'आंतरिक प्रकाश',
        body: 'कबीर एक ऐसी रोशनी की बात करते हैं जो हर प्राणी के भीतर जलती है — समय से अपरिवर्तित, मृत्यु से अछूती। वे हमसे अपनी दृष्टि को भौतिक संसार के विकर्षणों से हटाकर भीतर की ओर मोड़ने का आग्रह करते हैं।',
        quote: '"चांद मेरे शरीर में चमकता है, पर मेरी अंधी आंखें इसे देख नहीं सकतीं।"',
      },
      {
        title: 'धर्म से परे',
        body: 'कठोर धार्मिक सीमाओं के युग में, कबीर अलग खड़े थे। वे किसी संप्रदाय के नहीं थे, किसी एक शास्त्र का अनुसरण नहीं करते थे। उन्होंने सार्वभौमिक सत्य के कुएं से पानी पिया।',
        quote: '"न मैं हिंदू हूं, न मुसलमान। मैं पांच तत्वों से बना शरीर हूं जहां अज्ञात खेलता है।"',
      },
      {
        title: 'सतगुरु',
        body: 'कबीर के मार्ग में सतगुरु की भूमिका केंद्रीय है — सच्चे शिक्षक। अधिकार की कोई आकृति नहीं, बल्कि एक प्रकाश-वाहक जो सोई हुई आत्मा को जगाता है।',
        quote: '"गुरु गोविंद दोनो खड़े, काके लागूं पाय। बलिहारी गुरु आपने, गोविंद दियो बताय।"',
      },
      {
        title: 'सहज — प्राकृतिक सहजता',
        body: 'कबीर की आध्यात्मिकता संघर्ष और तनाव की नहीं है। वे सहज सिखाते हैं — प्राकृतिक, सहज अस्तित्व की स्थिति। सत्य केवल तपस्या से नहीं, बल्कि समर्पण, प्रेम और अहंकार के कोमल विलय से प्राप्त होता है।',
        quote: '"धीरे-धीरे रे मना, धीरे सब कुछ होय। माली सींचे सौ घड़ा, ऋतु आए फल होय।"',
      },
    ],
  },
};

export default function TeachingsPage({ lang }) {
  const c = content[lang];
  return (
    <div className="page-content">
      <section className="section scheme-5">
        <div className="container">
          <AnimatedSection>
            <div className="prose center" style={{ marginInline: 'auto' }}>
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1">{c.title}</h1>
              <p className="lead" style={{ marginTop: '24px' }}>{c.intro}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {c.sections.map((sec, i) => (
        <section key={sec.title} className={`section ${i % 2 === 0 ? 'scheme-3' : 'scheme-2'}`}>
          <div className="container">
            <AnimatedSection>
              <div className="prose" style={{ marginInline: 'auto', maxWidth: '48rem' }}>
                <h2 className="h3" style={{ marginBottom: '24px' }}>{sec.title}</h2>
                <p className="lead" style={{ marginBottom: '24px' }}>{sec.body}</p>
                <blockquote style={{
                  borderLeft: '3px solid var(--tahiti-gold)',
                  paddingLeft: '24px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-h5)',
                  lineHeight: 'var(--leading-heading)',
                  fontStyle: 'italic',
                  color: 'var(--fg2)',
                  margin: '32px 0',
                }}>
                  {sec.quote}
                </blockquote>
              </div>
            </AnimatedSection>
          </div>
        </section>
      ))}
    </div>
  );
}
