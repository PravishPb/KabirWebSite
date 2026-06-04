import React from 'react';
import { motion } from 'framer-motion';
import { Button, Eyebrow } from '../components/ui';
import { AnimatedSection } from '../components/ui/AnimatedSection';

const content = {
  EN: {
    eyebrow: 'About Us',
    title: 'Who we are',
    body: `The Kabir Association of Toronto is a registered charitable non-profit established in 2011 in Ontario, Canada. We carry forward the teachings of the 15th-century mystic saint-poet Kabir — a weaver by trade, a seeker by calling — whose verses transcend religion, caste, and creed.

Our community gathers weekly for satsang, devotional song (bhajan), and the quiet practice of turning inward. We believe in the oneness of all beings and the transformative power of truth, love, and selfless service.

Kabir's message is simple yet profound: look within, question outward rituals, and find the divine in every breath. His poetry, composed in the language of the common people, continues to inspire seekers across the globe — from the banks of the Ganges to the shores of Lake Ontario.`,
    mission: 'Our Mission',
    missionText: 'To preserve and share the timeless teachings of Saint Kabir, fostering a community of seekers united in devotion, service, and the pursuit of inner truth.',
    values: 'Our Values',
    valueItems: [
      { title: 'Truth (Satya)', desc: 'We seek truth in all things and encourage honest self-inquiry.' },
      { title: 'Devotion (Bhakti)', desc: 'Love and devotion to the divine form the heart of our practice.' },
      { title: 'Service (Sewa)', desc: 'Selfless service to humanity is our highest calling.' },
      { title: 'Unity (Ekta)', desc: 'We see the divine in all beings, beyond caste, creed, or religion.' },
    ],
  },
  HI: {
    eyebrow: 'हमारे बारे में',
    title: 'हम कौन हैं',
    body: `कबीर एसोसिएशन ऑफ़ टोरंटो 2011 में ओंटारियो, कनाडा में स्थापित एक पंजीकृत धर्मार्थ गैर-लाभकारी संस्था है। हम 15वीं सदी के रहस्यवादी संत-कवि कबीर — जो व्यवसाय से जुलाहे थे, स्वभाव से साधक — की शिक्षाओं को आगे बढ़ाते हैं, जिनके दोहे धर्म, जाति और पंथ से परे हैं।

हमारा समुदाय साप्ताहिक सत्संग, भक्ति गीत (भजन), और अंतर्मुखी होने के शांत अभ्यास के लिए एकत्र होता है। हम सभी प्राणियों की एकता और सत्य, प्रेम और निस्वार्थ सेवा की परिवर्तनकारी शक्ति में विश्वास करते हैं।

कबीर का संदेश सरल लेकिन गहन है: भीतर देखो, बाहरी कर्मकांडों पर प्रश्न करो, और हर सांस में दिव्य को खोजो।`,
    mission: 'हमारा उद्देश्य',
    missionText: 'संत कबीर की कालजयी शिक्षाओं को संरक्षित और साझा करना, भक्ति, सेवा और आंतरिक सत्य की खोज में एकजुट साधकों का समुदाय बनाना।',
    values: 'हमारे मूल्य',
    valueItems: [
      { title: 'सत्य (Satya)', desc: 'हम सभी चीजों में सत्य की खोज करते हैं और ईमानदार आत्म-जिज्ञासा को प्रोत्साहित करते हैं।' },
      { title: 'भक्ति (Bhakti)', desc: 'दिव्य के प्रति प्रेम और भक्ति हमारे अभ्यास का हृदय है।' },
      { title: 'सेवा (Sewa)', desc: 'मानवता की निस्वार्थ सेवा हमारी सर्वोच्च पुकार है।' },
      { title: 'एकता (Ekta)', desc: 'हम जाति, पंथ या धर्म से परे सभी प्राणियों में दिव्य को देखते हैं।' },
    ],
  },
};

export default function AboutPage({ lang }) {
  const c = content[lang];
  return (
    <div className="page-content">
      <section className="section scheme-2">
        <div className="container">
          <AnimatedSection>
            <div className="prose center" style={{ marginInline: 'auto' }}>
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1">{c.title}</h1>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section scheme-3">
        <div className="container">
          <AnimatedSection>
            <div className="prose" style={{ marginInline: 'auto', maxWidth: '48rem' }}>
              {c.body.split('\n\n').map((para, i) => (
                <p key={i} className="lead" style={{ marginBottom: '1.5rem' }}>{para}</p>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section scheme-1">
        <div className="container">
          <AnimatedSection>
            <div className="prose center" style={{ marginInline: 'auto' }}>
              <Eyebrow>{c.mission}</Eyebrow>
              <h2 className="h3" style={{ color: '#fff' }}>{c.missionText}</h2>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section scheme-3">
        <div className="container">
          <AnimatedSection>
            <div className="prose center" style={{ marginInline: 'auto', marginBottom: '48px' }}>
              <Eyebrow>{c.values}</Eyebrow>
            </div>
          </AnimatedSection>
          <div className="trio" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {c.valueItems.map((item, i) => (
              <motion.div
                key={item.title}
                className="trio-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <h3 className="h5">{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
