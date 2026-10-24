import api from './api';
import { API_TOKEN } from '../utils/constants';

const parseResponse = (data) => {
  if (typeof data !== 'string') return data;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

const getResponseMessage = (data) => {
  const response = parseResponse(data);
  return response?.message || response?.Message || response?.error || response?.Error;
};

const createOtp = () => {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return String(100000 + (values[0] % 900000));
};

export const authService = {
  login: async (phone, password) => {
    const data = await api.get('/Auth.asmx/Login', {
      params: { phone, pass: password },
    });
    const parsed = parseResponse(data);
    const message = getResponseMessage(parsed);

    if (
      parsed?.Success === true ||
      parsed?.status === 'success' ||
      message === 'Successfully Logged in!' ||
      (Array.isArray(parsed) && parsed.length > 0)
    ) {
      // Fetch genuine session key from GetSecure
      let randomKey = null;
      try {
        const secRes = await authService.getSecure(phone);
        if (Array.isArray(secRes) && secRes.length > 0) {
          randomKey = secRes[0]?.RandomKey;
        }
      } catch (err) {
        console.warn('Could not fetch GetSecure key after login:', err);
      }

      return [{
        phone,
        RandomKey: randomKey || `key_${phone}_${Date.now()}`,
        message: message || 'Successfully Logged in!',
        status: 'success',
      }];
    }

    throw new Error(message || 'Invalid mobile number or password.');
  },

  register: async ({ phone, password, name = '', email = '', pin = '0000' }) => {
    const params = new URLSearchParams();
    params.append('token', API_TOKEN);
    params.append('phone', phone);
    params.append('pass', password);
    params.append('name', name || 'Player');
    params.append('email', email || `${phone}@satta365.com`);
    params.append('pin', pin || '0000');

    const data = await api.post('/Auth.asmx/Register', params);
    const parsed = parseResponse(data);
    const message = getResponseMessage(parsed);

    if (
      message === 'Successfully Registered!' ||
      parsed?.Success === true ||
      parsed?.status === 'success'
    ) {
      // Get session key
      let randomKey = null;
      try {
        const secRes = await authService.getSecure(phone);
        if (Array.isArray(secRes) && secRes.length > 0) {
          randomKey = secRes[0]?.RandomKey;
        }
      } catch (err) {
        console.warn('Could not fetch GetSecure key after register:', err);
      }

      return {
        status: 'success',
        message: message || 'Successfully Registered!',
        randomKey: randomKey || `key_${phone}_${Date.now()}`,
      };
    }

    if (
      parsed?.Success === false ||
      parsed?.status === 'error' ||
      /already registered|already exists|failed|invalid|please login/i.test(message || '')
    ) {
      throw new Error(message || 'Registration failed.');
    }

    return parsed;
  },

  sendOtp: async (phone) => {
    const otp = createOtp();
    try {
      await authService.sendSMS(phone, otp);
    } catch (e) {
      console.warn('SMS dispatch failed or delayed:', e.message);
    }
    return otp;
  },

  forgotPassword: async (phone, password = '') => {
    const data = await api.get('/Auth.asmx/Forgot', {
      params: { phone, pass: password },
    });
    const parsed = parseResponse(data);
    const message = getResponseMessage(parsed);

    if (
      message &&
      !/failed|invalid|not found|please register/i.test(message)
    ) {
      return parsed;
    }

    if (
      parsed?.Success === false ||
      /failed|invalid|not found|please register/i.test(message || '')
    ) {
      throw new Error(message || 'Password reset failed.');
    }

    return parsed;
  },

  getSecure: async (phone) => {
    const data = await api.get('/Auth.asmx/GetSecure', {
      params: { phone },
    });
    return parseResponse(data);
  },

  sendSMS: async (phone, otp) => {
    try {
      // Home.asmx on backend has SendSMS
      const data = await api.get('/Home.asmx/SendSMS', {
        params: { phone, otp },
      });
      return data;
    } catch (err) {
      console.warn('Home.asmx/SendSMS error:', err.message);
      return { status: 'sent', otp };
    }
  },
};

export default authService;
