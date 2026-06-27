import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { Button, Icon } from '../components/ui';
import { useTranslation } from '../locales/useTranslation';
import './ForgotPasswordPage.css';

export default function ForgotPasswordPage() {
  const { toast, lang, setLang } = useApp();
  const t = useTranslation('ForgotPasswordPage');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        toast(error.message, 'error');
      } else {
        setSubmitted(true);
        toast(t.successTitle, 'success');
      }
    } catch (err) {
      toast(t.errorSending, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scheme-2 forgot-wrapper">
      <div className="forgot-lang-toggle">
        <button 
          type="button" 
          onClick={() => setLang('EN')} 
          className={`forgot-lang-btn ${lang === 'EN' ? 'active' : 'inactive'}`}
        >
          EN
        </button>
        <button 
          type="button" 
          onClick={() => setLang('HI')} 
          className={`forgot-lang-btn ${lang === 'HI' ? 'active' : 'inactive'}`}
        >
          HI
        </button>
      </div>

      <div className="forgot-container">
        <div className="forgot-header">
          <Icon name="lock_reset" size={48} className="forgot-icon" />
          <h1 className="h4">{t.title}</h1>
          {!submitted && <p className="muted2 forgot-subtitle">{t.subtitle}</p>}
        </div>

        {submitted ? (
          <div className="forgot-success-card">
            <Icon name="mark_email_read" size={48} className="forgot-success-icon" />
            <h2 className="h5 forgot-success-title">{t.successTitle}</h2>
            <p className="muted2 forgot-success-desc">{t.successDesc}</p>
            <Button 
              type="button" 
              className="btn btn-secondary forgot-btn-full"
              onClick={() => navigate('/login')}
            >
              {t.backToLogin}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="forgot-form-card">
            <div className="forgot-field-group">
              <label className="forgot-label">{t.emailLabel}</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="forgot-input"
                placeholder="admin@example.com"
              />
            </div>
            <Button type="submit" className="btn btn-default forgot-btn-full" disabled={loading}>
              {loading ? t.sending : t.sendLink}
            </Button>
            <div className="forgot-footer">
              <button 
                type="button" 
                className="forgot-back-link"
                onClick={() => navigate('/login')}
              >
                <Icon name="arrow_back" size={16} />
                {t.backToLogin}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
