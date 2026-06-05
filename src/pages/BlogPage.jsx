import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Eyebrow, ChevronLink, Button, Icon } from '../components/ui';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';

function PlaceholderImg({ className = '', style = {}, alt = '', gradient = 'linear-gradient(135deg, #1b1e1c 0%, #563401 50%, #d98204 100%)' }) {
  return <div className={className} style={{ ...style, background: gradient, width: '100%' }} role="img" aria-label={alt} />;
}

const initialPosts = {
  EN: [
    { id: 1, cat: 'Teaching', read: '3 min read', title: 'The practice of turning inward', excerpt: 'How silence becomes the truest teacher in our daily lives. In a world of noise and distraction, Kabir calls us to stillness — not as escape, but as arrival.' },
    { id: 2, cat: 'Devotion', read: '4 min read', title: "Kabir's voice across the centuries", excerpt: 'Understanding the saint-poet\'s message for modern seekers. His words, woven five hundred years ago, speak to the anxieties and longings of our time.' },
    { id: 3, cat: 'Community', read: '5 min read', title: 'What satsang truly means', excerpt: 'The alchemy of gathering with those who seek truth. When seekers sit together, something shifts — the air changes, the heart opens.' },
    { id: 4, cat: 'Practice', read: '6 min read', title: 'Sumiran: the thread of remembrance', excerpt: 'The ancient practice of continuous divine remembrance, and how it transforms the texture of ordinary life into something luminous.' },
    { id: 5, cat: 'Heritage', read: '4 min read', title: 'The weaver saint of Varanasi', excerpt: 'A journey through the life and times of Kabir — from the looms of Kashi to the hearts of millions across the world.' },
    { id: 6, cat: 'Reflection', read: '3 min read', title: 'Finding stillness in Toronto', excerpt: 'How a small community in Canada keeps alive a tradition that began on the banks of the Ganges, five centuries ago.' },
  ],
  HI: [
    { id: 1, cat: 'शिक्षा', read: '3 मिनट', title: 'अंतर्मुखी होने का अभ्यास', excerpt: 'कैसे मौन हमारे दैनिक जीवन में सबसे सच्चा शिक्षक बन जाता है। शोर और विकर्षण की दुनिया में, कबीर हमें शांति की ओर बुलाते हैं।' },
    { id: 2, cat: 'भक्ति', read: '4 मिनट', title: 'सदियों से कबीर की आवाज़', excerpt: 'आधुनिक साधकों के लिए संत-कवि के संदेश को समझना। पांच सौ साल पहले बुने उनके शब्द हमारे समय की चिंताओं से बात करते हैं।' },
    { id: 3, cat: 'समुदाय', read: '5 मिनट', title: 'सत्संग का सच्चा अर्थ', excerpt: 'सत्य की खोज करने वालों के साथ एकत्र होने का रसायन। जब साधक साथ बैठते हैं, कुछ बदलता है — हवा बदलती है, हृदय खुलता है।' },
    { id: 4, cat: 'अभ्यास', read: '6 मिनट', title: 'सुमिरन: स्मरण का धागा', excerpt: 'निरंतर दिव्य स्मरण का प्राचीन अभ्यास, और कैसे यह सामान्य जीवन को कुछ प्रकाशमय में बदल देता है।' },
    { id: 5, cat: 'विरासत', read: '4 मिनट', title: 'वाराणसी के जुलाहे संत', excerpt: 'कबीर के जीवन और काल की यात्रा — काशी के करघों से लेकर दुनिया भर के लाखों लोगों के दिलों तक।' },
    { id: 6, cat: 'चिंतन', read: '3 मिनट', title: 'टोरंटो में शांति की खोज', excerpt: 'कनाडा में एक छोटा समुदाय कैसे एक परंपरा को जीवित रखता है जो पांच सदी पहले गंगा के तट पर शुरू हुई थी।' },
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

const TEXT = {
  EN: {
    eyebrow: 'Writings',
    h1: 'Sermons and reflections',
    lead: 'Words that illuminate the path',
    addBlog: 'Add New Blog',
    readMore: 'Read more',
    edit: 'Edit Blog',
    save: 'Save Changes',
    add: 'Create Blog',
    cancel: 'Cancel',
    form: {
      title: 'Title',
      cat: 'Category',
      read: 'Read Time',
      excerpt: 'Excerpt (Short Description)'
    },
    deleteTitle: 'Delete Blog',
    deleteConfirm: 'Are you sure you want to delete this blog? This action cannot be undone.',
    deleteBtn: 'Delete'
  },
  HI: {
    eyebrow: 'लेख',
    h1: 'उपदेश और चिंतन',
    lead: 'शब्द जो मार्ग को प्रकाशित करते हैं',
    addBlog: 'नया ब्लॉग जोड़ें',
    readMore: 'और पढ़ें',
    edit: 'ब्लॉग संपादित करें',
    save: 'परिवर्तन सहेजें',
    add: 'ब्लॉग बनाएं',
    cancel: 'रद्द करें',
    form: {
      title: 'शीर्षक',
      cat: 'श्रेणी',
      read: 'पढ़ने का समय',
      excerpt: 'अंश (संक्षिप्त विवरण)'
    },
    deleteTitle: 'ब्लॉग हटाएं',
    deleteConfirm: 'क्या आप वाकई इस ब्लॉग को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
    deleteBtn: 'हटाएं'
  }
};

export default function BlogPage({ lang, toast }) {
  const t = TEXT[lang] || TEXT.EN;
  
  const [blogState, setBlogState] = useState(initialPosts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formData, setFormData] = useState({ title: '', cat: '', read: '', excerpt: '' });

  const currentPosts = blogState[lang] || [];

  const handleOpenModal = (post = null) => {
    if (post) {
      setEditingId(post.id);
      setFormData({ title: post.title, cat: post.cat, read: post.read, excerpt: post.excerpt });
    } else {
      setEditingId(null);
      setFormData({ title: '', cat: '', read: '', excerpt: '' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', cat: '', read: '', excerpt: '' });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setBlogState(prev => {
      const posts = [...prev[lang]];
      if (editingId) {
        // Edit existing
        const idx = posts.findIndex(p => p.id === editingId);
        if (idx !== -1) {
          posts[idx] = { ...posts[idx], ...formData };
        }
      } else {
        // Add new
        posts.unshift({
          id: Date.now(),
          ...formData
        });
      }
      return { ...prev, [lang]: posts };
    });

    toast && toast(editingId ? 'Blog updated' : 'New blog added');
    closeModal();
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setBlogState(prev => {
        const posts = prev[lang].filter(p => p.id !== deleteConfirmId);
        return { ...prev, [lang]: posts };
      });
      toast && toast('Blog deleted');
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="page-content" style={{ position: 'relative' }}>
      <section className="section scheme-2">
        <div className="container">
          <AnimatedSection>
            <div className="prose center" style={{ marginInline: 'auto' }}>
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h1 className="h1">{t.h1}</h1>
              <p className="lead" style={{ marginTop: '20px' }}>
                {t.lead}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section scheme-3">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <Button className="btn btn-default" onClick={() => handleOpenModal()}>
              <Icon name="add" /> {t.addBlog}
            </Button>
          </div>

          <motion.div className="blog-grid" layout>
            <AnimatePresence mode="popLayout">
              {currentPosts.map((post, i) => (
                <motion.div 
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <article 
                    className="blog-card" 
                    onClick={() => toast && toast(post.title)}
                    style={{ position: 'relative', height: '100%' }}
                  >
                    {/* Action overlay */}
                    <div 
                      className="blog-actions" 
                      style={{ 
                        position: 'absolute', 
                        top: '1rem', 
                        right: '1rem', 
                        display: 'flex', 
                        gap: '0.5rem',
                        zIndex: 10,
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(post); }}
                        style={{
                          background: 'var(--color-bg, #fff)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          color: 'var(--color-text, #1b1e1c)'
                        }}
                        title="Edit"
                      >
                        <Icon name="edit" size={18} />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClick(e, post.id)}
                        style={{
                          background: '#dc3545',
                          border: 'none',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          color: '#fff'
                        }}
                        title="Delete"
                      >
                        <Icon name="delete" size={18} />
                      </button>
                    </div>

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
                    <ChevronLink>{t.readMore}</ChevronLink>
                  </article>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Modal Overlay */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1rem'
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{
                background: 'var(--color-bg, #fff)',
                color: 'var(--color-text, #1b1e1c)',
                padding: '2rem',
                borderRadius: 'var(--radius-card, 1rem)',
                width: '100%',
                maxWidth: '500px',
                boxShadow: 'var(--shadow-md, 0 8px 30px rgba(0,0,0,0.2))',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 600 }}>
                {editingId ? t.edit : t.add}
              </h2>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>{t.form.title}</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>{t.form.cat}</label>
                    <input 
                      type="text" 
                      value={formData.cat} 
                      onChange={e => setFormData({...formData, cat: e.target.value})}
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>{t.form.read}</label>
                    <input 
                      type="text" 
                      value={formData.read} 
                      onChange={e => setFormData({...formData, read: e.target.value})}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>{t.form.excerpt}</label>
                  <textarea 
                    value={formData.excerpt} 
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <Button type="button" className="btn btn-secondary" onClick={closeModal}>
                    {t.cancel}
                  </Button>
                  <Button type="submit" className="btn btn-default">
                    {editingId ? t.save : t.add}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal Overlay */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1rem'
            }}
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{
                background: 'var(--color-bg, #fff)',
                color: 'var(--color-text, #1b1e1c)',
                padding: '2rem',
                borderRadius: 'var(--radius-card, 1rem)',
                width: '100%',
                maxWidth: '400px',
                boxShadow: 'var(--shadow-md, 0 8px 30px rgba(0,0,0,0.2))',
                textAlign: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'rgba(220, 53, 69, 0.1)', 
                color: '#dc3545',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <Icon name="delete" size={32} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 600 }}>
                {t.deleteTitle}
              </h2>
              <p style={{ opacity: 0.7, marginBottom: '2rem', lineHeight: 1.6 }}>
                {t.deleteConfirm}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Button type="button" className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                  {t.cancel}
                </Button>
                <Button 
                  type="button" 
                  className="btn" 
                  onClick={confirmDelete}
                  style={{ background: '#dc3545', color: '#fff', border: 'none' }}
                >
                  {t.deleteBtn}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .blog-card:hover .blog-actions {
          opacity: 1 !important;
        }
        @media (max-width: 768px) {
          .blog-actions {
            opacity: 1 !important; /* Always show actions on mobile */
          }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  border: '1px solid rgba(0,0,0,0.1)',
  fontFamily: 'inherit',
  fontSize: '1rem',
  background: 'rgba(0,0,0,0.02)',
  color: 'inherit',
};
