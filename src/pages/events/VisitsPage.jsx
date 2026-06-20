import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../../components/ui/AnimatedSection';
import { Eyebrow } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import './VisitsPage.css';

export default function VisitsPage() {
  const c = useTranslation('VisitsPage');

  const renderDrDasP3 = (text) => {
    if (!text) return '';
    const targetEn = "Kabir Center";
    const targetHi = "कबीर सेंटर";
    
    if (text.includes(targetEn)) {
      const parts = text.split(targetEn);
      return (
        <>
          {parts[0]}
          <Link to="/contact"><strong><em><u>{targetEn}</u></em></strong></Link>
          {parts[1]}
        </>
      );
    } else if (text.includes(targetHi)) {
      const parts = text.split(targetHi);
      return (
        <>
          {parts[0]}
          <Link to="/contact"><strong><em><u>{targetHi}</u></em></strong></Link>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  return (
    <div className="page-content visits-page">
      {/* Intro Section */}
      <section className="section scheme-2 text-center visits-intro-section">
        <div className="container">
          <AnimatedSection>
            <div className="visits-intro-text">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1" style={{ marginBottom: '1.5rem' }}>{c.title}</h1>
              <p className="lead muted2" style={{ marginBottom: 0 }}>{c.intro}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Row 1: Dr. Jagessar Das (Image Left / Content Right) */}
      <section className="section scheme-3 visits-row-section">
        <div className="container">
          <div className="visits-row">
            <AnimatedSection className="visits-image-col">
              <div className="visits-image-container">
                <img
                  src="/images/visits/drdas_visit.png"
                  alt={c.drJDas?.name}
                  className="visits-img"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection className="visits-content-col">
              <h2 className="h3 visits-title">{c.drJDas?.name}</h2>
              <div className="visits-desc">
                <p>{c.drJDas?.p1}</p>
                <p>
                  {c.drJDas?.p2_1}
                  <Link to="/library/dr-j-das"><strong><em><u>{c.drJDas?.viewWorks}</u></em></strong></Link>
                  {c.drJDas?.p2_2}
                </p>
                <p>{renderDrDasP3(c.drJDas?.p3)}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Row 2: Hazur Saheb (Content Left / Image Right) - REVERSED */}
      <section className="section scheme-4 visits-row-section">
        <div className="container">
          <div className="visits-row reverse">
            <AnimatedSection className="visits-image-col">
              <div className="visits-image-container">
                <img
                  src="/images/visits/hazur_visit.jpg"
                  alt={c.hazurSaheb?.name}
                  className="visits-img"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection className="visits-content-col">
              <h2 className="h3 visits-title">{c.hazurSaheb?.name}</h2>
              <div className="visits-desc">
                <p>{c.hazurSaheb?.p1}</p>
                <p>{c.hazurSaheb?.p2}</p>
                {c.hazurSaheb?.trinidadTitle && (
                  <h3 className="visits-sub-title">{c.hazurSaheb.trinidadTitle}</h3>
                )}
                <p>{c.hazurSaheb?.trinidadText}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}

