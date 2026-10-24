export const API_TOKEN = 'KLARMNLNIHJAESJV';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/APIs';
export const SMS_API_BASE_URL = import.meta.env.VITE_SMS_API_BASE_URL || '/SMS';

export const MIN_BET_AMOUNT = 10;
export const MIN_DEPOSIT_POINTS = 100;
export const MIN_WITHDRAW_POINTS = 460;

export const PRESET_POINTS = [10, 20, 50, 100, 200, 500];

export const WITHDRAW_RULES = {
  MIN_AMOUNT: 460,
  START_HOUR: 9, // 9:00 AM
  END_HOUR: 23,  // 11:30 PM
  END_MINUTE: 30,
};

export const ADD_FUNDS_RULES = {
  MIN_AMOUNT: 100,
  PRESET_AMOUNTS: [100, 200, 500, 1000, 2000, 5000],
};

export const ROULETTE_RULES = {
  MIN_BET: 10,
  MULTIPLIER: 9,
  PRESET_AMOUNTS: [10, 50, 100, 500, 1000],
  ROUND_INTERVAL_MINUTES: 30,
  LOCKOUT_SECONDS: 60, // Last 1 minute betting closed
};

export const SUPPORT_LINKS = {
  WHATSAPP_DEFAULT: 'https://api.whatsapp.com/send?phone=919999999999',
  TELEGRAM_DEFAULT: 'https://t.me/satta365',
  YOUTUBE_DEFAULT: 'https://www.youtube.com/@Satta365Entertainment',
  WEBSITE_URL: 'https://satta365.co',
};

export default {
  API_TOKEN,
  API_BASE_URL,
  SMS_API_BASE_URL,
  MIN_BET_AMOUNT,
  MIN_DEPOSIT_POINTS,
  MIN_WITHDRAW_POINTS,
  PRESET_POINTS,
  WITHDRAW_RULES,
  ADD_FUNDS_RULES,
  ROULETTE_RULES,
  SUPPORT_LINKS,
};
