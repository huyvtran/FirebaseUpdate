const moneyFormat = n => `${n ? Number(n).toFixed(0).replace(/./g, (c, i, a) => (i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? `.${c}` : c)) : '0'}`;
const moneyFormat3 = n => `${n ? String(n).replace(/\./g, '').replace(/./g, (c, i, a) => (i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? `.${c}` : c)) : '0'}`;
const moneyFormat2 = n => `${String(n).split('.').join('').replace(/./g, (c, i, a) => (i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? `.${c}` : c))}`;
const moneyFormat4 = n => `${String(n).replace(/\./g, '')}`;

export { moneyFormat, moneyFormat2, moneyFormat3, moneyFormat4 };
