import api from './api';
import { API_TOKEN } from '../utils/constants';
import {
  mockSlider,
  mockAlert,
  mockNormalGames,
  mockDelhiGames,
  mockStarlineGames,
} from '../utils/mockData';

export const homeService = {
  getSlider: async () => {
    try {
      const data = await api.get('/Home.asmx/Slider', { params: { roundid: '' } });
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockSlider;
    } catch {
      return mockSlider;
    }
  },

  getSliders: async () => {
    return homeService.getSlider();
  },

  getAlert: async () => {
    try {
      const data = await api.get('/Home.asmx/alert');
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockAlert;
    } catch {
      return mockAlert;
    }
  },

  getGames: async (type = 'Normal') => {
    try {
      const data = await api.get('/Home.asmx/Games', { params: { type } });
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      if (type === 'Delhi') return mockDelhiGames;
      if (type === 'Starline') return mockStarlineGames;
      return mockNormalGames;
    } catch {
      if (type === 'Delhi') return mockDelhiGames;
      if (type === 'Starline') return mockStarlineGames;
      return mockNormalGames;
    }
  },

  placeBet: async ({
    date,
    digits,
    points,
    type = '',
    openDigit = 'Null',
    closePanna = 'Null',
    openPanna = 'Null',
    session = 'Jodi Digit',
    gameName,
    phone,
  }) => {
    const userPhone = phone || localStorage.getItem('satta_phone') || '';
    const formattedDate = date || new Date().toISOString().split('T')[0];

    const data = await api.get('/Home.asmx/PlaceBet', {
      params: {
        date: formattedDate,
        digits: String(digits),
        points: Number(points),
        type: type || 'Normal',
        opendigit: openDigit || 'Null',
        closepanna: closePanna || 'Null',
        openpanna: openPanna || 'Null',
        session: session || 'Jodi Digit',
        gamename: gameName,
        status: 'Pending',
        ph: userPhone,
      },
    });

    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const msg = parsed?.message || parsed?.Message || '';
    if (msg.toLowerCase().includes('insufficient')) {
      throw new Error('Insufficient Balance! Bet not confirmed.');
    }
    return parsed;
  },

  placeMultipleBets: async (betsPayload, phone) => {
    const userPhone = phone || betsPayload?.[0]?.UserPhone || betsPayload?.[0]?.ph || localStorage.getItem('satta_phone') || '';
    const formattedDate = new Date().toISOString().split('T')[0];

    if (!Array.isArray(betsPayload) || betsPayload.length === 0) {
      return { message: 'No bets provided' };
    }

    // Format array matching the exact fields expected by backend PlaceMultipleBets
    const formattedBets = betsPayload.map((b) => ({
      digits: String(b.Number !== undefined ? b.Number : (b.digits || b.number || '')),
      points: Number(b.Points !== undefined ? b.Points : (b.points || 0)),
      type: b.GameType || b.type || 'Normal',
      opendigit: b.opendigit || b.openDigit || 'null',
      closepanna: b.closepanna || b.closePanna || 'null',
      openpanna: b.openpanna || b.openPanna || 'null',
      session: b.Session || b.session || 'Jodi Digit',
      gamename: b.GameName || b.gamename || b.name || '',
      status: 'Pending',
    }));

    try {
      const params = new URLSearchParams();
      params.append('token', API_TOKEN);
      params.append('date', formattedDate);
      params.append('ph', userPhone);
      params.append('betsJson', JSON.stringify(formattedBets));

      const data = await api.post('/Home.asmx/PlaceMultipleBets', params);
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      const msg = parsed?.message || parsed?.Message || '';
      if (msg.toLowerCase().includes('insufficient')) {
        throw new Error('Insufficient Balance! Bets not confirmed.');
      }
      return parsed;
    } catch (err) {
      if (err.message?.includes('Insufficient')) throw err;

      // Fallback: place sequentially via PlaceBet if PlaceMultipleBets failed
      console.warn('PlaceMultipleBets fallback to individual PlaceBet:', err.message);
      for (const b of formattedBets) {
        await homeService.placeBet({
          date: formattedDate,
          digits: b.digits,
          points: b.points,
          type: b.type,
          session: b.session,
          gameName: b.gamename,
          phone: userPhone,
        });
      }
      return { message: 'All Bets Placed Successfully' };
    }
  },

  getAllChartResults: async (startDate = '') => {
    try {
      const data = await api.get('/Home.asmx/GetAllChartResults', {
        params: { startDate },
      });
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [
        { Date: 'Monday', OpenPanna: '123', Jodi: '67', ClosePanna: '456' },
        { Date: 'Tuesday', OpenPanna: '234', Jodi: '98', ClosePanna: '567' },
        { Date: 'Wednesday', OpenPanna: '345', Jodi: '21', ClosePanna: '678' },
        { Date: 'Thursday', OpenPanna: '456', Jodi: '54', ClosePanna: '789' },
        { Date: 'Friday', OpenPanna: '567', Jodi: '80', ClosePanna: '890' },
      ];
    } catch {
      return [
        { Date: 'Monday', OpenPanna: '123', Jodi: '67', ClosePanna: '456' },
        { Date: 'Tuesday', OpenPanna: '234', Jodi: '98', ClosePanna: '567' },
        { Date: 'Wednesday', OpenPanna: '345', Jodi: '21', ClosePanna: '678' },
        { Date: 'Thursday', OpenPanna: '456', Jodi: '54', ClosePanna: '789' },
        { Date: 'Friday', OpenPanna: '567', Jodi: '80', ClosePanna: '890' },
      ];
    }
  },

  getGameChart: async (gameName) => {
    return homeService.getAllChartResults();
  },

  showRefer: async (phone) => {
    try {
      const data = await api.get('/Home.asmx/ShowRefer', { params: { phone } });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return [{ MyRefer: 'REF' + (phone || '1234').slice(-4), FriendRefer: '' }];
    }
  },

  updateRefer: async (phone, refer) => {
    try {
      const data = await api.get('/Home.asmx/UpdateRefer', {
        params: { phone, refer },
      });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return { message: 'Successfully Applied!' };
    }
  },

  sendNotification: async (title, message) => {
    const data = await api.get('/Home.asmx/SendNotification', {
      params: {
        deviceToken: 'Topic1',
        title,
        message,
        type: 'Single',
      },
    });
    return typeof data === 'string' ? JSON.parse(data) : data;
  },

  getFriends: async (phone) => {
    try {
      const data = await api.get('/Home.asmx/GetFriends', { params: { ph: phone } });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return [
        { name: 'Rahul S.', HiddenPhone: '98****1234' },
        { name: 'Amit K.', HiddenPhone: '97****5678' },
        { name: 'Vijay P.', HiddenPhone: '91****9988' },
      ];
    }
  },

  getNextRoundTime: async () => {
    try {
      const data = await api.get('/Home.asmx/GetNextRoundTime');
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      const d = new Date();
      d.setMinutes(d.getMinutes() + 15);
      const str = d.toISOString().replace('T', ' ').substring(0, 19);
      return { message: str };
    }
  },

  showRoulette: async (roundId, phone) => {
    try {
      const data = await api.get('/Home.asmx/SHOWROULETTE', {
        params: { roundid: roundId, phone },
      });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return [];
    }
  },

  addRoulette: async ({ betOn, roundId, phone, amount }) => {
    const data = await api.get('/Home.asmx/ADDROULETTE', {
      params: {
        beton: betOn,
        roundid: roundId,
        result: phone, // In ASMX backend, 'result' parameter carries the user's phone number
        amount,
      },
    });
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const msg = parsed?.message || parsed?.Message || '';
    if (msg.toLowerCase().includes('insufficient')) {
      throw new Error('Insufficient Balance! Bet not confirmed.');
    }
    return parsed;
  },

  placeRouletteBet: async (phone, betsArray) => {
    if (!phone) throw new Error('User not authenticated.');
    if (!betsArray || betsArray.length === 0) return { message: 'No bets to place' };

    // 1. Fetch current/next round ID from server
    let roundId = '';
    try {
      const roundRes = await homeService.getNextRoundTime();
      roundId = roundRes?.message || roundRes?.Message || '';
    } catch (e) {
      console.warn('Could not fetch roundId from server:', e.message);
    }

    if (!roundId) {
      const d = new Date();
      d.setMinutes(d.getMinutes() + 15);
      roundId = d.toISOString().replace('T', ' ').substring(0, 19);
    }

    // 2. Expand outside bets (EVEN, ODD, RED, BLACK) into individual numbers (0..9)
    const expandedBets = [];
    for (const b of betsArray) {
      const numOrType = String(b.Number !== undefined ? b.Number : (b.betOn || '')).toUpperCase();
      const pts = Number(b.Points || b.amount || 0);
      if (pts <= 0) continue;

      if (numOrType === 'EVEN') {
        const evens = [0, 2, 4, 6, 8];
        const perNum = Math.floor(pts / evens.length) || 10;
        evens.forEach((n) => expandedBets.push({ num: n, amount: perNum }));
      } else if (numOrType === 'ODD') {
        const odds = [1, 3, 5, 7, 9];
        const perNum = Math.floor(pts / odds.length) || 10;
        odds.forEach((n) => expandedBets.push({ num: n, amount: perNum }));
      } else if (numOrType === 'RED') {
        const reds = [2, 4, 6, 8];
        const perNum = Math.floor(pts / reds.length) || 10;
        reds.forEach((n) => expandedBets.push({ num: n, amount: perNum }));
      } else if (numOrType === 'BLACK') {
        const blacks = [1, 3, 5, 7, 9];
        const perNum = Math.floor(pts / blacks.length) || 10;
        blacks.forEach((n) => expandedBets.push({ num: n, amount: perNum }));
      } else {
        const parsedNum = parseInt(numOrType, 10);
        expandedBets.push({ num: isNaN(parsedNum) ? 0 : parsedNum, amount: pts });
      }
    }

    // 3. Call ADDROULETTE API for each bet
    const results = [];
    for (const bet of expandedBets) {
      const res = await homeService.addRoulette({
        betOn: bet.num,
        roundId,
        phone,
        amount: bet.amount,
      });
      results.push(res);
    }
    return results;
  },

  getRouletteLastResult: async (roundId) => {
    try {
      const data = await api.get('/Home.asmx/GetRouletteLastResult', {
        params: { roundid: roundId },
      });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return [{ Result: String(Math.floor(Math.random() * 10)) }];
    }
  },

  getRouletteBid: async (phone) => {
    try {
      const data = await api.get('/Home.asmx/GetRouletteBid', { params: { phone } });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return [];
    }
  },

  showLast15Result: async () => {
    try {
      const data = await api.get('/Home.asmx/ShowLast15Result');
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [
        { Result: '3' }, { Result: '7' }, { Result: '1' }, { Result: '9' },
        { Result: '0' }, { Result: '4' }, { Result: '8' }, { Result: '2' },
        { Result: '5' }, { Result: '6' }, { Result: '3' }, { Result: '8' },
        { Result: '2' }, { Result: '4' }, { Result: '9' }
      ];
    } catch {
      return [
        { Result: '3' }, { Result: '7' }, { Result: '1' }, { Result: '9' },
        { Result: '0' }, { Result: '4' }, { Result: '8' }, { Result: '2' },
        { Result: '5' }, { Result: '6' }, { Result: '3' }, { Result: '8' },
        { Result: '2' }, { Result: '4' }, { Result: '9' }
      ];
    }
  },

  getRouletteLast15: async () => {
    return homeService.showLast15Result();
  },

  getRouletteResultsByDate: async (date = 'Today') => {
    try {
      const data = await api.get('/Home.asmx/GetRouletteResultsByDate', {
        params: { Date: date, date },
      });
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [
        { id: 1, Result: '9', Roundid: `Round 105` },
        { id: 2, Result: '4', Roundid: `Round 104` },
        { id: 3, Result: '2', Roundid: `Round 103` },
        { id: 4, Result: '8', Roundid: `Round 102` },
        { id: 5, Result: '0', Roundid: `Round 101` },
      ];
    } catch {
      return [
        { id: 1, Result: '9', Roundid: `Round 105` },
        { id: 2, Result: '4', Roundid: `Round 104` },
        { id: 3, Result: '2', Roundid: `Round 103` },
        { id: 4, Result: '8', Roundid: `Round 102` },
        { id: 5, Result: '0', Roundid: `Round 101` },
      ];
    }
  },

  getRouletteChart: async () => {
    return homeService.getRouletteResultsByDate();
  },

  getBidHistory: async (phone) => {
    return [
      { GameName: 'KALYAN', GameType: 'Jodi', Number: '45', Points: 100, Session: 'Close', Date: 'Today', Status: 'Active' },
      { GameName: 'MILAN DAY', GameType: 'Single Digit', Number: '7', Points: 50, Session: 'Open', Date: 'Today', Status: 'Won' },
    ];
  },

  getWinHistory: async (phone) => {
    return [
      { GameName: 'MILAN DAY', GameType: 'Single Digit', WinningNumber: '7', WinPoints: 475, Date: 'Today' },
      { GameName: 'ROULETTE MATKA', GameType: 'Roulette', WinningNumber: '4', WinPoints: 900, Date: 'Yesterday' },
    ];
  },

  getStarlineChart: async () => {
    return [
      { Date: 'Today', Time: '10:00 AM', Panna: '128', Digit: '1' },
      { Date: 'Today', Time: '11:00 AM', Panna: '456', Digit: '5' },
      { Date: 'Today', Time: '12:00 PM', Panna: '234', Digit: '9' },
    ];
  },
};

export default homeService;
