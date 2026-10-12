import { calcTotals } from './calc';

test('applies tax to the discounted subtotal', () => {
  const t = calcTotals([{ quantity: 2, unitPriceMinor: 5000 }], 10, 1000);
  expect(t).toEqual({ subtotalMinor: 10000, taxTotalMinor: 900, totalMinor: 9900 });
});

test('zero tax and empty lines', () => {
  expect(calcTotals([], 0)).toEqual({ subtotalMinor: 0, taxTotalMinor: 0, totalMinor: 0 });
});

test('rounds tax using basis points', () => {
  const t = calcTotals([{ quantity: 1, unitPriceMinor: 1 }], 18.5, 0);
  expect(t.taxTotalMinor).toBe(0);
  const t2 = calcTotals([{ quantity: 1, unitPriceMinor: 10000 }], 18.5, 0);
  expect(t2).toEqual({ subtotalMinor: 10000, taxTotalMinor: 1850, totalMinor: 11850 });
});
