/* js/currency.js - demo fx; replace with real API for production */
const FX = {
  INR:1, USD:0.012, EUR:0.011, GBP:0.0096, AED:0.044, SGD:0.017, AUD:0.018
};
const SYMBOL = {INR:'₹', USD:'$', EUR:'€', GBP:'£', AED:'AED ', SGD:'S$', AUD:'A$'};
function convert(amountInINR, to = 'INR'){
  const r = FX[to] || 1;
  return Math.round(amountInINR * r);
}
function formatCurrency(amount, currency='INR'){
  const sym = SYMBOL[currency] || '';
  return `${sym}${amount.toLocaleString()}`;
}

