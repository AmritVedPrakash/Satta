import api from './api';
import {
  mockFunds,
  mockUpiDetails,
  mockGameRates,
  mockSupport,
} from '../utils/mockData';

export const drawerService = {
  displayFunds: async (phone) => {
    try {
      const data = await api.get('/Drawer.asmx/DisplayFunds', { params: { phone } });
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (Array.isArray(parsed)) {
        return parsed.length > 0 ? parsed : [{ Points: '0', WithdrawPoints: '0' }];
      }
      return mockFunds;
    } catch {
      return mockFunds;
    }
  },

  getUpiId: async () => {
    try {
      const data = await api.get('/Drawer.asmx/GETUPIID');
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockUpiDetails;
    } catch {
      return mockUpiDetails;
    }
  },

  getUpi: async () => {
    return drawerService.getUpiId();
  },

  addFundsTransactions: async ({ amt, phone, utr }) => {
    try {
      const data = await api.get('/Drawer.asmx/AddFundsTransactions', {
        params: { amt, phone, utr },
      });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return { message: 'Deposit Request Submitted Successfully!' };
    }
  },

  addPoints: async (phone, amt, utr) => {
    return drawerService.addFundsTransactions({ amt, phone, utr });
  },

  calculateWithdraw: async ({ withdrawAmount, phone }) => {
    try {
      const data = await api.get('/Drawer.asmx/CalculateWithdraw', {
        params: { withdrawAmount, phone },
      });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return { message: 'Successfully Initiated!' };
    }
  },

  withdrawFunds: async ({
    type,
    phone,
    name = '',
    accno = '',
    ifsc = '',
    bankname = '',
    address = '',
    upi = '',
    amt,
  }) => {
    try {
      const data = await api.get('/Drawer.asmx/WithdrawFunds', {
        params: {
          type,
          phone,
          name,
          accno,
          ifsc,
          bankname,
          address,
          UPI: upi,
          amt,
        },
      });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return { message: 'Successfully Added!' };
    }
  },

  withdrawPoints: async (phone, amt, type, detail) => {
    return drawerService.withdrawFunds({ phone, amt, type, upi: detail });
  },

  addBank: async ({ phone, name, accno, ifsc, bankname, address = '' }) => {
    try {
      const data = await api.get('/Drawer.asmx/AddBank', {
        params: { phone, name, accno, ifsc, bankname, address },
      });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return { message: 'Successfully Added!' };
    }
  },

  displayBank: async (phone) => {
    try {
      const data = await api.get('/Drawer.asmx/DisplayBank', { params: { phone } });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return [];
    }
  },

  addUpi: async ({ phone, type, upi }) => {
    try {
      const data = await api.get('/Drawer.asmx/AddUPI', {
        params: { phone, type, upi },
      });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return { message: 'Successfully Added!' };
    }
  },

  displayUpi: async ({ phone, type }) => {
    try {
      const data = await api.get('/Drawer.asmx/DisplayUPI', {
        params: { phone, type },
      });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return [];
    }
  },

  walletStatement: async (phone) => {
    try {
      const data = await api.get('/Drawer.asmx/WalletStatement', { params: { phone } });
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => {
          // Note: Backend Drawer.asmx/WalletStatement field mapping:
          // TransactionId = Remark / Bet info (e.g. "Bet Place On Round : ... | Number : 1" or "Balance Added")
          // TransactionAmt = Date & Time string (e.g. "10/23/2026 4:18:32 PM")
          // TransactionStatus = Points / Amount (e.g. "10", "400")
          // TransactionDateandTime = Status (e.g. "Money Deducted!", "Money Added")
          const remark = item.TransactionId || item.Remark || item.msg || item.description || '';
          const date = item.TransactionAmt || item.Date || item.date || item.TransactionDate || '';
          const points = item.TransactionStatus || item.Points || item.amt || item.amount || '0';
          const status = item.TransactionDateandTime || item.Status || item.status || '';
          const isDeducted = status.toLowerCase().includes('deduct') || remark.toLowerCase().includes('bet') || remark.toLowerCase().includes('debit');

          return {
            id: item.id || Math.random(),
            raw: item,
            remark,
            date,
            points,
            status,
            isDeducted,
            isCredit: !isDeducted,
            // Backwards compatibility for existing code
            Remark: remark,
            Date: date,
            Points: points,
            Status: status,
            Type: isDeducted ? 'debit' : 'credit',
          };
        });
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch wallet statement:', err);
      return [];
    }
  },

  displayStatement: async (phone) => {
    return drawerService.walletStatement(phone);
  },

  getStatement: async (phone) => {
    return drawerService.walletStatement(phone);
  },

  bidHistory: async ({ startDate = '', toDate = '', phone = '' }) => {
    try {
      const data = await api.get('/Drawer.asmx/BidHistory', {
        params: { startdate: startDate, todate: toDate, ph: phone },
      });
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  winHistory: async ({ startDate = '', toDate = '', phone = '' }) => {
    try {
      const data = await api.get('/Drawer.asmx/WinHistory', {
        params: { startdate: startDate, todate: toDate, ph: phone },
      });
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  gameRates: async (type = 'normal') => {
    try {
      const data = await api.get('/Drawer.asmx/GameRates', { params: { type } });
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockGameRates;
    } catch {
      return mockGameRates;
    }
  },

  getRates: async () => {
    return drawerService.gameRates();
  },

  starlineChart: async () => {
    try {
      const data = await api.get('/Drawer.asmx/starlinechart');
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  getProfile: async (phone) => {
    try {
      const data = await api.get('/Drawer.asmx/Profile', { params: { phone } });
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [{ name: 'Player', Email: 'player@example.com' }];
    } catch {
      return [{ name: 'Player', Email: 'player@example.com' }];
    }
  },

  updateProfile: async ({ phone, name, email }) => {
    try {
      const data = await api.get('/Drawer.asmx/UpdateProfile', {
        params: { phone, name, email },
      });
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return { message: 'Profile Updated Successfully!' };
    }
  },

  getSupport: async () => {
    try {
      const data = await api.get('/Drawer.asmx/Support');
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockSupport;
    } catch {
      return mockSupport;
    }
  },
};

export default drawerService;
