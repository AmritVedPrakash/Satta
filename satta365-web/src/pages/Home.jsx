import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { homeService } from '../services/homeService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { mockNormalGames, mockSlider, mockAlert } from '../utils/mockData';
import Marquee from '../components/common/Marquee';
import Loader from '../components/common/Loader';
import {
  Play,
  BarChart2,
  PlusCircle,
  ArrowDownToLine,
  Headphones,
  Percent,
  Disc,
  Layers,
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Users,
  Square,
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, refreshBalance } = useAuth();
  const { t } = useLanguage();

  const [alertText, setAlertText] = useState('');
  const [sliders, setSliders] = useState(mockSlider);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [games, setGames] = useState(mockNormalGames);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [, setTick] = useState(0);

  // Live 1-second ticker for real-time countdown & status updates
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const parseTimeString = (timeStr) => {
    if (!timeStr) return null;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const getMarketTimingStatus = (gameName, openStr, closeStr) => {
    const now = new Date();

    // Define day start at 6:30 AM (matches Android MatchesAdapter.java)
    const dayStart = new Date(now);
    dayStart.setHours(6, 30, 0, 0);

    const effectiveNow = new Date(now);
    if (effectiveNow < dayStart) {
      effectiveNow.setDate(effectiveNow.getDate() - 1);
      dayStart.setDate(dayStart.getDate() - 1);
    }

    const closeParsed = parseTimeString(closeStr);
    if (!closeParsed) {
      return {
        isOpen: true,
        timeLeft: '',
        diffMillis: 0,
        statusText: 'Market is Running!',
        statusColor: '#16a34a',
        subText: 'Click Here To Play Now',
      };
    }

    const targetClose = new Date(effectiveNow);
    targetClose.setHours(closeParsed.hours, closeParsed.minutes, 0, 0);

    // If Disawar or close time is before 6:30 AM (e.g. 02:35 AM), target close is next day morning!
    const isDisawar = (gameName || '').toLowerCase().includes('disawar');
    if (isDisawar || targetClose < dayStart) {
      targetClose.setDate(targetClose.getDate() + 1);
    }

    const diffMillis = targetClose.getTime() - now.getTime();
    const isOpen = diffMillis > 0;

    let timeLeft = '';
    if (isOpen) {
      const totalSecs = Math.max(0, Math.floor(diffMillis / 1000));
      const hours = Math.floor(totalSecs / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;
      timeLeft = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    }

    return {
      isOpen,
      timeLeft,
      diffMillis,
      statusText: isOpen ? 'Market is Running!' : 'Market is Closed!',
      statusColor: isOpen ? '#3b8f00' : '#dc2626',
      subText: isOpen ? 'Click Here To Play Now' : `Wait for ${openStr || '06:30 AM'}`,
    };
  };

  const getBannerUrl = (s) => {
    const name = s.Slider1 || s.SliderImage || s.imageUrl;
    if (!name) return '/images/hero.png';
    if (name.startsWith('http://') || name.startsWith('https://')) return name;
    return `/images/banners/${name}`;
  };

  const handleImageError = (e, s) => {
    const name = s.Slider1 || s.SliderImage || s.imageUrl;
    if (name && !e.target.dataset.triedRemote) {
      e.target.dataset.triedRemote = 'true';
      e.target.src = `https://sattareddyanna.com/Images/${name}`;
    } else {
      e.target.src = '/images/hero.png';
    }
  };

  // Preload all banner images immediately on mount
  useEffect(() => {
    if (!sliders || sliders.length === 0) return;
    sliders.forEach((s) => {
      const url = getBannerUrl(s);
      const img = new Image();
      img.src = url;
    });
  }, [sliders]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [alertRes, sliderRes, gamesRes] = await Promise.allSettled([
        homeService.getAlert(),
        homeService.getSliders(),
        homeService.getGames(),
      ]);

      if (alertRes.status === 'fulfilled' && alertRes.value) {
        const alertObj = Array.isArray(alertRes.value) ? alertRes.value[0] : alertRes.value;
        const text = alertObj?.AlertTitle || alertObj?.AlertText || mockAlert[0]?.AlertText;
        setAlertText(text);
      } else {
        setAlertText(mockAlert[0]?.AlertText);
      }

      if (sliderRes.status === 'fulfilled' && Array.isArray(sliderRes.value) && sliderRes.value.length > 0) {
        setSliders(sliderRes.value);
      } else {
        setSliders(mockSlider);
      }

      if (gamesRes.status === 'fulfilled' && Array.isArray(gamesRes.value) && gamesRes.value.length > 0) {
        setGames(gamesRes.value);
      } else {
        setGames(mockNormalGames);
      }
    } catch {
      setGames(mockNormalGames);
      setSliders(mockSlider);
      setAlertText(mockAlert[0]?.AlertText);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (isLoggedIn) {
      refreshBalance();
    }
  }, [isLoggedIn]);

  // Carousel auto-advance (pauses when user hovers)
  useEffect(() => {
    if (!sliders || sliders.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [sliders, isHovered]);

  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const handlePlayMarket = (game) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    const timing = getMarketTimingStatus(game.Gamename, game.GameOpen, game.Gameclose);
    const marketName = game.Gamename || game.GameName || game.name || 'Market';
    if (!timing.isOpen) {
      alert(`Market is Closed! Bidding for ${marketName} is currently closed for today.`);
      return;
    }
    navigate(`/market/${game.GameId || game.id || encodeURIComponent(marketName)}`, {
      state: { game },
    });
  };

  const handleViewChart = () => {
    navigate('/charts');
  };

  const filteredGames = games.filter((g) => {
    const name = (g.Gamename || g.GameName || g.name || '').toLowerCase();
    return name.includes(searchFilter.toLowerCase());
  });

  return (
    <div className="home-page-container">
      {/* Notice Marquee Bar */}
      {alertText && <Marquee text={alertText} />}

      {/* Hero Promotional Banner Section */}
      <section
        className="hero-banner-section"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="banner-carousel">
          {sliders.length > 0 ? (
            sliders.map((s, idx) => (
              <div
                key={idx}
                className={`banner-slide-wrapper ${idx === currentSlide ? 'slide-active' : 'slide-hidden'}`}
              >
                <img
                  src={getBannerUrl(s)}
                  alt={`Promotion ${idx + 1}`}
                  className="banner-slide-img"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  fetchPriority={idx === 0 ? 'high' : 'auto'}
                  onError={(e) => handleImageError(e, s)}
                />
              </div>
            ))
          ) : (
            <div className="banner-fallback-hero">
              <div className="hero-badge">⭐ INDIA'S MOST TRUSTED PLATFORM</div>
              <h1 className="hero-heading">SATTA365 MATKA & LIVE CASINO</h1>
              <p className="hero-subtext">
                Instant Automated Withdrawals (9 AM - 11:30 PM) • 24x7 Customer Support • 9x Roulette Matka Multiplier
              </p>
              <div className="hero-cta-group">
                <button
                  type="button"
                  className="btn btn-gold hero-btn"
                  onClick={() => navigate('/roulette')}
                >
                  <Disc size={18} />
                  <span>Play Roulette Live</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light hero-btn"
                  onClick={() => navigate(isLoggedIn ? '/wallet/add' : '/login')}
                >
                  <PlusCircle size={18} />
                  <span>Instant Add Cash</span>
                </button>
              </div>
            </div>
          )}

          {sliders.length > 1 && (
            <>
              <button
                type="button"
                className="banner-nav-btn prev"
                onClick={handlePrevSlide}
                aria-label="Previous Slide"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="banner-nav-btn next"
                onClick={handleNextSlide}
                aria-label="Next Slide"
              >
                <ChevronRight size={22} />
              </button>

              <div className="banner-dots">
                {sliders.map((_, idx) => (
                  <span
                    key={idx}
                    className={`dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Quick Action Cards Bar */}
      <section className="quick-actions-bar">
        <div
          className="action-card"
          onClick={() => navigate(isLoggedIn ? '/wallet/add' : '/login')}
        >
          <div className="action-icon-circle bg-green-light">
            <PlusCircle size={22} color="#16a34a" />
          </div>
          <div className="action-card-text">
            <span className="action-card-title">{t('add_points') || 'Add Cash'}</span>
            <span className="action-card-sub">Instant UPI QR</span>
          </div>
        </div>

        <div
          className="action-card"
          onClick={() => navigate(isLoggedIn ? '/wallet/withdraw' : '/login')}
        >
          <div className="action-icon-circle bg-orange-light">
            <ArrowDownToLine size={22} color="#ea580c" />
          </div>
          <div className="action-card-text">
            <span className="action-card-title">{t('withdraw_points') || 'Withdraw'}</span>
            <span className="action-card-sub">09:00 AM - 11:30 PM</span>
          </div>
        </div>

        <div className="action-card" onClick={() => navigate('/rates')}>
          <div className="action-icon-circle bg-yellow-light">
            <Percent size={22} color="#ca8a04" />
          </div>
          <div className="action-card-text">
            <span className="action-card-title">{t('game_rates') || 'Game Rates'}</span>
            <span className="action-card-sub">Best 10 Ka 950</span>
          </div>
        </div>

        {/* Panel Charts - Commented out as requested */}
        {/* <div className="action-card" onClick={() => navigate('/charts/KALYAN')}>
          <div className="action-icon-circle bg-blue-light">
            <BarChart2 size={22} color="#2563eb" />
          </div>
          <div className="action-card-text">
            <span className="action-card-title">Panel Charts</span>
            <span className="action-card-sub">Live Market History</span>
          </div>
        </div> */}

        <div className="action-card" onClick={() => navigate('/support')}>
          <div className="action-icon-circle bg-emerald-light">
            <Headphones size={22} color="#059669" />
          </div>
          <div className="action-card-text">
            <span className="action-card-title">24x7 Support</span>
            <span className="action-card-sub">WhatsApp & Call</span>
          </div>
        </div>
      </section>

      {/* Special Live Games Showcase (Roulette, Gali Disawar, Starline) */}
      <section className="special-games-section">
        {/* Card 1: Roulette Matka (Hero Special) */}
        <div className="special-card roulette-hero-card" onClick={() => navigate('/roulette')}>
          <div className="special-card-left">
            <div className="special-badge gold-glow">
              <Zap size={14} /> LIVE MULTIPLIER 9x
            </div>
            <h3 className="special-card-title">ROULETTE MATKA</h3>
            <p className="special-card-desc">
              Fast 30-min rounds • Real-time Spinning Wheel • Direct 0–9 & Outside Bets
            </p>
            <button type="button" className="btn btn-gold special-btn">
              <Play size={14} fill="currentColor" /> Play Roulette Now
            </button>
          </div>
          <div className="special-card-icon-art">
            <Disc size={80} color="var(--gold-color)" className="spin-slow" />
          </div>
        </div>

        {/* Card 2: Gali Disawar */}
        <div className="special-card gali-hero-card" onClick={() => navigate('/gali-disawar')}>
          <div className="special-card-left">
            <div className="special-badge emerald-glow">POPULAR MARKETS</div>
            <h3 className="special-card-title">GALI DISAWAR</h3>
            <p className="special-card-desc">
              Disawar, Faridabad, Ghaziabad & Gali • Jodi & Haruf (Andar/Bahar)
            </p>
            <button type="button" className="btn btn-emerald special-btn">
              <Layers size={14} /> Play Gali Markets
            </button>
          </div>
          <div className="special-card-icon-art">
            <Layers size={72} color="#6ee7b7" />
          </div>
        </div>

        {/* Card 3: Starline - Commented out as requested */}
        {/* <div className="special-card starline-hero-card" onClick={() => navigate('/starline')}>
          <div className="special-card-left">
            <div className="special-badge ruby-glow">HOURLY RESULTS</div>
            <h3 className="special-card-title">STARLINE GAMES</h3>
            <p className="special-card-desc">
              10:00 AM to 05:00 PM • Fast Single Ank & Single Panna Bids
            </p>
            <button type="button" className="btn btn-ruby special-btn">
              <Sparkles size={14} /> Play Starline
            </button>
          </div>
          <div className="special-card-icon-art">
            <Sparkles size={72} color="#f472b6" />
          </div>
        </div> */}
      </section>

      {/* Main Matka Live Markets Section */}
      <section className="live-markets-section">
        <div className="section-header-row">
          <div className="section-title-wrapper">
            <ShieldCheck size={22} color="var(--primary-color)" />
            <h2 className="section-title-text">TODAY'S LIVE MARKETS</h2>
            <span className="live-pill-badge">LIVE 24x7</span>
          </div>

          <div className="section-header-actions">
            <input
              type="text"
              placeholder="Search market (e.g. Kalyan)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="market-search-input"
            />
            <button
              type="button"
              onClick={loadData}
              className="btn btn-secondary refresh-market-btn"
            >
              Refresh Rates
            </button>
          </div>
        </div>

        {loading ? (
          <Loader message="Loading live market rates..." />
        ) : filteredGames.length === 0 ? (
          <div className="empty-markets-card">
            No matching markets found for "{searchFilter}".
          </div>
        ) : (
          <div className="market-grid">
            {filteredGames.map((g, idx) => {
              const name = g.Gamename || g.GameName || g.name || 'MARKET';
              const result = g.Results || g.Result || g.result || '**';
              const openTime = g.GameOpen || g.OpenTime || g.openTime || '06:30 AM';
              const closeTime = g.Gameclose || g.CloseTime || g.closeTime || '02:00 PM';
              const timing = getMarketTimingStatus(name, openTime, closeTime);
              const isOpen = timing.isOpen;

              // Consistent live viewer count per market (matching Android app 696 / 800 Live)
              const baseViewers = ((g.id || (idx + 1) * 37) * 173) % 450 + 620;

              return (
                <div
                  key={g.GameId || g.id || idx}
                  className={`desktop-market-card ${!isOpen ? 'is-closed' : 'is-open'}`}
                  onClick={() => handlePlayMarket(g)}
                  style={{
                    borderTop: `4px solid ${isOpen ? '#16a34a' : '#dc2626'}`,
                  }}
                >
                  {/* Top: Countdown & Live Viewers */}
                  <div className="card-top-row" style={{ minHeight: 24, marginBottom: 8 }}>
                    {isOpen && timing.timeLeft ? (
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        <Clock size={13} color="#64748b" />
                        {timing.timeLeft}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: '#dc2626',
                          background: '#fee2e2',
                          padding: '2px 8px',
                          borderRadius: 6,
                        }}
                      >
                        CLOSED
                      </span>
                    )}

                    {isOpen ? (
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Users size={14} color="#64748b" />
                        {baseViewers} Live
                      </span>
                    ) : (
                      <span
                        className="status-pill pill-closed"
                        style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                      >
                        <span className="status-dot" />
                        Closed
                      </span>
                    )}
                  </div>

                  {/* Center: Market Name, Big Red Result, Subtext */}
                  <div style={{ textAlign: 'center', margin: '4px 0 12px' }}>
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#064e3b',
                        marginBottom: 4,
                        letterSpacing: 0.3,
                      }}
                    >
                      {name}
                    </h3>

                    {/* Result in Bold Crimson/Red matching Android app */}
                    <div
                      style={{
                        fontSize: '2.1rem',
                        fontWeight: 900,
                        color: '#a50b00',
                        letterSpacing: '2px',
                        lineHeight: 1.2,
                        margin: '6px 0',
                      }}
                    >
                      {result}
                    </div>

                    {/* Subtext: Click Here To Play Now or Wait for 06:30 AM */}
                    <div
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: isOpen ? 600 : 700,
                        color: isOpen ? '#334155' : '#dc2626',
                        marginTop: 2,
                      }}
                    >
                      {timing.subText}
                    </div>
                  </div>

                  {/* Bottom: Open, Market Running / Closed, Close */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#1e293b',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: 8,
                      marginBottom: 12,
                    }}
                  >
                    <span>Open : {openTime}</span>
                    <span
                      style={{
                        color: timing.statusColor,
                        fontWeight: 800,
                        fontSize: '0.8rem',
                      }}
                    >
                      {timing.statusText}
                    </span>
                    <span>Close : {closeTime}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="card-action-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
                    {/* Chart Button */}
                    <button
                      type="button"
                      className="btn btn-chart-outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewChart(g);
                      }}
                      title="View Monthly Chart"
                      style={{ justifyContent: 'center' }}
                    >
                      <BarChart2 size={14} />
                      <span>Chart</span>
                    </button>

                    {/* Play Now / Closed Button */}
                    <button
                      type="button"
                      className={`btn ${isOpen ? 'btn-gold' : 'btn-secondary'} market-play-action-btn`}
                      style={{
                        justifyContent: 'center',
                        background: isOpen ? undefined : '#fee2e2',
                        color: isOpen ? undefined : '#dc2626',
                        borderColor: isOpen ? undefined : '#fca5a5',
                        cursor: isOpen ? 'pointer' : 'not-allowed',
                        fontWeight: 700,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayMarket(g);
                      }}
                      disabled={!isOpen}
                    >
                      {isOpen ? (
                        <>
                          <Play size={15} fill="currentColor" />
                          <span>Play Now</span>
                        </>
                      ) : (
                        <>
                          <Square size={13} fill="currentColor" />
                          <span>Market is Closed</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
