import React from 'react';
import './index.css';
import logoUrl from './lovixa-logo.png';
import bgUrl from './Blush Satin Waves on Cream.png';

export default function ComingSoon() {
  return (
    <main className="nexeon-main">
      {/* Decorative Backgrounds */}
      <img src={bgUrl} alt="Background" className="nexeon-bg-image" />
      <div className="nexeon-wash"></div>

      {/* Header */}
      <header className="nexeon-header">
        <img src={logoUrl} alt="Lovixa" className="nexeon-logo" />
        <a href="#notify" className="nexeon-contact-pill">
          <span>GET NOTIFIED</span>
        </a>
      </header>

      {/* Hero Content */}
      <section className="nexeon-content-section">
        <div className="nexeon-content-wrapper">
          <p className="nexeon-overline">Lovixa Haircare</p>
          <span className="nexeon-divider"></span>
          
          <h1 className="nexeon-title">
            <span className="title-line-1">Coming</span>
            <span className="title-line-2">Soon</span>
          </h1>
          

          
          <p className="nexeon-description">
            Discover the magic of Rosemary & Methi Dana. Nourish your scalp, repair damaged hair, and experience the softness you deserve.
          </p>
          

        </div>
        
      </section>
    </main>
  );
}
