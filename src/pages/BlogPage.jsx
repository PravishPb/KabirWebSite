import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import he from 'he';
import { Badge, Eyebrow, ChevronLink, Button, Icon, AsyncImage, PlaceholderImg } from '../components/ui';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../locales/useTranslation';
import { useBlogs } from '../hooks/useBlogs';
import './BlogPage.css';

const gradients = [
  'linear-gradient(135deg, #2c5f3a 0%, #112617 100%)',
  'linear-gradient(135deg, #563401 0%, #d98204 100%)',
  'linear-gradient(135deg, #1b1e1c 0%, #4d504e 100%)',
  'linear-gradient(135deg, #412701 0%, #ad6803 100%)',
  'linear-gradient(135deg, #234c2e 0%, #6b8f75 100%)',
  'linear-gradient(135deg, #2a3138 0%, #6a7b8c 100%)',
];

export default function BlogPage() {
  const { lang, toast } = useApp();
  const t = useTranslation('BlogPage');
  
  const { blogs: livePosts, loading, addBlog, updateBlog, deleteBlog } = useBlogs();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formData, setFormData] = useState({ title: '', cat: '', read: '', excerpt: '' });

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const filter = searchParams.get('filter') || 'All';

  const setFilter = (f) => {
    navigate(`/blog${f === 'All' ? '' : `?filter=${encodeURIComponent(f)}`}`);
  };

  const currentPosts = livePosts.map(p => ({
    id: p.id,
    cat: p.category || 'KAOT',
    read: '5 min read',
    title: p.title ? he.decode(p.title) : '',
    excerpt: p.excerpt ? he.decode(p.excerpt) : 'Read more...',
    image_url: p.image_url
  }));

  const filteredPosts = filter === 'All' ? currentPosts : currentPosts.filter(p => p.cat === filter);

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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingId) {
      const { error } = await updateBlog(editingId, {
        title: formData.title,
        excerpt: formData.excerpt
      });
      if (!error) toast && toast('Blog updated in cloud');
    } else {
      const { error } = await addBlog({
        title: formData.title,
        excerpt: formData.excerpt,
        content: '<p>New blog content</p>',
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
      if (!error) toast && toast('New blog added to cloud');
    }

    closeModal();
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      const { error } = await deleteBlog(deleteConfirmId);
      if (!error) toast && toast('Blog deleted from cloud');
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
              {filteredPosts.map((post, i) => (
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
                    <div className="blog-actions">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(post); }}
                        className="blog-action-btn"
                        title="Edit"
                      >
                        <Icon name="edit" size={18} />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClick(e, post.id)}
                        className="blog-action-btn blog-action-btn-danger"
                        title="Delete"
                      >
                        <Icon name="delete" size={18} />
                      </button>
                    </div>

                    {post.image_url ? (
                      <AsyncImage
                        src={post.image_url}
                        alt={post.title}
                        className="rounded-img blog-img"
                        style={{ height: '200px', width: '100%' }}
                        fallbackGradient={gradients[i % gradients.length]}
                      />
                    ) : (
                      <PlaceholderImg
                        className="rounded-img blog-img"
                        gradient={gradients[i % gradients.length]}
                        alt={post.title}
                        style={{ height: '200px' }}
                      />
                    )}
                    <div className="blog-meta">
                      <Badge>{post.cat}</Badge>
                      <span className="blog-read">{post.read}</span>
                    </div>
                    <h3 className="h5">{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <ChevronLink>{t.readMore || 'Read more'}</ChevronLink>
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
            className="blog-modal-overlay"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="blog-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="blog-modal-title">
                {editingId ? t.edit : t.add}
              </h2>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="blog-form-group">
                  <label className="blog-form-label">{t.form?.title}</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="blog-form-input"
                    required
                  />
                </div>
                <div className="blog-form-grid">
                  <div>
                    <label className="blog-form-label">{t.form?.cat}</label>
                    <input 
                      type="text" 
                      value={formData.cat} 
                      onChange={e => setFormData({...formData, cat: e.target.value})}
                      className="blog-form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="blog-form-label">{t.form?.read}</label>
                    <input 
                      type="text" 
                      value={formData.read} 
                      onChange={e => setFormData({...formData, read: e.target.value})}
                      className="blog-form-input"
                      required
                    />
                  </div>
                </div>
                <div className="blog-form-group">
                  <label className="blog-form-label">{t.form?.excerpt}</label>
                  <textarea 
                    value={formData.excerpt} 
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    className="blog-form-input blog-form-textarea"
                    required
                  />
                </div>
                <div className="blog-modal-actions">
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
            className="blog-modal-overlay"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="blog-modal-content blog-modal-content-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="delete-icon-wrapper">
                <Icon name="delete" size={32} />
              </div>
              <h2 className="blog-modal-title blog-modal-title-sm">
                {t.deleteTitle}
              </h2>
              <p className="delete-confirm-text">
                {t.deleteConfirm}
              </p>
              <div className="blog-modal-actions blog-modal-actions-center">
                <Button type="button" className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                  {t.cancel}
                </Button>
                <Button 
                  type="button" 
                  className="btn blog-action-btn-danger" 
                  onClick={confirmDelete}
                  style={{ borderRadius: '0.75rem' }}
                >
                  {t.deleteBtn}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
