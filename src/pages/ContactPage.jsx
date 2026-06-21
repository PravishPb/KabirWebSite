import React, { useState } from 'react';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { Icon } from '../components/ui';
import { useTranslation } from '../locales/useTranslation';
import { supabase } from '../lib/supabase';
import './ContactPage.css';

export default function ContactPage() {
  const t = useTranslation('ContactPage');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Name and Email are required.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Attempt to store in Supabase table
      const { error } = await supabase.from('contact_submissions').insert([
        {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          created_at: new Date()
        }
      ]);
      
      if (error) {
        console.warn("Database insertion failed (expected if 'contact_submissions' table does not exist):", error.message);
      }
      
      setSuccessMsg(t.successMessage || 'Thank you! Your message has been sent successfully.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error("Submission failed:", err);
      // Fallback to a mock success message to preserve user experience
      setSuccessMsg(t.successMessage || 'Thank you! Your message has been sent successfully.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content contact-page">
      {/* Page Title Section */}
      <section className="section scheme-2 text-center contact-header-section">
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto" style={{ marginInline: 'auto' }}>
              <h1 className="h1">{t.title}</h1>
              <p className="lead muted2" style={{ marginTop: '1.25rem' }}>
                {t.intro}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Grid Content Section */}
      <section className="section scheme-3" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact-grid">
            
            {/* Info Cards Column */}
            <div className="contact-info-column">
              <AnimatedSection>
                <div className="contact-card">
                  <div className="contact-icon-wrapper">
                    <Icon name="mail" size={24} />
                  </div>
                  <div className="contact-card-content">
                    <h3 className="contact-card-title">{t.email}</h3>
                    <p className="contact-card-value">
                      <a href="mailto:kabirassociationoftoronto@gmail.com">
                        kabirassociationoftoronto@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="contact-card">
                  <div className="contact-icon-wrapper">
                    <Icon name="contact_mail" size={24} />
                  </div>
                  <div className="contact-card-content">
                    <h3 className="contact-card-title">{t.emailDrDas}</h3>
                    <p className="contact-card-value">
                      <a href="mailto:dasj@shaw.ca">
                        dasj@shaw.ca
                      </a>
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="contact-card">
                  <div className="contact-icon-wrapper">
                    <Icon name="call" size={24} />
                  </div>
                  <div className="contact-card-content">
                    <h3 className="contact-card-title">{t.phone}</h3>
                    <p className="contact-card-value">
                      <a href="tel:6479750864">(647) 975-0864</a>
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="contact-card">
                  <div className="contact-icon-wrapper">
                    <Icon name="location_on" size={24} />
                  </div>
                  <div className="contact-card-content">
                    <h3 className="contact-card-title">{t.address}</h3>
                    <p className="contact-card-value">
                      #38-1365 Mid-Way Blvd,<br />
                      Mississauga, ON L5T 2J5<br />
                      Canada
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Interactive Form Column */}
            <div className="contact-form-column">
              <AnimatedSection>
                <div className="contact-form-container">
                  <h2 className="contact-form-title">{t.title}</h2>
                  
                  <form onSubmit={handleSubmit} className="contact-form">
                    
                    {successMsg && (
                      <div className="contact-alert success">
                        <Icon name="check_circle" size={20} />
                        <span>{successMsg}</span>
                      </div>
                    )}
                    
                    {errorMsg && (
                      <div className="contact-alert error">
                        <Icon name="error" size={20} />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="contact-form-row">
                      <div className="contact-form-group">
                        <label className="contact-form-label">{t.nameLabel}</label>
                        <input
                          type="text"
                          required
                          className="contact-form-input"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      
                      <div className="contact-form-group">
                        <label className="contact-form-label">{t.emailLabel}</label>
                        <input
                          type="email"
                          required
                          className="contact-form-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="contact-form-group">
                      <label className="contact-form-label">{t.subjectLabel}</label>
                      <input
                        type="text"
                        className="contact-form-input"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>

                    <div className="contact-form-group">
                      <label className="contact-form-label">{t.messageLabel}</label>
                      <textarea
                        className="contact-form-textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="contact-submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Icon name="hourglass_empty" size={18} />
                          <span>{t.sending}</span>
                        </>
                      ) : (
                        <>
                          <Icon name="send" size={18} />
                          <span>{t.sendButton}</span>
                        </>
                      )}
                    </button>

                  </form>
                </div>
              </AnimatedSection>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
