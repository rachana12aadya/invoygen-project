export type InvoiceTemplate = {
  id: string;
  name: string;
  layout: 'classic' | 'minimal' | 'bold';
  defaultFont: string;
  defaultColors: { primary: string };
  planAccess: 'free' | 'paid';
};

export const TEMPLATES: InvoiceTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    layout: 'classic',
    defaultFont: 'inter',
    defaultColors: { primary: '#2E251B' },
    planAccess: 'free',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    layout: 'minimal',
    defaultFont: 'inter',
    defaultColors: { primary: '#2E251B' },
    planAccess: 'free',
  },
  {
    id: 'bold',
    name: 'Bold',
    layout: 'bold',
    defaultFont: 'inter',
    defaultColors: { primary: '#2E251B' },
    planAccess: 'paid',
  },
];

export function getTemplate(id: string): InvoiceTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function templatesForPlan(plan: 'free' | 'paid'): InvoiceTemplate[] {
  if (plan === 'paid') return TEMPLATES;
  return TEMPLATES.filter((t) => t.planAccess === 'free');
}
