import React from 'react';
import { useTranslation } from '../locales/useTranslation';
import './TransliterationPage.css';

const TransliterationPage = () => {
  const c = useTranslation('TransliterationPage');

  return (
    <div className="page-container transliteration-page section">
      <div className="container">
        <h1 className="t-h2 text-center transliteration-title">
          {c.title}
        </h1>
        <p className="lead text-center muted2 transliteration-subtitle">
          {c.subtitle}
        </p>

        {/* ── Vowels + Pronunciation side-by-side ── */}
        <div className="vowels-row">

          {/* Left: Vowels Table */}
          <div className="vowels-panel">
            <h2 className="panel-heading">{c.vowelsTitle}</h2>
            <table className="trans-table">
              <tbody>
                <tr>
                  <td>अ – a</td><td>आ – aa</td><td>इ – i</td><td>ई – ee</td>
                </tr>
                <tr>
                  <td>उ – u</td><td>ऊ – oo</td><td>ए – e</td><td>ऐ – ai</td>
                </tr>
                <tr>
                  <td>ओ – o</td><td>औ – au</td><td>अं – <u>n</u>/<u>m</u></td><td>अँ – <del>n</del>/<del>m</del></td>
                </tr>
                <tr>
                  <td>ऽ – ( ' )</td><td>अः – h</td><td>ऋ – <u>r</u>i</td><td></td>
                </tr>
              </tbody>
            </table>
            <p className="diphthong-note" dangerouslySetInnerHTML={{ __html: c.diphthongNote }} />
          </div>

          {/* Right: Pronunciation Guide */}
          <div className="pronunciation-panel">
            <h2 className="panel-heading">{c.vowelsProTitle}</h2>
            <div className="pro-grid">
              <div className="pro-col">
                {c.vowelsProRules && c.vowelsProRules.slice(0, 6).map((rule, idx) => (
                  <p key={idx} dangerouslySetInnerHTML={{ __html: rule }} />
                ))}
              </div>
              <div className="pro-col">
                {c.vowelsProRules && c.vowelsProRules.slice(6).map((rule, idx) => (
                  <p key={idx} dangerouslySetInnerHTML={{ __html: rule }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Consonants ── */}
        <div className="consonants-section">
          <h2 className="panel-heading">{c.consonantsTitle}</h2>
          <table className="trans-table consonants-table">
            <tbody>
              <tr>
                <td>क – k <span className="alt">(क़ – q)</span></td>
                <td>ख – kh <span className="alt">(ख़ – <u>kh</u>)</span></td>
                <td>ग – g* <span className="alt">(ग़ – <u>g</u>)</span></td>
                <td>घ – gh</td>
                <td>ङ – <u>n</u></td>
              </tr>
              <tr>
                <td>च – ch</td>
                <td>छ – chh</td>
                <td>ज – j <span className="alt">(ज़ – z)</span></td>
                <td>झ – jh</td>
                <td>ञ – ñ</td>
              </tr>
              <tr>
                <td>ट – <u>t</u></td>
                <td>ठ – <u>th</u>*</td>
                <td>ड – <u>d</u> <span className="alt">(ड़ – <del>d</del>)</span></td>
                <td>ढ – <u>dh</u> <span className="alt">(ढ़ – <u>rh</u>)</span></td>
                <td>ण – <del>n</del></td>
              </tr>
              <tr>
                <td>त – t</td>
                <td>थ – th*</td>
                <td>द – d</td>
                <td>ध – dh</td>
                <td>न – n</td>
              </tr>
              <tr>
                <td>प – p</td>
                <td>फ – ph* <span className="alt">(फ़ – f)</span></td>
                <td>ब – b</td>
                <td>भ – bh</td>
                <td>म – m</td>
              </tr>
              <tr>
                <td>य – y*</td>
                <td>र – r</td>
                <td>ल – l</td>
                <td>व – v/w*</td>
                <td></td>
              </tr>
              <tr>
                <td>श – sh</td>
                <td>ष – <u>sh</u></td>
                <td>स – s</td>
                <td>ह – h</td>
                <td></td>
              </tr>
              <tr>
                <td>क्ष – ksh</td>
                <td>ज्ञ – gy</td>
                <td>श्र – shr</td>
                <td>त्र – tr</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Pronunciation (Consonants) ── */}
        <div className="consonant-pronunciation">
          <div className="dotted-title">
            <span className="dotted-line"></span>
            <h3 className="panel-heading">{c.consonantsProTitle}</h3>
            <span className="dotted-line"></span>
          </div>
          <div className="cons-pro-rules">
            <div className="cons-rule">
              <span className="cons-rule-label">G</span>
              <span dangerouslySetInnerHTML={{ __html: c.consonantProRules?.g }} />
            </div>
            <div className="cons-rule">
              <span className="cons-rule-label">Th</span>
              <span dangerouslySetInnerHTML={{ __html: c.consonantProRules?.th }} />
            </div>
            <div className="cons-rule">
              <span className="cons-rule-label">Ch</span>
              <span dangerouslySetInnerHTML={{ __html: c.consonantProRules?.ch }} />
            </div>
            <div className="cons-rule">
              <span className="cons-rule-label">Y</span>
              <span dangerouslySetInnerHTML={{ __html: c.consonantProRules?.y }} />
            </div>
            <div className="cons-rule">
              <span className="cons-rule-label">Ph</span>
              <span dangerouslySetInnerHTML={{ __html: c.consonantProRules?.ph }} />
            </div>
            <div className="cons-rule">
              <span className="cons-rule-label">"y"</span>
              <span dangerouslySetInnerHTML={{ __html: c.consonantProRules?.ySep }} />
            </div>
          </div>
          <div className="cons-rule cons-rule-full">
            <span className="cons-rule-label">v / w</span>
            <span dangerouslySetInnerHTML={{ __html: c.consonantProRules?.vw }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransliterationPage;
