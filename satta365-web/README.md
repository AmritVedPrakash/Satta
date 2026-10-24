# Satta365 Web Application

Modern, responsive web application converted from the native Java Android application **Satta365**. Built with **React.js (JSX)**, **Vite**, **ES6+**, and clean component architecture, preserving all original workflows, game calculations, asset designs, and .NET ASP.NET backend integration.

---

## 🚀 Key Features

### 1. Live Matka Markets
- **Live Games Dashboard**: Displays real-time market scores, Open and Close times, and Market Open/Closed badges.
- **Historical Panel Charts**: Interactive day-by-day and week-by-week Open Panna, Jodi, and Close Panna history for every market.
- **Scrolling Notice Marquee**: Displays live admin alerts and announcements.
- **Promotional Carousel**: Auto-rotating promotional banners.

### 2. Full Betting Game Suite
- **Single Digit (Haruf)**: Open and Close session betting with interactive 0–9 keypad.
- **Jodi Digit**: 2-digit (00–99) betting with fast entry, preset point chips, and slip basket.
- **Crossing (Jodi Generator)**: Generates all permutations from unique digits, with optional Jora (pairs).
- **Quick Range**: Batch-place bets across ranges (e.g. 10 to 50) with uniform points.
- **Single & Double Panna**: Strict mathematical validation for ascending digits and repeating pairs.
- **Triple Panna**: Quick grid for all 10 triples (000, 111, ..., 999) with "Apply All" capability.
- **Half Sangam & Full Sangam**: Dual mode combinations (Open Panna + Close Ank or Open Ank + Close Panna, Open Panna + Close Panna).

### 3. Special Games
- **Roulette Matka (9x Multiplier)**:
  - SVG animated spinning roulette wheel with needle pointer.
  - 30-minute round timer with automatic 60-second lockout before spin.
  - Last 15 results history ticker.
  - Number bets (0–9) and outside bets (Even, Odd, Red, Black).
  - Round results sound effects (`song.mp3`).
- **Gali Disawar**: North India markets (Disawar, Faridabad, Ghaziabad, Gali) with Jodi and Haruf (Andar/Bahar).
- **Starline Games**: Hourly matka markets (10:00 AM to 05:00 PM) with hourly panel history chart.

### 4. Wallet & Banking
- **Add Cash / Points**:
  - Displays admin UPI ID with one-click copy.
  - Dynamic QR code generation for instant scanning (GPay, PhonePe, Paytm).
  - 12-digit UTR reference submission.
  - Minimum deposit ₹100.
- **Withdraw Cash**:
  - Available payout options: UPI/VPA, Paytm, or Direct Bank Transfer (IFSC, Account Number, Holder Name).
  - Validates operating hours: **09:00 AM to 11:30 PM**.
  - Validates minimum withdrawal limit: **₹460**.
  - Restricts withdrawals strictly to Winning Cash.
- **Wallet Statement**: Complete credit/debit transaction ledger.
- **Bid History & Win History**: Complete record of placed bets and winning payouts.

### 5. Multi-Language & Audio Experience
- **Language Support**: Seamless instant switching between **English**, **Hindi (हिंदी)**, **Marathi (मराठी)**, and **Tamil (தமிழ்)**.
- **Sound Toggle**: Background music (`tune.mp3`) and sound effects with mute control.

### 6. Authentication & Security
- **Single Device Session Enforcement**: Periodic background validation against `Auth.asmx/GetSecure` to ensure an account is only logged in on one device at a time.
- **Secure Token**: Authenticates all requests using token `KLARMNLNIHJAESJV`.
- **Registration and password reset**: The app sends an SMS OTP before submitting registration or password-reset requests. Password reset asks for the new password before OTP verification.
- **Visible API failures**: Authentication and SMS network failures are shown to the user instead of being treated as successful requests.

---

## 📁 Project Structure

