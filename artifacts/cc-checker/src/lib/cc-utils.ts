export type CardNetwork =
  | 'Visa'
  | 'Mastercard'
  | 'Amex'
  | 'Discover'
  | 'UnionPay'
  | 'JCB'
  | 'Diners'
  | 'Unknown';

export type CardStatus = 'LIVE' | 'DIE' | 'UNKNOWN';

export interface ParsedCard {
  original: string;
  number: string;
  month: string;
  year: string;
  cvv: string;
  network: CardNetwork;
}

export interface ValidationDetail {
  luhn: boolean;
  lengthValid: boolean;
  cvvValid: boolean;
  expiryValid: boolean;
  patternClean: boolean;
  isTestCard: boolean;
  binExists: boolean | null; // null = not checked yet
  bankName?: string;
  country?: string;
  cardType?: string; // debit/credit/prepaid
}

export interface CheckResult extends ParsedCard {
  status: CardStatus;
  timestamp: number;
  detail?: ValidationDetail;
  confidence?: number; // 0–100
}

// ─── Luhn Algorithm ────────────────────────────────────────────────────────────
export function luhnCheck(cardNo: string): boolean {
  const digits = cardNo.replace(/\D/g, '');
  if (digits.length < 13) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

// ─── Network Detection ────────────────────────────────────────────────────────
export function getNetwork(cardNo: string): CardNetwork {
  const n = cardNo.replace(/\D/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^5[1-5]/.test(n) || /^2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720)/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  if (/^6011|^64[4-9]|^65/.test(n)) return 'Discover';
  if (/^62(?!212[6-9]|2[2-8]|29[0-2])/.test(n)) return 'UnionPay';
  if (/^35(2[89]|[3-8]\d)/.test(n)) return 'JCB';
  if (/^3(?:0[0-5]|[68])/.test(n)) return 'Diners';
  return 'Unknown';
}

// ─── Network-Specific Valid Lengths ──────────────────────────────────────────
const NETWORK_LENGTHS: Record<CardNetwork, number[]> = {
  Visa:       [13, 16, 19],
  Mastercard: [16],
  Amex:       [15],
  Discover:   [16, 17, 18, 19],
  UnionPay:   [16, 17, 18, 19],
  JCB:        [15, 16, 17, 18, 19],
  Diners:     [14, 15, 16, 17, 18, 19],
  Unknown:    [13, 14, 15, 16, 17, 18, 19],
};

// ─── CVV Lengths ──────────────────────────────────────────────────────────────
function getExpectedCvvLength(network: CardNetwork): number {
  return network === 'Amex' ? 4 : 3;
}

// ─── Known Test / Fake Cards ─────────────────────────────────────────────────
const KNOWN_TEST_CARDS = new Set([
  '4242424242424242',
  '4000056655665556',
  '5555555555554444',
  '2223003122003222',
  '5200828282828210',
  '5105105105105100',
  '378282246310005',
  '371449635398431',
  '378734493671000',
  '6011111111111117',
  '6011000990139424',
  '3530111333300000',
  '3566002020360505',
  '4111111111111111',
  '4012888888881881',
  '4222222222222',
  '5431111111111111',
  '6011601160116611',
  '4000002500003155',
  '4000000000009995',
  '4000000000000002',
]);

export function isTestCard(number: string): boolean {
  return KNOWN_TEST_CARDS.has(number.replace(/\D/g, ''));
}

// ─── Suspicious Pattern Detection ────────────────────────────────────────────
export function isSuspiciousPattern(number: string): boolean {
  const n = number.replace(/\D/g, '');
  // All same digit: 4444444444444444
  if (/^(\d)\1+$/.test(n)) return true;
  // Incrementing: 1234567890123456
  let isAscending = true;
  let isDescending = true;
  for (let i = 1; i < n.length; i++) {
    const diff = parseInt(n[i]) - parseInt(n[i - 1]);
    if (diff !== 1 && !(n[i - 1] === '9' && n[i] === '0')) isAscending = false;
    if (diff !== -1 && !(n[i - 1] === '0' && n[i] === '9')) isDescending = false;
    if (!isAscending && !isDescending) break;
  }
  if (isAscending || isDescending) return true;
  // Repeated 4-digit blocks: 1234123412341234
  if (n.length >= 16) {
    const block = n.substring(0, 4);
    if (n === block.repeat(n.length / 4)) return true;
  }
  return false;
}

// ─── Expiry Validation ────────────────────────────────────────────────────────
export function validateExpiry(month: string, year: string): boolean {
  const m = parseInt(month, 10);
  let y = parseInt(year, 10);

  if (isNaN(m) || isNaN(y)) return false;
  if (m < 1 || m > 12) return false;

  // Normalize 2-digit year
  if (y < 100) y += 2000;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Too far in the future (>10 years) is also suspicious
  if (y > currentYear + 10) return false;
  if (y < currentYear) return false;
  if (y === currentYear && m < currentMonth) return false;

  return true;
}

// ─── Full Client-Side Validation ─────────────────────────────────────────────
export function validateCardLocal(card: ParsedCard): {
  status: CardStatus;
  detail: Omit<ValidationDetail, 'binExists' | 'bankName' | 'country' | 'cardType'>;
  confidence: number;
} {
  const n = card.number.replace(/\D/g, '');
  const network = card.network;

  const luhn = luhnCheck(n);
  const lengthValid = NETWORK_LENGTHS[network].includes(n.length);
  const cvvLen = card.cvv.replace(/\D/g, '').length;
  const expectedCvvLen = getExpectedCvvLength(network);
  const cvvValid = cvvLen === expectedCvvLen || cvvLen === 3; // tolerate 3 if expected 4
  const expiryValid = validateExpiry(card.month, card.year);
  const patternClean = !isSuspiciousPattern(n);
  const isTestCardFlag = isTestCard(n);

  // Hard failures → DIE immediately
  if (!luhn || !expiryValid || !lengthValid || isTestCardFlag || !patternClean) {
    const detail = { luhn, lengthValid, cvvValid, expiryValid, patternClean, isTestCard: isTestCardFlag };
    return { status: 'DIE', detail, confidence: 0 };
  }

  // Soft failures (unknown — could be real, could be fake)
  if (!cvvValid) {
    const detail = { luhn, lengthValid, cvvValid, expiryValid, patternClean, isTestCard: false };
    return { status: 'UNKNOWN', detail, confidence: 30 };
  }

  // Passed all local checks — mark LIVE tentatively (BIN lookup may downgrade)
  let confidence = 60;
  if (network !== 'Unknown') confidence += 10;
  if (n.length === 16) confidence += 5; // most common valid length
  const detail = { luhn, lengthValid, cvvValid, expiryValid, patternClean, isTestCard: false };
  return { status: 'LIVE', detail, confidence };
}

// ─── Parsing ──────────────────────────────────────────────────────────────────
export function parseCardLine(line: string): ParsedCard | null {
  const cleanLine = line.trim();
  if (!cleanLine || cleanLine.startsWith('#') || cleanLine.startsWith('//')) return null;

  // Split on common separators: pipe, colon, space, comma, semicolon
  const parts = cleanLine.split(/[\s|:,;]+/).filter(p => p.length > 0);

  // Find card number (13-19 consecutive digits)
  const numberIndex = parts.findIndex(p => /^\d{13,19}$/.test(p));
  if (numberIndex === -1) {
    // Try removing spaces inside a number like "4532 1234 5678 9012"
    const noSpace = cleanLine.replace(/\s+/g, '');
    if (/^\d{13,19}$/.test(noSpace)) {
      // plain number only — no expiry/cvv
      return null;
    }
    return null;
  }

  const number = parts[numberIndex];
  const rest = parts.filter((_, i) => i !== numberIndex);

  let month = '';
  let year = '';
  let cvv = '';

  // Standard order after number: MM YYYY CVV or MM YY CVV
  if (rest.length >= 3) {
    month = rest[0];
    year  = rest[1];
    cvv   = rest[2];
  } else if (rest.length === 2) {
    // Could be MMYY CVV
    if (/^\d{4}$/.test(rest[0]) && parseInt(rest[0].substring(0, 2), 10) <= 12) {
      month = rest[0].substring(0, 2);
      year  = rest[0].substring(2, 4);
      cvv   = rest[1];
    } else {
      month = rest[0];
      year  = rest[1];
    }
  } else if (rest.length === 1) {
    // Maybe MMYYYYCVV combined? Try to split
    const combined = rest[0];
    if (/^\d{9,10}$/.test(combined)) {
      month = combined.substring(0, 2);
      if (combined.length === 9) {
        year = combined.substring(2, 6);
        cvv  = combined.substring(6);
      } else {
        year = combined.substring(2, 4);
        cvv  = combined.substring(4);
      }
    }
  }

  // Normalize month (ensure 2 digits)
  if (month && month.length === 1) month = '0' + month;

  // Basic sanity
  if (!month || !year) return null;

  return {
    original: cleanLine,
    number,
    month,
    year,
    cvv: cvv || '000',
    network: getNetwork(number),
  };
}

// ─── Mask card number ─────────────────────────────────────────────────────────
export function maskCardNumber(num: string): string {
  if (!num || num.length < 10) return num;
  const first6 = num.substring(0, 6);
  const last4  = num.substring(num.length - 4);
  const mask   = '*'.repeat(num.length - 10);
  return `${first6}${mask}${last4}`;
}
