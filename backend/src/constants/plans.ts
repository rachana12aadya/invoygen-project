export const PLANS = {
  free: {
    invoicesPerMonth: 5,
    templateIds: ['classic', 'minimal'] as const,
    pdfFooter: true,
  },
  paid: {
    invoicesPerMonth: Number.POSITIVE_INFINITY,
    templateIds: ['classic', 'minimal', 'bold'] as const,
    pdfFooter: false,
  },
} as const;

export type PlanId = keyof typeof PLANS;
