import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import MainLayout from '../components/layout/MainLayout';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import OTPVerify from '../pages/OTPVerify';
import MarketMenu from '../pages/MarketMenu';

// Betting Pages
import Jodi from '../pages/bets/Jodi';
import Haruf from '../pages/bets/Haruf';
import Crossing from '../pages/bets/Crossing';
import QuickRange from '../pages/bets/QuickRange';
import Panna from '../pages/bets/Panna';
import TriplePanna from '../pages/bets/TriplePanna';
import HalfSangam from '../pages/bets/HalfSangam';
import FullSangam from '../pages/bets/FullSangam';

// Other Games & Charts
import RouletteGame from '../pages/RouletteGame';
import RouletteChart from '../pages/RouletteChart';
import GaliDisawar from '../pages/GaliDisawar';
import Starline from '../pages/Starline';
import StarlineChart from '../pages/StarlineChart';
import Charts from '../pages/Charts';

// Drawer & Wallet Pages
import AddFunds from '../pages/AddFunds';
import WithdrawFunds from '../pages/WithdrawFunds';
import WalletStatement from '../pages/WalletStatement';
import BidHistory from '../pages/BidHistory';
import WinHistory from '../pages/WinHistory';
import GameRates from '../pages/GameRates';
import Profile from '../pages/Profile';
import Support from '../pages/Support';
import Notice from '../pages/Notice';
import HowToPlay from '../pages/HowToPlay';
import Refer from '../pages/Refer';
import NotFound from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Core Pages */}
        <Route index element={<Home />} />
        <Route path="market/:gameId" element={<MarketMenu />} />

        {/* Bet Pages */}
        <Route path="bets/jodi" element={<Jodi />} />
        <Route path="bets/haruf" element={<Haruf />} />
        <Route path="bets/crossing" element={<Crossing />} />
        <Route path="bets/quick-range" element={<QuickRange />} />
        <Route path="bets/panna" element={<Panna />} />
        <Route path="bets/triple-panna" element={<TriplePanna />} />
        <Route path="bets/half-sangam" element={<HalfSangam />} />
        <Route path="bets/full-sangam" element={<FullSangam />} />

        {/* Other Games */}
        <Route path="roulette" element={<RouletteGame />} />
        <Route path="roulette/chart" element={<RouletteChart />} />
        <Route path="gali-disawar" element={<GaliDisawar />} />
        {/* <Route path="starline" element={<Starline />} /> */}
        {/* <Route path="starline/chart" element={<StarlineChart />} /> */}
        <Route path="charts" element={<Charts />} />

        {/* Wallet & Accounts */}
        <Route path="wallet/add" element={<AddFunds />} />
        <Route path="wallet/withdraw" element={<WithdrawFunds />} />
        <Route path="wallet/statement" element={<WalletStatement />} />
        <Route path="history/bids" element={<BidHistory />} />
        <Route path="history/wins" element={<WinHistory />} />
        <Route path="rates" element={<GameRates />} />
        <Route path="profile" element={<Profile />} />
        <Route path="support" element={<Support />} />
        <Route path="notice" element={<Notice />} />
        <Route path="how-to-play" element={<HowToPlay />} />
        <Route path="refer" element={<Refer />} />

        {/* Auth Pages within App Container */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="otp-verify" element={<OTPVerify />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

