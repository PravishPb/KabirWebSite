import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { Button, Icon } from '../components/ui';
import { useTranslation } from '../locales/useTranslation';
import './ResetPasswordPage.css';

export default function ResetPasswordPage() {
  const { toast, lang, setLang } = useApp();
  const t = useTranslation('ResetPasswordPage');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [checking, setChecking] = useState(true);

  // MFA check during password reset
  const [requireMfa, setRequireMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [factorId, setFactorId] = useState('');
  const [verifyingMfa, setVerifyingMfa] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const initSession = async (session) => {
      if (!mounted) return;
      if (session) {
        setHasSession(true);
        // Check if MFA is required
        try {
          const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
          if (!mfaError && mfaData.nextLevel === 'aal2' && mfaData.currentLevel === 'aal1') {
            const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
            if (!factorsError) {
              const totpFactors = factorsData?.totp || [];
              if (totpFactors.length > 0) {
                setFactorId(totpFactors[0].id);
                setRequireMfa(true);
              }
            }
          }
        } catch (err) {
          console.error('Error checking MFA status on reset:', err);
        }
      }
      setChecking(false);
    };

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        initSession(session);
      } else {
        setTimeout(() => {
          if (mounted && !hasSession) {
            setChecking(false);
          }
        }, 1500);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted && session) {
        initSession(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [hasSession]);

  const handleMfaVerify = async (e) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.length !== 6) {
      toast(t.mfaEnterCodeAlert || 'Please enter a 6-digit code', 'error');
      return;
    }

    setVerifyingMfa(true);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: factorId,
        code: mfaCode,
      });

      if (error) throw error;

      toast(t.mfaSuccessAlert || 'MFA verification successful', 'success');
      setRequireMfa(false);
    } catch (err) {
      toast(t.mfaInvalidCodeAlert || 'Invalid verification code. Please try again.', 'error');
    } finally {
      setVerifyingMfa(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password.length < 6) {
      toast(t.passwordMinLength, 'error');
      return;
    }

    if (password !== confirmPassword) {
      toast(t.passwordMismatch, 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast(error.message, 'error');
      } else {
        toast(t.successMessage, 'success');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      toast(t.errorUpdating, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="scheme-2 reset-loader">
        <Icon name="progress_activity" size={32} className="reset-spinner" />
      </div>
    );
  }

  return (
    <div className="scheme-2 reset-wrapper">
      <div className="reset-lang-toggle">
        <button 
          type="button" 
          onClick={() => setLang('EN')} 
          className={`reset-lang-btn ${lang === 'EN' ? 'active' : 'inactive'}`}
        >
          EN
        </button>
        <button 
          type="button" 
          onClick={() => setLang('HI')} 
          className={`reset-lang-btn ${lang === 'HI' ? 'active' : 'inactive'}`}
        >
          HI
        </button>
      </div>

      <div className="reset-container">
        <div className="reset-header">
          <Icon name="lock_open" size={48} className="reset-icon" />
          <h1 className="h4">{t.title}</h1>
          <p className="muted2 reset-subtitle">{t.subtitle}</p>
        </div>

        {!hasSession ? (
          <div className="reset-error-card">
            <Icon name="warning" size={48} className="reset-error-icon" />
            <h2 className="h5 reset-error-title">{t.errorUpdating}</h2>
            <p className="muted2 reset-error-desc">{t.invalidLinkDesc}</p>
            <Button 
              type="button" 
              className="btn btn-secondary reset-btn-full"
              onClick={() => navigate('/forgot-password')}
            >
              {t.requestNewLinkBtn}
            </Button>
          </div>
        ) : requireMfa ? (
          <form onSubmit={handleMfaVerify} className="reset-form-card">
            <div className="reset-field-group">
              <label className="reset-label">{t.mfaVerificationRequired}</label>
              <p className="muted2 reset-subtitle" style={{ marginBottom: '20px', fontSize: '0.875rem' }}>
                {t.mfaSubtitle}
              </p>
              <input
                type="text"
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
                required
                value={mfaCode}
                onChange={e => setMfaCode(e.target.value.replace(/\D/g, ''))}
                className="reset-input"
                placeholder="000000"
                style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.25rem' }}
              />
            </div>
            <Button type="submit" className="btn btn-default reset-btn-full" disabled={verifyingMfa}>
              {verifyingMfa ? t.mfaVerifying : t.mfaVerifyBtn}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="reset-form-card">
            <div className="reset-field-group">
              <label className="reset-label">{t.passwordLabel}</label>
              <div className="reset-password-wrapper">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="reset-input reset-password-input"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="reset-password-toggle"
                  onClick={() => setShowPassword(p => !p)}
                  title={showPassword ? 'Hide' : 'Show'}
                >
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={20} />
                </button>
              </div>
            </div>

            <div className="reset-field-group">
              <label className="reset-label">{t.confirmPasswordLabel}</label>
              <div className="reset-password-wrapper">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  required 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="reset-input reset-password-input"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="reset-password-toggle"
                  onClick={() => setShowConfirmPassword(p => !p)}
                  title={showConfirmPassword ? 'Hide' : 'Show'}
                >
                  <Icon name={showConfirmPassword ? 'visibility_off' : 'visibility'} size={20} />
                </button>
              </div>
            </div>

            <Button type="submit" className="btn btn-default reset-btn-full" disabled={loading}>
              {loading ? t.updating : t.updatePassword}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
