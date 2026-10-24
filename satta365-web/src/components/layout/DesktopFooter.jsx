import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Headphones, Award, Lock, ArrowUpRight } from 'lucide-react';

export const DesktopFooter = () => {
  return (
    <footer className="desktop-footer">
      <div className="footer-container">
        {/* Top Badges Row */}
        <div className="footer-badges">
          <div className="badge-item">
            <ShieldCheck size={28} color="var(--gold-color)" />
            <div>
              <div className="badge-title">100% Safe & Secure</div>
              <div className="badge-desc">Bank-grade encrypted transactions</div>
            </div>
          </div>
          <div className="badge-item">
            <Award size={28} color="var(--gold-color)" />
            <div>
              <div className="badge-title">Instant Payouts</div>
              <div className="badge-desc">Fast automated withdrawals</div>
            </div>
          </div>
          <div className="badge-item">
            <Headphones size={28} color="var(--gold-color)" />
            <div>
              <div className="badge-title">24x7 Customer Support</div>
              <div className="badge-desc">Instant WhatsApp & phone help</div>
            </div>
          </div>
          <div className="badge-item">
            <Lock size={28} color="var(--gold-color)" />
            <div>
              <div className="badge-title">18+ Play Responsibly</div>
              <div className="badge-desc">Strict age & fair play policies</div>
            </div>
          </div>
        </div>

        {/* Main Columns */}
        <div className="footer-columns">
          {/* Col 1: About */}
          <div className="footer-col">
            <div className="footer-brand">
              <img
                src="/images/logo.png"
                alt="Satta365"
                style={{ width: 34, height: 34, objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="brand-text">SATTA<span>365</span></span>
            </div>
            <p className="footer-about-text">
              India's most trusted online Matka and gaming platform. Experience lightning-fast deposits, instant automated withdrawals, and real-time live market results with best-in-industry rates.
            </p>
            <div className="payment-icons-strip">
              <span className="pay-chip">UPI</span>
              <span className="pay-chip">GPay</span>
              <span className="pay-chip">PhonePe</span>
              <span className="pay-chip">Paytm</span>
              <span className="pay-chip">IMPS / NEFT</span>
            </div>
          </div>

          {/* Col 2: Games */}
          <div className="footer-col">
            <h4 className="footer-heading">Games & Markets</h4>
            <ul className="footer-links">
              <li><Link to="/">All Regular Matka Markets</Link></li>
              <li><Link to="/roulette">Roulette Matka (Live Wheel)</Link></li>
              <li><Link to="/gali-disawar">Gali Disawar Markets</Link></li>
              {/* <li><Link to="/starline">Starline Hourly Games</Link></li> */}
              <li><Link to="/rates">Official Game Rates & Payouts</Link></li>
              {/* <li><Link to="/charts/KALYAN">Market Panel Charts</Link></li> */}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Player Services</h4>
            <ul className="footer-links">
              <li><Link to="/wallet/add">Add Cash / Deposit Points</Link></li>
              <li><Link to="/wallet/withdraw">Withdraw Winning Cash</Link></li>
              <li><Link to="/wallet/statement">Wallet Transaction Ledger</Link></li>
              <li><Link to="/history/bids">My Placed Bids History</Link></li>
              <li><Link to="/history/wins">Winning Bids & Results</Link></li>
              <li><Link to="/refer">Refer & Earn 5% Bonus</Link></li>
            </ul>
          </div>

          {/* Col 4: Help & Rules */}
          <div className="footer-col">
            <h4 className="footer-heading">Help & Legal</h4>
            <ul className="footer-links">
              <li><Link to="/how-to-play">How To Play Matka Guide</Link></li>
              <li><Link to="/notice">Notice Board & Guidelines</Link></li>
              <li><Link to="/support">24x7 WhatsApp Customer Support</Link></li>
              <li><Link to="/profile">My Account Settings</Link></li>
            </ul>
            <div className="footer-contact-box">
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Official Helpline:</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-color)' }}>
                WhatsApp: +91 9876543210
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="footer-bottom">
          <p className="disclaimer-text">
            Disclaimer: This platform is intended solely for adult entertainment (18+). Please play responsibly. Satta365 complies with all applicable digital fair play guidelines and SSL encrypted data security.
          </p>
          <div className="copyright-row">
            <span>© 2026 SATTA365. All Rights Reserved.</span>
            <div className="legal-links">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Responsible Gaming</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;

