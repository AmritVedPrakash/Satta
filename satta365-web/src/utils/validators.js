// Validation utilities for Satta365

export const validatePhone = (phone) => {
  if (!phone || String(phone).trim() === "") {
    return "Field Cannot be Empty";
  }
  const clean = String(phone).trim();
  if (clean.length !== 10 || !/^\d{10}$/.test(clean)) {
    return "Incorrect Phone No. (Must be 10 digits)";
  }
  return null;
};

export const isValidPhone = (phone) => {
  return /^\d{10}$/.test(String(phone || "").trim());
};

export const isValidPassword = (password) => {
  return typeof password === "string" && password.trim().length >= 4;
};

export const isValidName = (name) => {
  return typeof name === "string" && name.trim().length >= 3;
};

export const isValidJodi = (jodi) => {
  return /^\d{2}$/.test(String(jodi || "").trim());
};

export const isValidHaruf = (haruf) => {
  return /^\d{1}$/.test(String(haruf || "").trim());
};

export const isValidCrossing = (digits) => {
  const clean = String(digits || "").replace(/\D/g, "");
  const unique = new Set(clean.split(""));
  return unique.size >= 2 && unique.size <= 10;
};

export const isValidPoints = (points) => {
  const num = parseInt(points, 10);
  return !isNaN(num) && num >= 10;
};

export const isValidSinglePanna = (panna) => {
  const str = String(panna || "").trim();
  if (!/^\d{3}$/.test(str)) return false;
  const d0 = parseInt(str[0], 10);
  const d1 = parseInt(str[1], 10);
  const d2 = parseInt(str[2], 10);
  // Single panna: all 3 digits unique, in ascending order (where 0 can act as 10 in matka rules or strictly ascending)
  return d0 < d1 && d1 < d2;
};

export const isValidDoublePanna = (panna) => {
  const str = String(panna || "").trim();
  if (!/^\d{3}$/.test(str)) return false;
  // Double panna: exactly 2 repeating digits
  return (
    (str[0] === str[1] && str[1] !== str[2]) ||
    (str[1] === str[2] && str[0] !== str[1]) ||
    (str[0] === str[2] && str[0] !== str[1])
  );
};

export const isValidUtr = (utr) => {
  return /^\d{12}$/.test(String(utr || "").trim());
};

export const isWithdrawalOpen = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;
  // 9:00 AM is 540 min, 11:30 PM (23:30) is 1410 min
  return currentMinutes >= 540 && currentMinutes <= 1410;
};

export const validateEmail = (email) => {
  if (!email || String(email).trim() === "") {
    return "Please Enter a Valid Email";
  }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(String(email).trim())) {
    return "Please Enter a Valid Email";
  }
  return null;
};

export const validateRequired = (val, fieldName = "Field") => {
  if (!val || String(val).trim() === "") {
    return `${fieldName} Cannot be Empty`;
  }
  return null;
};

export const validatePin = (pin) => {
  if (!pin || String(pin).trim() === "") {
    return "Field Cannot be Empty";
  }
  if (String(pin).trim().length !== 4) {
    return "Pin is Too Short (Must be 4 digits)";
  }
  return null;
};

export const validateAddPoints = (amount) => {
  if (!amount || String(amount).trim() === "") {
    return "Field Cannot be Empty";
  }
  const num = parseInt(amount, 10);
  if (isNaN(num) || num < 100) {
    return "Please Add minimum 100 points";
  }
  return null;
};

export const validateWithdrawPoints = (amount, withdrawableBalance = 0) => {
  if (!amount || String(amount).trim() === "") {
    return "Field Cannot be Empty";
  }
  const num = parseInt(amount, 10);
  if (isNaN(num) || num < 460) {
    return "Minimum Withdraw is 460";
  }
  if (num > parseInt(withdrawableBalance, 10)) {
    return "Please Check Your Winning Balance (Insufficient Balance)";
  }
  return null;
};

export const validateDigits = (digits, length) => {
  if (!digits || String(digits).trim() === "") {
    return "Field Cannot be Empty";
  }
  const clean = String(digits).trim();
  if (clean.length !== length) {
    return `Digits is not valid! (Must be ${length} digits)`;
  }
  return null;
};

export const validatePoints = (points) => {
  if (!points || String(points).trim() === "") {
    return "Field Cannot be Empty";
  }
  const num = parseInt(points, 10);
  if (isNaN(num) || num < 10) {
    return "Minimum Amount is 10!";
  }
  return null;
};

export const validateBankDetails = ({ name, acc, cacc, ifsc, bankName }) => {
  const errors = {};
  if (!name || !name.trim())
    errors.name = "Account Holder Name Cannot be Empty";
  if (!acc || !acc.trim()) errors.acc = "Account Number Cannot be Empty";
  if (acc !== cacc) errors.cacc = "Account numbers do not match";
  if (!ifsc || !ifsc.trim()) errors.ifsc = "IFSC Code Cannot be Empty";
  if (!bankName || !bankName.trim())
    errors.bankName = "Bank Name Cannot be Empty";
  return errors;
};
