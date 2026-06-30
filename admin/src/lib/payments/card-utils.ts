export function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

export function luhnCheck(cardNumber: string): boolean {
  const digits = digitsOnly(cardNumber);
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function validateCard(card: {
  number: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
  holderName: string;
}): { valid: boolean; error?: string } {
  const num = digitsOnly(card.number);
  if (!luhnCheck(num)) return { valid: false, error: "Geçersiz kart numarası" };
  if (!card.holderName?.trim()) return { valid: false, error: "Kart üzerindeki isim gerekli" };
  const cvc = digitsOnly(card.cvc);
  if (cvc.length < 3 || cvc.length > 4) return { valid: false, error: "Geçersiz CVV" };
  const month = parseInt(card.expireMonth, 10);
  const yearRaw = card.expireYear;
  let year = parseInt(yearRaw, 10);
  if (yearRaw.length === 2) year += 2000;
  if (month < 1 || month > 12) return { valid: false, error: "Geçersiz son kullanma ayı" };
  const exp = new Date(year, month, 0);
  if (exp < new Date()) return { valid: false, error: "Kartın süresi dolmuş" };
  return { valid: true };
}

/** iyzico sandbox test kartları */
export const IYZICO_TEST_CARDS = {
  success: "5528790000000008",
  fail: "5528790000000016",
  insufficient: "5528790000000024",
};