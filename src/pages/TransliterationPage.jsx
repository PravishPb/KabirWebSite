import React from 'react';
import './TransliterationPage.css';

const TransliterationPage = () => {
  return (
    <div className="page-container transliteration-page section">
      <div className="container prose">
        <h1 className="h1 text-center mb-section">Transliteration (Hindi to English)</h1>

        <div className="transliteration-intro">
          <p className="lead text-center muted2 mb-section">
            A guide to pronouncing the Hindi alphabet using English letters.
          </p>
        </div>

        <div className="transliteration-section">
          <h2 className="h3 section-title text-center">Vowels and Accents</h2>
          <div className="transliteration-grid vowels-grid">
            <div className="trans-cell"><span className="hindi">अ</span> <span className="eng">a</span></div>
            <div className="trans-cell"><span className="hindi">आ</span> <span className="eng">aa</span></div>
            <div className="trans-cell"><span className="hindi">इ</span> <span className="eng">i</span></div>
            <div className="trans-cell"><span className="hindi">ई</span> <span className="eng">ee</span></div>
            
            <div className="trans-cell"><span className="hindi">उ</span> <span className="eng">u</span></div>
            <div className="trans-cell"><span className="hindi">ऊ</span> <span className="eng">oo</span></div>
            <div className="trans-cell"><span className="hindi">ए</span> <span className="eng">e</span></div>
            <div className="trans-cell"><span className="hindi">ऐ</span> <span className="eng">ai</span></div>
            
            <div className="trans-cell"><span className="hindi">ओ</span> <span className="eng">o</span></div>
            <div className="trans-cell"><span className="hindi">औ</span> <span className="eng">au</span></div>
            <div className="trans-cell"><span className="hindi">अं</span> <span className="eng"><u>n</u>/<u>m</u></span></div>
            <div className="trans-cell"><span className="hindi">अँ</span> <span className="eng"><del>n</del>/<del>m</del></span></div>
            
            <div className="trans-cell"><span className="hindi">ऽ</span> <span className="eng">( ' )</span></div>
            <div className="trans-cell"><span className="hindi">अः</span> <span className="eng">h</span></div>
            <div className="trans-cell"><span className="hindi">ऋ</span> <span className="eng"><u>r</u>i</span></div>
            <div className="trans-cell empty"></div>
          </div>
        </div>

        <div className="transliteration-section mt-section">
          <h2 className="h3 section-title text-center">Consonants (Vyanjan)</h2>
          <div className="transliteration-grid consonants-grid">
            <div className="trans-cell"><span className="hindi">क</span> <span className="eng">k</span> <span className="alt">(क़ – q)</span></div>
            <div className="trans-cell"><span className="hindi">ख</span> <span className="eng">kh</span> <span className="alt">(ख़ – <u>kh</u>)</span></div>
            <div className="trans-cell"><span className="hindi">ग</span> <span className="eng">g*</span> <span className="alt">(ग़ – <u>g</u>)</span></div>
            <div className="trans-cell"><span className="hindi">घ</span> <span className="eng">gh</span></div>
            <div className="trans-cell"><span className="hindi">ङ</span> <span className="eng"><u>n</u></span></div>
            
            <div className="trans-cell"><span className="hindi">च</span> <span className="eng">ch</span></div>
            <div className="trans-cell"><span className="hindi">छ</span> <span className="eng">chh</span></div>
            <div className="trans-cell"><span className="hindi">ज</span> <span className="eng">j</span> <span className="alt">(ज़ – z)</span></div>
            <div className="trans-cell"><span className="hindi">झ</span> <span className="eng">jh</span></div>
            <div className="trans-cell"><span className="hindi">ञ</span> <span className="eng">ñ</span></div>
            
            <div className="trans-cell"><span className="hindi">ट</span> <span className="eng"><u>t</u></span></div>
            <div className="trans-cell"><span className="hindi">ठ</span> <span className="eng"><u>th</u>*</span></div>
            <div className="trans-cell"><span className="hindi">ड</span> <span className="eng"><u>d</u></span> <span className="alt">(ड़ – <del>d</del>)</span></div>
            <div className="trans-cell"><span className="hindi">ढ</span> <span className="eng"><u>dh</u></span> <span className="alt">(ढ़ – <u>rh</u>)</span></div>
            <div className="trans-cell"><span className="hindi">ण</span> <span className="eng"><del>n</del></span></div>
            
            <div className="trans-cell"><span className="hindi">त</span> <span className="eng">t</span></div>
            <div className="trans-cell"><span className="hindi">थ</span> <span className="eng">th*</span></div>
            <div className="trans-cell"><span className="hindi">द</span> <span className="eng">d</span></div>
            <div className="trans-cell"><span className="hindi">ध</span> <span className="eng">dh</span></div>
            <div className="trans-cell"><span className="hindi">न</span> <span className="eng">n</span></div>
            
            <div className="trans-cell"><span className="hindi">प</span> <span className="eng">p</span></div>
            <div className="trans-cell"><span className="hindi">फ</span> <span className="eng">ph*</span> <span className="alt">(फ़ – f)</span></div>
            <div className="trans-cell"><span className="hindi">ब</span> <span className="eng">b</span></div>
            <div className="trans-cell"><span className="hindi">भ</span> <span className="eng">bh</span></div>
            <div className="trans-cell"><span className="hindi">म</span> <span className="eng">m</span></div>
            
            <div className="trans-cell"><span className="hindi">य</span> <span className="eng">y*</span></div>
            <div className="trans-cell"><span className="hindi">र</span> <span className="eng">r</span></div>
            <div className="trans-cell"><span className="hindi">ल</span> <span className="eng">l</span></div>
            <div className="trans-cell"><span className="hindi">व</span> <span className="eng">v/w*</span></div>
            <div className="trans-cell empty"></div>
            
            <div className="trans-cell"><span className="hindi">श</span> <span className="eng">sh</span></div>
            <div className="trans-cell"><span className="hindi">ष</span> <span className="eng"><u>sh</u></span></div>
            <div className="trans-cell"><span className="hindi">स</span> <span className="eng">s</span></div>
            <div className="trans-cell"><span className="hindi">ह</span> <span className="eng">h</span></div>
            <div className="trans-cell empty"></div>
            
            <div className="trans-cell"><span className="hindi">क्ष</span> <span className="eng">ksh</span></div>
            <div className="trans-cell"><span className="hindi">ज्ञ</span> <span className="eng">gy</span></div>
            <div className="trans-cell"><span className="hindi">श्र</span> <span className="eng">shr</span></div>
            <div className="trans-cell"><span className="hindi">त्र</span> <span className="eng">tr</span></div>
            <div className="trans-cell empty"></div>
          </div>
        </div>

        <div className="transliteration-notes mt-section scheme-4">
          <h3 className="h5 mb-4">Notes on Pronunciation</h3>
          <ul>
            <li><strong>*</strong> indicates that the letter is spoken from the throat (guttural/aspirated depending on the letter).</li>
            <li><strong><u>Underlined</u></strong> English letters indicate retroflex sounds (tongue curled back).</li>
            <li><strong><del>Strikethrough</del></strong> letters indicate nasalization.</li>
            <li>Letters in brackets (e.g., <strong>क़ – q</strong>) represent sounds borrowed from Perso-Arabic sources.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransliterationPage;
