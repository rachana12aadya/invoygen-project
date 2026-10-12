export interface LineItem {
  quantity: number;
  unitPriceMinor: number;
}

export interface Totals {
  subtotalMinor: number;
  taxTotalMinor: number;
  totalMinor: number;
}

export function calcTotals(items: LineItem[], taxRate: number, discountMinor = 0): Totals {
  const lineTotals = items.map((i) => Math.round(i.quantity * i.unitPriceMinor));
  const subtotalMinor = lineTotals.reduce((sum, v) => sum + v, 0);
  const taxable = Math.max(0, subtotalMinor - discountMinor);
  const basisPoints = Math.round(taxRate * 100);
  const taxTotalMinor = Math.round((taxable * basisPoints) / 10000);
  return { subtotalMinor, taxTotalMinor, totalMinor: taxable + taxTotalMinor };
}

export function formatMoney(minor: number, currency: string, locale = 'en-US') {
  const digits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions()
    .maximumFractionDigits;
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(minor / 10 ** digits);
}
