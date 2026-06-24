import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Icon } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, toast, lang, setLang } = useApp();
  const t = useTranslation('AdminLayout');
  const navigate = useNavigate();

  // MFA Status States
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [factors, setFactors] = useState([]);
  const [loadingFactors, setLoadingFactors] = useState(true);

  // MFA Enrollment States
  const [showMfaSettings, setShowMfaSettings] = useState(false);
  const [enrollStep, setEnrollStep] = useState('idle'); // 'idle' or 'setup'
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [newFactorId, setNewFactorId] = useState('');
  const [setupCode, setSetupCode] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDisable, setConfirmDisable] = useState(false);

  const checkMfaStatus = async () => {
    setLoadingFactors(true);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      const totpFactors = data?.totp || [];
      const activeFactors = totpFactors.filter(f => f.status === 'verified');
      setFactors(totpFactors);
      setMfaEnabled(activeFactors.length > 0);
    } catch (err) {
      console.error('Error listing factors:', err);
    } finally {
      setLoadingFactors(false);
    }
  };

  useEffect(() => {
    checkMfaStatus();
  }, []);

  const handleEnrollInit = async () => {
    setActionLoading(true);
    try {
      // Retrieve the current factors list to check for any stale, unverified factors
      const { data: listData, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) throw listError;

      const totpFactors = listData?.totp || [];
      // Unenroll any existing unverified factors to avoid conflicts with friendly names
      for (const factor of totpFactors) {
        if (factor.status === 'unverified') {
          const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
          if (unenrollError) {
            console.error(`Failed to unenroll stale factor ${factor.id}:`, unenrollError);
          }
        }
      }

      // Generate a short 4-character random suffix to ensure a unique friendly name
      const uniqueSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const baseName = user?.email || 'admin';
      const uniqueFriendlyName = `${baseName} (${uniqueSuffix})`;

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'KAOT Admin',
        friendlyName: uniqueFriendlyName
      });
      if (error) throw error;
      
      setNewFactorId(data.id);
      setQrCodeUrl(data.totp.qr_code);
      setSecretKey(data.totp.secret);
      setEnrollStep('setup');
    } catch (err) {
      toast('Enrollment initialization failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnrollVerify = async (e) => {
    e.preventDefault();
    if (!setupCode || setupCode.length !== 6) {
      toast(t.mfaEnterCodeAlert);
      return;
    }
    setActionLoading(true);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: newFactorId,
        code: setupCode
      });
      if (error) throw error;

      toast(t.mfaEnableSuccess);
      setEnrollStep('idle');
      setSetupCode('');
      checkMfaStatus();
    } catch (err) {
      toast('Verification failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnenroll = async (factorId) => {
    setActionLoading(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: factorId
      });
      if (error) throw error;

      toast(t.mfaDisableSuccess);
      checkMfaStatus();
    } catch (err) {
      toast('Error disabling MFA: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast(t.logoutError);
    } else {
      toast(t.logoutSuccess);
      navigate('/login');
    }
  };

  const renderMfaSettings = () => {
    return (
      <div className="card-container admin-mfa-card scheme-3">
        <div className="admin-mfa-header">
          <h2 className="h4 admin-mfa-title">
            <Icon name="security" size={55} className="admin-mfa-title-icon" />
            {t.mfaTitle}
          </h2>
          <button 
            type="button" 
            onClick={() => setShowMfaSettings(false)}
            className="admin-mfa-close-btn"
            title="Close Settings"
          >
            <Icon name="close" size={24} />
          </button>
        </div>
        <p className="muted2 admin-mfa-subtitle">
          {t.mfaDesc}
        </p>

        {loadingFactors ? (
          <p className="muted2">{t.mfaLoading}</p>
        ) : enrollStep === 'setup' ? (
          <div>
            <h3 className="h6 admin-mfa-setup-title">{t.mfaScanTitle}</h3>
            <p className="muted2 admin-mfa-instruction">
              {t.mfaScanInstructions}
            </p>
            
            <div className="admin-mfa-qr-wrapper">
              {qrCodeUrl && <img src={qrCodeUrl} alt="MFA QR Code" className="admin-mfa-qr-img" />}
              <div className="admin-mfa-qr-manual">
                <span className="admin-mfa-qr-label">{t.mfaManualKey}</span>
                <code className="admin-mfa-secret-code">{secretKey}</code>
              </div>
            </div>

            <form onSubmit={handleEnrollVerify}>
              <div className="admin-mfa-form-field">
                <label className="admin-mfa-form-label">{t.mfaVerificationLabel}</label>
                <input 
                  type="text" required maxLength={6} pattern="[0-9]{6}" inputMode="numeric"
                  value={setupCode} onChange={e => setSetupCode(e.target.value.replace(/\D/g, ''))}
                  className="admin-mfa-input"
                  placeholder="000000"
                />
              </div>
              <div className="admin-mfa-btn-group">
                <button type="submit" className="btn btn-default admin-mfa-btn-flex" disabled={actionLoading}>
                  {actionLoading ? t.mfaActivating : t.mfaVerifyEnableBtn}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setEnrollStep('idle')} disabled={actionLoading}>
                  {t.mfaCancel}
                </button>
              </div>
            </form>
          </div>
        ) : mfaEnabled ? (
          <div>
            <div className="admin-mfa-status-box active">
              <Icon name="check_circle" size={28} className="admin-mfa-status-icon" />
              <div>
                <strong className="admin-mfa-status-title">{t.mfaStatusActive}</strong>
                <span className="admin-mfa-status-desc">
                  {t.mfaStatusActiveDesc}
                </span>
              </div>
            </div>
            
            {confirmDisable ? (
              <div className="admin-mfa-confirm-box">
                <h4 className="h6 admin-mfa-confirm-title">
                  <Icon name="warning" size={20} className="admin-mfa-status-icon" />
                  {t.mfaConfirmDisableTitle}
                </h4>
                <p className="muted2 admin-mfa-confirm-desc">
                  {t.mfaConfirmDisableDesc}
                </p>
                <div className="admin-mfa-btn-group">
                  <button 
                    type="button" 
                    className="btn btn-default admin-mfa-btn-flex" 
                    onClick={() => {
                      handleUnenroll(factors.find(f => f.status === 'verified')?.id);
                      setConfirmDisable(false);
                    }}
                    disabled={actionLoading}
                  >
                    {t.mfaConfirmYesBtn}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary admin-mfa-btn-flex" 
                    onClick={() => setConfirmDisable(false)}
                    disabled={actionLoading}
                  >
                    {t.mfaCancel}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                type="button" 
                className="btn btn-secondary admin-mfa-disable-btn" 
                onClick={() => setConfirmDisable(true)}
                disabled={actionLoading}
              >
                {t.mfaDisableBtn}
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="admin-mfa-status-box inactive">
              <Icon name="warning" size={28} className="admin-mfa-status-icon inactive" />
              <div>
                <strong className="admin-mfa-status-title inactive">{t.mfaStatusInactive}</strong>
                <span className="admin-mfa-status-desc">
                  {t.mfaStatusInactiveDesc}
                </span>
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-default" 
              onClick={handleEnrollInit}
              disabled={actionLoading}
            >
              {actionLoading ? t.mfaInitializing : t.mfaEnableBtn}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-layout scheme-1">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Icon name="admin_panel_settings" size={32} className="admin-sidebar-header-icon" />
          <div className="admin-title">
            <span className="admin-title-bold">{t.title}</span> {t.adminLabel}
          </div>
        </div>
        
        <nav className="admin-nav">
          <NavLink 
            to="/admin/blogs" 
            className={({isActive}) => `admin-nav-item ${isActive && !showMfaSettings ? 'active' : ''}`}
            onClick={() => setShowMfaSettings(false)}
          >
            <Icon name="article" size={20} />
            <span>{t.navBlogs}</span>
          </NavLink>

          <button 
            type="button"
            className={`admin-nav-item ${showMfaSettings ? 'active' : ''}`}
            onClick={() => {
              setShowMfaSettings(true);
              setEnrollStep('idle');
            }}
          >
            <Icon name="security" size={20} />
            <span>{t.navMfa}</span>
          </button>

          {/* Future Modules */}
          <div className="admin-nav-item disabled" title="Coming soon">
            <Icon name="people" size={20} />
            <span>{t.navUsersSoon}</span>
          </div>
          <div className="admin-nav-item disabled" title="Coming soon">
            <Icon name="library_books" size={20} />
            <span>{t.navLibrarySoon}</span>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <Icon name="account_circle" size={20} />
            <span className="admin-user-email">
              {user?.email}
            </span>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <Icon name="logout" size={18} />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-right">
            <a href="/" target="_blank" rel="noreferrer" className="admin-view-site">
              <Icon name="open_in_new" size={18} />
              {t.viewLiveSite}
            </a>
            <div className="admin-lang-toggle">
              <button 
                type="button"
                onClick={() => setLang && setLang('EN')} 
                className={`admin-lang-btn ${lang === 'EN' ? 'active' : 'inactive'}`}
              >
                EN
              </button>
              <button 
                type="button"
                onClick={() => setLang && setLang('HI')} 
                className={`admin-lang-btn ${lang === 'HI' ? 'active' : 'inactive'}`}
              >
                HI
              </button>
            </div>
          </div>
        </div>
        <div className="admin-content">
          {showMfaSettings ? renderMfaSettings() : <Outlet />}
        </div>
      </main>
    </div>
  );
}