```text
satta365-web/
├── public/
│   ├── audio/              # tune.mp3, song.mp3
│   └── images/             # 59 copied Android drawable assets & banners
├── src/
│   ├── assets/             # Branding assets
│   ├── components/
│   │   ├── common/         # Button, Input, Modal, Loader, ErrorMessage, Marquee
│   │   ├── layout/         # Navbar, Sidebar, Footer, MainLayout, LanguageModal
│   │   └── roulette/       # RouletteWheel (SVG), Last15Ticker
│   ├── context/
│   │   ├── AuthContext.jsx       # User session, balances, single-device check
│   │   ├── LanguageContext.jsx   # Multi-language translation helper
│   │   └── SoundContext.jsx      # Audio playback & toggle
│   ├── pages/
│   │   ├── bets/           # Jodi, Haruf, Crossing, QuickRange, Panna, TriplePanna, HalfSangam, FullSangam
│   │   ├── AddFunds.jsx
│   │   ├── BidHistory.jsx
│   │   ├── Charts.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── GaliDisawar.jsx
│   │   ├── GameRates.jsx
│   │   ├── Home.jsx
│   │   ├── HowToPlay.jsx
│   │   ├── Login.jsx
│   │   ├── MarketMenu.jsx
│   │   ├── NotFound.jsx
│   │   ├── Notice.jsx
│   │   ├── OTPVerify.jsx
│   │   ├── Profile.jsx
│   │   ├── Refer.jsx
│   │   ├── Register.jsx
│   │   ├── RouletteChart.jsx
│   │   ├── RouletteGame.jsx
│   │   ├── Starline.jsx
│   │   ├── StarlineChart.jsx
│   │   ├── Support.jsx
│   │   ├── WalletStatement.jsx
│   │   ├── WinHistory.jsx
│   │   └── WithdrawFunds.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx   # Central route declarations
│   ├── services/
│   │   ├── api.js          # Centralized Axios client
│   │   ├── authService.js  # Login, Register, OTP, GetSecure
│   │   ├── drawerService.js# Funds, UPI, Withdraw, Statement, Rates, Support
│   │   └── homeService.js  # Games, Sliders, Bets, Roulette, Charts
│   ├── utils/
│   │   ├── constants.js    # API Token, limits, presets
│   │   ├── mockData.js     # ASMX JSON format fallbacks
│   │   ├── translations.js # English, Hindi, Marathi, Tamil dictionaries
│   │   └── validators.js   # ValidationClass equivalent logic
│   ├── App.jsx             # Shell & Providers
│   ├── index.css           # Responsive mobile-frame styling
│   └── main.jsx            # Application entry point
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Installation
Navigate into the web directory and install dependencies:
```bash
cd satta365-web
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure your .NET backend URL if running locally or remotely:
```env
VITE_API_BASE_URL=/APIs
VITE_API_PROXY_TARGET=https://sattareddyanna.com
VITE_SMS_API_BASE_URL=/SMS
VITE_SMS_PROXY_TARGET=https://betzuno.com
VITE_API_TOKEN=KLARMNLNIHJAESJV
```
The development server proxies `/APIs` to `VITE_API_PROXY_TARGET` and `/SMS` to `VITE_SMS_PROXY_TARGET/APIs`. The API proxy defaults to `https://sattareddyanna.com`, matching the supplied backend URL `https://sattareddyanna.com/APIs`; the SMS gateway is separate. The old SMS domain in `.env.example` is parked and must be replaced with a working SMS gateway before registration OTPs can be delivered. The app rejects SMS redirects instead of treating them as successful sends. Restart Vite after changing `.env`. In production, configure an equivalent same-origin reverse-proxy route, or set `VITE_API_BASE_URL` to the HTTPS API URL if the backend permits browser CORS requests.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```
The compiled, minified output will be in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🌐 .NET Backend Integration Details

The frontend uses ASP.NET `.asmx` endpoints at `https://sattareddyanna.com/APIs`; React calls `/APIs/<service>` through the Vite proxy in development. Configure `VITE_API_PROXY_TARGET` if the backend host changes.

| Service | Endpoint | Key Actions |
|---|---|---|
| **Auth.asmx** | `/APIs/Auth.asmx/` | `Login`, `Register`, `Forgot`, `GetSecure`; Android also has `CreateRazorpayOrder` |
| **SMS gateway** | `https://betzuno.com/APIs/WebService1.asmx/SendSMS` | `SendSMS`, proxied through `/SMS` in React to avoid browser CORS |
| **Home.asmx** | `/APIs/Home.asmx/` | `Slider`, `alert`, `Games`, `PlaceBet`, `PlaceMultipleBets`, `GetAllChartResults`, `ShowRefer`, `UpdateRefer`, `GetFriends`, `GetNextRoundTime`, `SHOWROULETTE`, `ADDROULETTE`, `GetRouletteLastResult`, `GetRouletteBid`, `ShowLast15Result`, `GetRouletteResultsByDate`, `SendNotification` |
| **Drawer.asmx** | `/APIs/Drawer.asmx/` | `DisplayFunds`, `GETUPIID`, `AddFundsTransactions`, `CalculateWithdraw`, `WithdrawFunds`, `AddBank`, `DisplayBank`, `AddUPI`, `DisplayUPI`, `WalletStatement`, `BidHistory`, `WinHistory`, `GameRates`, `starlinechart`, `Profile`, `UpdateProfile`, `Support` |

React's current API services use the same paths for the website features. The add-funds form also calls `/Home.asmx/SendNotification`, as the Android app does. `CreateRazorpayOrder` exists in the Android source, but the web app currently uses UPI/UTR rather than Razorpay checkout. Auth API requests include the API token as a query parameter; registration sends the `phone`, `pass`, and `pin` parameters defined by the backend's Register WSDL.

---

## 📱 Responsive Design
The application features a responsive mobile-app container:
- **Mobile Devices**: Fullscreen 100% viewport experience with bottom navigation and touch gestures.
- **Desktop & Tablets**: Centered phone-frame container with ambient shadow, retaining the look and feel of the original Satta365 Android app.
