import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { Button, Icon } from '../components/ui';
import { useTranslation } from '../locales/useTranslation';
import './LoginPage.css';

export default function LoginPage() {
  const { session, toast, lang, setLang } = useApp();
  const t = useTranslation('LoginPage');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // MFA States
  const [step, setStep] = useState('login'); // 'login' or 'mfa'
  const [mfaCode, setMfaCode] = useState('');
  const [factorId, setFactorId] = useState('');
  const [verifyingMfa, setVerifyingMfa] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Verify assurance level to prevent race conditions and infinite loops
  useEffect(() => {
    if (!session) {
      setCheckingSession(false);
      return;
    }

    const verifyAssurance = async () => {
      try {
        const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (error) throw error;

        if (data.nextLevel === 'aal2' && data.currentLevel === 'aal1') {
          // MFA is enrolled but not verified yet. Stay on LoginPage and show MFA verification step
          const { data: factorsData } = await supabase.auth.mfa.listFactors();
          const totpFactors = factorsData?.totp || [];
          if (totpFactors.length > 0) {
            setFactorId(totpFactors[0].id);
            setStep('mfa');
          }
        } else {
          // No MFA enrolled or session is already aal2 (fully verified). Redirect to dashboard.
          navigate('/admin/blogs', { replace: true });
        }
      } catch (err) {
        console.error('Session verification error:', err);
      } finally {
        setCheckingSession(false);
      }
    };

    verifyAssurance();
  }, [session, navigate]);

  // Render a clean loading indicator while checking persistent session assurance level
  if (checkingSession && session) {
    return <div className="login-loader">{t.loadingSession}</div>;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      toast(error.message);
      return;
    }

    // Check if user has MFA enrolled
    try {
      const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      
      if (mfaError) throw mfaError;

      if (mfaData.nextLevel === 'aal2' && mfaData.currentLevel === 'aal1') {
        // MFA is enrolled but not completed
        const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) throw factorsError;

        const totpFactors = factorsData?.totp || [];
        if (totpFactors.length > 0) {
          setFactorId(totpFactors[0].id);
          setStep('mfa');
          setLoading(false);
        } else {
          // Fallback if factors list is empty
          setLoading(false);
          toast(t.loginSuccess);
          navigate('/admin/blogs');
        }
      } else {
        // No MFA enrolled, proceed to admin dashboard
        setLoading(false);
        toast(t.loginSuccess);
        navigate('/admin/blogs');
      }
    } catch (err) {
      setLoading(false);
      toast('Auth validation failed: ' + err.message);
    }
  };

  const handleMfaVerify = async (e) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.length !== 6) {
      toast(t.mfaEnterCode);
      return;
    }

    setVerifyingMfa(true);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: factorId,
        code: mfaCode,
      });

      if (error) throw error;

      toast(t.mfaSuccess);
      navigate('/admin/blogs');
    } catch (err) {
      toast(t.mfaInvalidCode);
    } finally {
      setVerifyingMfa(false);
    }
  };

  const handleCancel = async () => {
    await supabase.auth.signOut();
    setStep('login');
    setEmail('');
    setPassword('');
    setMfaCode('');
  };

  if (step === 'mfa') {
    return (
      <div className="scheme-1 login-wrapper">
        <div className="login-lang-toggle">
          <button 
            type="button"
            onClick={() => setLang && setLang('EN')} 
            className={`login-lang-btn ${lang === 'EN' ? 'active' : 'inactive'}`}
          >
            EN
          </button>
          <button 
            type="button"
            onClick={() => setLang && setLang('HI')} 
            className={`login-lang-btn ${lang === 'HI' ? 'active' : 'inactive'}`}
          >
            HI
          </button>
        </div>
        <div className="login-container">
          <div className="login-header">
            <Icon name="security" size={48} className="login-icon" />
            <h1 className="h4">{t.mfaTitle}</h1>
            <p className="muted2 login-subtitle">{t.mfaSubtitle}</p>
          </div>

          <form onSubmit={handleMfaVerify} className="login-form-card">
            <div className="login-field-group">
              <label className="login-label">{t.verificationCode}</label>
              <input 
                type="text" required maxLength={6} pattern="[0-9]{6}" inputMode="numeric"
                value={mfaCode} onChange={e => setMfaCode(e.target.value.replace(/\D/g, ''))}
                className="login-input totp-code"
                placeholder="000000"
              />
            </div>
            <Button type="submit" className="btn btn-default login-btn-full" disabled={verifyingMfa}>
              {verifyingMfa ? t.verifying : t.verifyCode}
            </Button>
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn btn-secondary login-btn-full login-btn-cancel"
            >
              {t.cancel}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="scheme-1 login-wrapper">
      <div className="login-lang-toggle">
        <button 
          type="button"
          onClick={() => setLang && setLang('EN')} 
          className={`login-lang-btn ${lang === 'EN' ? 'active' : 'inactive'}`}
        >
          EN
        </button>
        <button 
          type="button"
          onClick={() => setLang && setLang('HI')} 
          className={`login-lang-btn ${lang === 'HI' ? 'active' : 'inactive'}`}
        >
          HI
        </button>
      </div>
      <div className="login-container">
        <div className="login-header">
          <Icon name="admin_panel_settings" size={48} className="login-icon" />
          <h1 className="h4">{t.adminLoginTitle}</h1>
          <p className="muted2 login-subtitle">{t.adminLoginSubtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="login-form-card">
          <div className="login-field-group tight">
            <label className="login-label">{t.emailLabel}</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="login-input"
              placeholder="admin@example.com"
            />
          </div>
          <div className="login-field-group">
            <label className="login-label">{t.passwordLabel}</label>
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="login-input"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="btn btn-default login-btn-full" disabled={loading}>
            {loading ? t.signingIn : t.signIn}
          </Button>
        </form>

        <div className="login-footer">
          <a href="/" className="login-back-link">
            <Icon name="arrow_back" size={16} /> {t.backToSite}
          </a>
        </div>
      </div>
    </div>
  );
}
