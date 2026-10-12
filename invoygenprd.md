# invoygen: Product Requirements Document

Version 1.0 (Draft) | 8 October 2026 | Owner: Founder
Stack: React with Next.js, Node.js with Express, and MongoDB, following the Full-Stack Project Blueprint & Prompt Sheet (v2.2)

---

## 1. Document Overview

**Purpose.** This PRD defines what invoygen is, who it serves, which pages and features ship in the first release, and how success is measured. It follows the founder's planning structure: a business one-pager first (name, logo, features), then pages, then features.

**Scope of v1.** Invoice generation: choose a template, customize it, sign it, download it, and manage it from a dashboard. Proposals and e-signature workflows are the platform vision and are planned as extensions (section 12).

**Conventions.** Items marked [Assumption] are proposals made while writing this PRD and need founder confirmation. Open decisions are collected in section 13. Code in the appendices is starter code: verify every dependency version (search the latest stable release and security advisories, confirm with `npm show <package> version`, then run `npm audit`) before adding it to `package.json`.

### 1.1 Project Snapshot

The core product decisions in one place.

| Item | Decision |
|---|---|
| Industry | Web: invoice generator |
| Brand name | invoygen |
| Color theme | #2E251B (warm dark brown) |
| Frontend | React with Next.js |
| Styling | Tailwind CSS |
| Backend | Node.js with Express |
| Authentication | Email-based only |
| Database | MongoDB |

---

## 2. Business One-Pager (Lead)

### 2.1 Name

invoygen. The wordmark is always written in lowercase.

### 2.2 Logo

- Concept: a clean geometric document with a check or signature stroke, paired with a lowercase geometric sans-serif wordmark.
- Four AI-prompt directions exist: dark, light, monogram/app icon, and bold gradient.
- The brand color theme is #2E251B (warm dark brown). The monogram/app icon uses it as a single solid color on a white rounded-square tile.
- Required deliverables before launch: horizontal lockup, icon-only mark, 32x32 favicon, light and dark variants, and a one-color version for use on invoices and documents.
- Final logo selection is an open decision (section 13).

### 2.3 Problem

Freelancers and small businesses often build invoices in word processors or spreadsheets. The results look inconsistent, invoice numbers drift, there is no clear view of what is draft versus sent, and adding a signature is awkward.

### 2.4 Solution and value proposition

invoygen lets a user create a professional, signed, tax-ready invoice in minutes: pick a template, customize fonts and colors, enter amounts, sign, and download. A dashboard tracks every invoice by status, and deleted invoices can be recovered for 30 days.

### 2.5 Target users

Freelancers, solo consultants, small agencies, and small business owners who invoice clients in any country.

### 2.6 Feature summary

| Feature | Summary |
|---|---|
| Dashboard | Recent invoices with status (draft, published, archive); trash with 30-day recovery |
| Invoice templates | Gallery to select a template |
| Create button | One-click entry point to start a new invoice |
| Login and signup | Email-based only |
| Customization | Font, color scheme, signature (font-based or drawn on canvas), editable amounts, all countries, tax percentage, download button, auto-incrementing invoice number |

### 2.7 Pricing summary

Two plans: a free plan and a $6 plan. Details and proposed limits are in section 5.5.

---

## 3. Goals, Non-Goals, and Success Metrics

### 3.1 Goals

1. A new user can create and download a first invoice in under 3 minutes.
2. Invoices look professional and consistent in preview and in the downloaded file.
3. Users can trust numbering, totals, and tax calculations.
4. Data is secure and recoverable (30-day trash).
5. The architecture can later support proposals and e-signature without a rewrite.

### 3.2 Non-goals for v1

- Google or other social login (email-based only).
- Collecting payments from clients.
- Country-specific legal e-invoicing compliance (for example government clearance systems).
- Proposal workflows and client-side e-signature.
- Team accounts, roles, and multi-user workspaces.
- Native mobile apps (the web app must be responsive).
- Recurring invoices.

### 3.3 Success metrics

| Metric | Target [Assumption] |
|---|---|
| Signup to first invoice created (same session) | 60% |
| Median time to first downloaded invoice | Under 3 minutes |
| Visitors to signup conversion | 5% |
| Free to paid conversion (90 days) | 3 to 5% |
| 30-day retention | 30% |
| Unhandled server errors | Under 0.5% of requests |

---

## 4. Users and User Stories

### 4.1 Personas

- **Freelancer (primary):** invoices a few clients each month, wants speed and a polished look.
- **Small business owner:** invoices regularly, cares about tax lines, numbering, and records.
- **International contractor:** bills clients in other countries and currencies.

### 4.2 User stories

1. As a visitor, I can understand the product and pricing from the home and pricing pages.
2. As a visitor, I can sign up and log in with only my email.
3. As a user, I can start a new invoice from a clearly visible Create button.
4. As a user, I can pick a template and see a live preview.
5. As a user, I can change the font and color scheme to match my brand.
6. As a user, I can enter or change amounts and see totals update instantly.
7. As a user, I can set a tax percentage and my country and currency.
8. As a user, I can add my signature by typing it in a script font or drawing it on a canvas.
9. As a user, I can download the invoice.
10. As a user, I get the next invoice number automatically.
11. As a user, I can see recent invoices and their status on my dashboard.
12. As a user, I can delete an invoice and recover it within 30 days.

---

## 5. Pages

### 5.0 Site map

- Public: Home, About, Contact us, Privacy policy, Pricing.
- Authentication: Sign up, Log in, Forgot/reset password.
- App (protected): Dashboard, Invoice editor, Trash, Account settings.

All public pages share the header and footer. The footer links to About, Contact us, Privacy policy, and Pricing.

### 5.1 Home

**Header**
- Logo (links to home), navigation links (About, Pricing, Contact us), Log in, and a primary Sign up button.
- Sticky on scroll; collapses to a menu on mobile; keyboard accessible.
- When logged in, shows Dashboard in place of Log in and Sign up.

**Hero**
- Headline stating the value (for example: create professional invoices in minutes).
- One-line subheading mentioning templates, signature, and download.
- Primary call to action: Create your first invoice (goes to signup). Secondary: See pricing.
- Visual: preview of an invoice template.
- Must load fast and be the largest contentful element within 2.5 seconds on a typical mobile connection.

### 5.2 About

Why invoygen exists, what it does today (invoices), and the direction (proposals and e-signature). Short, with the logo and a link to Contact us.

### 5.3 Contact us

- Form fields: name, email, subject, message. Validated with Zod on client and server.
- Spam protection: honeypot field and per-IP rate limiting on the public endpoint.
- On submit: store the message, email the founder via the email service, and show a confirmation. Error states use the standard error envelope.
- Show a support email address as a fallback.

### 5.4 Privacy policy

- Covers: data collected (email, name, invoice content, signatures), purpose, retention (including the 30-day trash window), cookies (the refresh-token cookie), third-party processors (hosting, email, error monitoring, payments), user rights (export and delete), and contact details.
- Linked from the footer and from the signup form.
- Must be reviewed by a qualified professional before launch.

### 5.5 Pricing

- A pricing table with a title, one column per plan, a feature comparison, and a call to action per plan.
- Plans from the sketch: **Free** and **$6 plan**. The sketch's first plan label is partly unclear; this PRD reads it as Free. [Assumption] The $6 is a monthly price.
- Proposed limits (to be confirmed):

| | Free | $6 plan |
|---|---|---|
| Invoices per month | 5 | Unlimited |
| Templates | 2 | All |
| Download | PDF with small invoygen footer | PDF without footer |
| Saved signature | 1 | Unlimited |
| Trash recovery | 30 days | 30 days |

- Billing provider and checkout flow are an open decision. Until billing is built, the paid plan can show Coming soon with a waitlist.

---

## 6. Features

### 6.1 Login and signup (email-based only)

**Requirements**
- Signup with name, email, and password. Login with email and password. Logout. Forgot and reset password via emailed one-time link.
- [Assumption] Email verification is required before an invoice can be downloaded.
- No Google or other social login in v1.
- Passwords hashed with bcrypt (cost factor 10 or higher). Account lockout after 5 failed attempts for 15 minutes.
- Access JWT valid for 15 minutes, sent in the Authorization header. Refresh token valid for 7 days in an HttpOnly, Secure, SameSite=Strict cookie, rotated on every refresh, hashed in the database. Reuse of a rotated token revokes all sessions for that user.
- Login and reset errors are generic to prevent email enumeration.

**Acceptance criteria**
- A new user can sign up, verify, and reach the dashboard.
- Protected routes redirect unauthenticated visitors to login.
- The access token lives in memory only, never in localStorage.

### 6.2 Dashboard

**Recent invoices**
- List of the user's invoices, newest first, showing number, client, amount and currency, issue date, and status.
- Statuses:
  - **Draft:** editable, not final.
  - **Published:** finalized; number locked; downloadable. [Assumption] To change it, the user duplicates it as a new draft.
  - **Archive:** hidden from the active list, read-only, restorable to Published.
- Filter by status, search by client or number, and sort by date or amount. Paginated.
- Row actions: open, duplicate, download, change status, move to trash.
- Empty state with a Create button and a short explanation.

**Trash with 30-day recovery**
- Deleting an invoice moves it to Trash (soft delete): sets the deleted time and a purge time 30 days later.
- Trash view lists deleted invoices with days remaining, Restore, and Delete forever (requires confirmation).
- Restored invoices return with their previous status and number.
- Invoices are permanently removed automatically after 30 days using a TTL index.
- Invoice numbers of trashed or purged invoices are never reused.

### 6.3 Invoice template selection

- A template gallery shows thumbnails rendered with sample data. [Assumption] At least 3 templates at launch.
- Selecting a template opens the editor with a live preview.
- A template can be changed later without losing entered data.
- Templates are defined as configuration (layout, default font, default colors) so new ones can be added without code changes to the editor.

### 6.4 Create button

- A persistent primary button on the dashboard header, plus a floating action button on mobile.
- Flow: Create, then choose a template, then the editor opens with a draft already created.
- Editor autosaves the draft and shows a saved indicator. Leaving the page never loses data.

### 6.5 Invoice customization

All eight customization items from the sketch are in scope for v1.

| # | Item | Requirements | Acceptance criteria |
|---|---|---|---|
| 1 | Invoice font | Curated list of 6 to 8 fonts. Applies to the whole invoice. Fonts embedded in the downloaded file. | Preview and download use the same font. |
| 2 | Color scheme | Preset palettes plus a custom hex color. Applies to headings, accents, and table header. Warn on low contrast. | Color changes show instantly in preview and in the download. |
| 3 | Signature | Two modes: font-based (type name, choose from several script fonts) and drawn on a canvas (mouse or touch, with clear and undo). Save a signature to the profile for reuse. Stored as a small image or vector; size limit 100 KB; sanitized on the server. | A signature drawn on a phone appears correctly in the download. |
| 4 | Changing value (amount) | Line items with description, quantity, and unit price; optional discount. Totals recalculate live. Money stored as integers in the currency's smallest unit; rounding rules defined per currency. | Editing any amount updates subtotal, tax, and total without a page reload. |
| 5 | All countries | Country list (ISO 3166) and currency list (ISO 4217). Number, date, and address formats follow the chosen country or locale. Tax label is editable (VAT, GST, Sales tax). Labels are in English for v1. [Assumption] | A user can invoice in any currency, and amounts show correct decimals and symbols. |
| 6 | Tax percentage | Invoice-level tax rate from 0 to 100 with up to 2 decimals and an editable label. [Assumption] Per-line tax rates are post-v1. | Tax amount equals the rate applied to the taxable subtotal and appears as its own line. |
| 7 | Invoice download button | Download as PDF. File name pattern: invoice-number plus client name. Layout identical to the preview. | The downloaded file opens correctly in common PDF viewers. |
| 8 | Auto-increment invoice number | Each user has a sequence based on their invoice history. Default format INV-0001 with an editable prefix. The next number is the highest number ever issued plus one, counting trashed and purged invoices. Incremented atomically so two simultaneous creations never share a number. The user may override a number; a duplicate returns a CONFLICT error. | Creating invoices in quick succession produces unique, sequential numbers. |

---

## 7. Data Model

All user-owned records carry a userId. Every query filters by userId and by the not-deleted flag, per the blueprint. Starter Mongoose schemas are in Appendix D.

| Entity | Key fields |
|---|---|
| User | name, email (unique), passwordHash, emailVerified, failedLoginCount, lockUntil, hashed refresh token(s), plan, defaults (country, currency, font, colors, prefix) |
| Invoice | userId, number (unique per user), status, templateId, issuer details, client details, line items, currency (ISO 4217), country, tax rate and label, subtotal, taxTotal, total (minor units), issueDate, dueDate, notes, font, colors, signature, deletedAt, purgeAt |
| InvoiceTemplate | id, name, layout config, default font and colors, plan access (configuration, not user data) |
| SavedSignature | userId, type (font or drawn), data, createdAt |
| InvoiceCounter | userId, lastNumber (atomic increment) |
| ContactMessage | name, email, subject, message, createdAt |

Indexes: unique (userId, number); index on (userId, status, createdAt); TTL index on purgeAt for trash.

---

## 8. API Surface (v1)

Base path `/api/v1`. Success responses use the `{ success: true, data }` envelope; errors use `{ success: false, error: { code, message, fields? } }`, as defined in the blueprint. Every endpoint gets full documentation using the blueprint's API template (example in Appendix H).

| Method and path | Auth | Purpose |
|---|---|---|
| POST /auth/signup | Public | Create account |
| POST /auth/login | Public | Log in; returns access token and sets refresh cookie |
| POST /auth/refresh | Cookie | Rotate refresh token, return new access token |
| POST /auth/logout | User | Clear cookie and stored token |
| POST /auth/verify-email | Public | Confirm email |
| POST /auth/forgot-password and /auth/reset-password | Public | Password reset |
| GET /users/me, PATCH /users/me | User | Read and update profile and defaults |
| GET /users/me/export, DELETE /users/me | User | Data export; account deletion with confirmation text |
| GET /templates | User | List templates |
| POST /invoices | User | Create draft (assigns next number) |
| GET /invoices | User | List with status filter, search, pagination |
| GET /invoices/:id, PATCH /invoices/:id | User | Read and update (autosave) |
| PATCH /invoices/:id/status | User | Draft, published, archive transitions |
| POST /invoices/:id/duplicate | User | Copy as new draft |
| GET /invoices/:id/download | User | Generate and return PDF |
| DELETE /invoices/:id | User | Move to trash |
| GET /invoices/trash | User | List trashed invoices |
| POST /invoices/:id/restore | User | Restore from trash |
| DELETE /invoices/:id/permanent | User | Delete forever (confirmation required) |
| GET, POST, DELETE /signatures | User | Manage saved signatures |
| POST /contact | Public, rate limited | Contact form |
| GET /health, GET /ready | Public | Liveness and readiness |

Error codes used from the blueprint: `VALIDATION_ERROR`, `INVALID_REQUEST`, `CONFIRM_TEXT_MISMATCH`, `UNAUTHORIZED`, `TOKEN_EXPIRED`, `TOKEN_INVALID`, `REFRESH_TOKEN_INVALID`, `NOT_FOUND` (also returned when a resource belongs to another user), `CONFLICT`, `RATE_LIMIT_EXCEEDED`, `INTERNAL_ERROR`.

---

## 9. Non-Functional Requirements

**Security (from the blueprint checklists)**
- Secrets only in environment variables, validated with Zod at startup. Separate JWT access and refresh secrets of at least 64 characters.
- helmet, explicit CORS allowlist, express-mongo-sanitize, express-rate-limit with strict limits on auth and public endpoints, JSON body limit of 10 KB (raise only on the signature route, as needed).
- Zod validation on every route. Ownership check on every controller; wrong-user access returns 404, never 403.
- Timing-safe token comparison. HTTPS only. No tokens, passwords, or raw personal data in logs. Sentry with data scrubbing.
- Frontend: token in memory only, DOMPurify for any user-supplied HTML, route guards, and an error boundary.

**Performance**
- Editor preview updates in under 100 ms after an input change.
- PDF generation completes in under 5 seconds.
- Public pages: largest contentful paint under 2.5 seconds on mobile.

**Accessibility and responsiveness**
- WCAG 2.2 AA for public pages and the editor, including keyboard operation and a non-drawing alternative for signatures (font-based).
- Fully usable on phone, tablet, and desktop.

**Privacy**
- Data export and account deletion available in settings. Trash purge honors the 30-day promise.
- Cookie and analytics use must match the privacy policy.

**Reliability and observability**
- Health and readiness endpoints, structured Winston logs, and Sentry alerts.

**SEO**
- Public pages need good metadata and indexability. Next.js renders these pages on the server or at build time, so they are indexable by default.

---

## 10. Technical Approach

Follows the blueprint with three changes: Next.js replaces the Vite single-page setup, Tailwind CSS handles styling, and authentication is email-based only.

- **Stack:** Frontend: React with Next.js, styled with Tailwind CSS. Backend: Node.js (current Active LTS) with Express and TypeScript in strict mode. Authentication: email-based only. Database: MongoDB (Atlas) with Mongoose. Supporting libraries: Zod, TanStack Query, Axios, React Hook Form with Zod, DOMPurify. Deploy: Vercel (frontend), Render or Railway (backend), MongoDB Atlas (database).
- **Dependency rule:** never copy version numbers from documents. Before writing package.json, search for each package's latest stable version and security advisories, confirm with npm show, then run npm audit and fix high or critical findings.
- **Backend modules:** auth, users, invoices, templates, signatures, contact (billing added later). Each has routes, controller, service, schema, and model where applicable.
- **Frontend features:** auth, dashboard, invoice editor, templates, signatures, trash, marketing pages.
- **Money handling:** integer minor units end to end; calculation logic shared and unit-tested (Appendix F).
- **PDF:** the engine is an open decision; the download must match the on-screen preview.
- **Deliverables:** .env.example for backend and frontend, root .gitignore, .cursorignore, README with setup and CI steps, Postman collection and environment under backend/postman, strict tsconfig, and per-endpoint API documentation.
- **CI baseline:** npm ci, typecheck, tests, and npm audit.

---

## 11. Release Plan

| Milestone | Scope | Exit criteria |
|---|---|---|
| M0 Foundations | Repo, env validation, CI, health endpoints, logo and brand assets | CI green; app boots in all environments |
| M1 Auth | Signup, login, verification, reset, sessions | Security checklist for auth passes |
| M2 Invoice core | Templates, editor, line items, tax, numbering, status | Create and edit invoices end to end |
| M3 Customization and output | Fonts, colors, signature, countries and currencies, PDF download | Preview and PDF match |
| M4 Dashboard and trash | Lists, filters, trash, restore, auto-purge | 30-day recovery verified |
| M5 Marketing and pricing | Home, About, Contact us, Privacy policy, Pricing | Pages live and linked |
| M6 Hardening and launch | Security review, load and accessibility checks, monitoring, docs | All checklists pass; launch approved |

---

## 12. Roadmap: Platform Expansion

The platform vision is invoices, proposals, and signatures in one product. Planned after v1:

1. Send invoices by email and track whether they were viewed.
2. Proposals: create, send by link, and let a client accept.
3. Client e-signature with an audit trail (who, when, from where).
4. Payment links and payment status.
5. Recurring invoices and reminders.
6. Team accounts, Google sign-in, and multiple languages.

The data model and API are designed so proposals and signatures reuse templates, customization, and the signature component.

---

## 13. Risks, Assumptions, and Open Questions

### 13.1 Risks

| Risk | Mitigation |
|---|---|
| Tax and invoice rules differ by country | State clearly that v1 does not guarantee local legal compliance; add a disclaimer |
| Preview and PDF drift apart | Single rendering source and visual regression tests |
| Duplicate invoice numbers under concurrency | Atomic counter and unique index |
| Stored signatures are sensitive | Size limit, sanitization, encrypted transport, deletion on account removal |
| Spam on the public contact form | Honeypot and rate limiting |

### 13.2 Open questions

1. Final plan names and limits (the sketch's first plan label is unclear; this PRD assumes Free).
2. Is $6 monthly, yearly, or both? Which billing provider?
3. Should published invoices be editable, or only duplicated?
4. Is email verification required before download?
5. Which PDF generation approach, and does the free plan carry a footer?
6. Per-line tax versus invoice-level tax, and tax-inclusive pricing.
7. Which logo direction is final?
8. Which Next.js rendering mode for each page (static for marketing pages, server or client for the app)?
9. Who reviews the privacy policy before launch?

---

## 14. Launch Checklist

- [ ] All pages in section 5 live with working navigation.
- [ ] All eight customization items work and are covered by tests.
- [ ] Trash recovery and automatic purge verified.
- [ ] Backend and frontend security checklists completed.
- [ ] npm audit shows no high or critical issues.
- [ ] Postman collection and API docs complete.
- [ ] Privacy policy reviewed and published.
- [ ] Monitoring and alerts active.

---

# Appendices: Required Code

> Starter code only. Run it through your own review, add tests, and verify every package version before use (see section 10).

## Appendix A. Repository Structure

```
invoygen/
├── backend/
│   ├── src/
│   │   ├── server.ts                 # DB connect → listen
│   │   ├── app.ts                    # middleware stack + route mounts
│   │   ├── config/
│   │   │   ├── env.ts                # Zod-validated env, crash on bad config
│   │   │   └── db.ts                 # mongoose connect/disconnect
│   │   ├── middleware/
│   │   │   ├── requireAuth.ts
│   │   │   ├── validate.ts
│   │   │   └── errorHandler.ts
│   │   ├── modules/
│   │   │   ├── auth/        (routes, controller, service, schema)
│   │   │   ├── users/       (routes, controller, service, model, schema)
│   │   │   ├── invoices/    (routes, controller, service, model, schema, calc.ts)
│   │   │   ├── templates/
│   │   │   ├── signatures/
│   │   │   └── contact/
│   │   ├── services/
│   │   │   ├── email.service.ts
│   │   │   └── pdf.service.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── ownershipCheck.ts
│   │   │   └── tokenCompare.ts
│   │   └── types/express.d.ts
│   ├── postman/ (collection.json, environment.json)
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json                 # strict mode
├── frontend/
│   ├── src/
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── (marketing)/          # page.tsx (home), about, contact, privacy, pricing
│   │   │   ├── (auth)/               # login, signup, forgot-password, reset-password
│   │   │   └── (app)/                # dashboard, invoices/new, invoices/[id], trash, settings
│   │   ├── components/               # Header, Hero, PricingTable, InvoicePreview, SignaturePad
│   │   ├── features/                 # invoices, templates, signatures (api.ts, components, types.ts)
│   │   ├── lib/
│   │   │   ├── env.ts                # NEXT_PUBLIC_* Zod validation
│   │   │   └── api/ (client.ts, refreshClient.ts)
│   │   └── auth/ (AuthProvider.tsx, tokenStore.ts)
│   ├── tailwind.config.ts
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── PROJECT_BLUEPRINT.md
│   └── invoygen-PRD.md
└── .gitignore
```

## Appendix B. Environment Variables

`backend/.env.example`

```bash
# ── Server ──────────────────────────────────────────────
NODE_ENV=development
PORT=5000

# ── Database ────────────────────────────────────────────
# Production: mongodb+srv://<user>:<pass>@cluster.mongodb.net/invoygen
MONGODB_URI=mongodb://127.0.0.1:27017/invoygen

# ── JWT (different secrets, each at least 64 chars) ─────
# Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_ACCESS_SECRET=replace-me
JWT_REFRESH_SECRET=replace-me-with-a-different-value
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# ── Frontend / CORS (comma-separated for multiple origins) ──
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000

# ── Email (Nodemailer / SMTP provider) ──────────────────
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=replace-me
SMTP_PASS=replace-me
EMAIL_FROM="invoygen <no-reply@example.com>"
CONTACT_INBOX=founder@example.com

# ── Monitoring ──────────────────────────────────────────
SENTRY_DSN=
```

`frontend/.env.example`

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`backend/src/config/env.ts`

```ts
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(64),
  JWT_REFRESH_SECRET: z.string().min(64),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  FRONTEND_URL: z.string().url(),
  CORS_ORIGINS: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
  CONTACT_INBOX: z.string().email(),
  SENTRY_DSN: z.string().optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1); // crash on startup if misconfigured
}

export const env = parsed.data;
```

## Appendix C. Tailwind Theme (Color #2E251B)

`frontend/tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2E251B', // invoygen primary (warm dark brown)
          foreground: '#FFFFFF',
        },
        surface: '#F7F3EE', // warm off-white used for tiles and backgrounds
      },
    },
  },
  plugins: [],
};

export default config;
```

If your Tailwind version uses CSS-first configuration, define the same tokens in your global stylesheet instead:

```css
@theme {
  --color-brand: #2E251B;
  --color-brand-foreground: #FFFFFF;
  --color-surface: #F7F3EE;
}
```

## Appendix D. Mongoose Models

`backend/src/modules/invoices/invoice.model.ts`

```ts
import { Schema, model, Types } from 'mongoose';

export const INVOICE_STATUSES = ['draft', 'published', 'archive'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

const lineItemSchema = new Schema(
  {
    description: { type: String, required: true, maxlength: 500 },
    quantity: { type: Number, required: true, min: 0 },
    unitPriceMinor: { type: Number, required: true, min: 0 }, // integer, smallest currency unit
  },
  { _id: false },
);

const invoiceSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    number: { type: String, required: true },           // e.g. INV-0001
    sequence: { type: Number, required: true },         // numeric counter value used for auto numbers
    status: { type: String, enum: INVOICE_STATUSES, default: 'draft' },
    templateId: { type: String, required: true },

    issuer: { name: String, email: String, address: String, taxId: String },
    client: { name: String, email: String, address: String, taxId: String },

    country: { type: String, required: true },          // ISO 3166
    currency: { type: String, required: true },         // ISO 4217
    lineItems: { type: [lineItemSchema], default: [] },
    discountMinor: { type: Number, default: 0, min: 0 },
    taxRate: { type: Number, default: 0, min: 0, max: 100 }, // percent, up to 2 decimals
    taxLabel: { type: String, default: 'Tax' },

    subtotalMinor: { type: Number, default: 0 },
    taxTotalMinor: { type: Number, default: 0 },
    totalMinor: { type: Number, default: 0 },

    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    notes: { type: String, maxlength: 2000 },

    font: { type: String, default: 'inter' },
    colorScheme: { primary: { type: String, default: '#2E251B' } },
    signature: { type: { type: String, enum: ['font', 'drawn'] }, data: String }, // data: text or sanitized SVG/PNG data

    // Trash (soft delete, recoverable for 30 days)
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    purgeAt: { type: Date },
    statusBeforeDelete: { type: String, enum: INVOICE_STATUSES },
  },
  { timestamps: true },
);

invoiceSchema.index({ userId: 1, number: 1 }, { unique: true });
invoiceSchema.index({ userId: 1, status: 1, createdAt: -1 });
// TTL: MongoDB removes the document once purgeAt has passed (30 days after delete)
invoiceSchema.index({ purgeAt: 1 }, { expireAfterSeconds: 0 });

export const Invoice = model('Invoice', invoiceSchema);
```

`backend/src/modules/invoices/invoiceCounter.model.ts`

```ts
import { Schema, model, Types } from 'mongoose';

const invoiceCounterSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
  lastNumber: { type: Number, default: 0 },
});

export const InvoiceCounter = model('InvoiceCounter', invoiceCounterSchema);
```

`backend/src/modules/users/user.model.ts`

```ts
import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    emailVerified: { type: Boolean, default: false },
    failedLoginCount: { type: Number, default: 0 },
    lockUntil: { type: Date },
    refreshTokenHashes: { type: [String], default: [], select: false }, // bcrypt-hashed
    plan: { type: String, enum: ['free', 'paid'], default: 'free' },
    defaults: {
      country: String,
      currency: String,
      font: String,
      primaryColor: { type: String, default: '#2E251B' },
      invoicePrefix: { type: String, default: 'INV' },
    },
  },
  { timestamps: true },
);

export const User = model('User', userSchema);
```

## Appendix E. Zod Schemas

`backend/src/modules/auth/auth.schema.ts`

```ts
import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(10).max(128), // [Assumption] minimum length
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1).max(128),
  }),
});
```

`backend/src/modules/invoices/invoice.schema.ts`

```ts
import { z } from 'zod';

const lineItem = z.object({
  description: z.string().trim().min(1).max(500),
  quantity: z.number().min(0),
  unitPriceMinor: z.number().int().min(0),
});

export const updateInvoiceSchema = z.object({
  params: z.object({ id: z.string().length(24) }),
  body: z
    .object({
      number: z.string().trim().min(1).max(50),
      templateId: z.string(),
      country: z.string().length(2),
      currency: z.string().length(3),
      lineItems: z.array(lineItem).max(200),
      discountMinor: z.number().int().min(0),
      taxRate: z.number().min(0).max(100).multipleOf(0.01),
      taxLabel: z.string().trim().max(30),
      font: z.string(),
      colorScheme: z.object({ primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/) }),
      notes: z.string().max(2000),
    })
    .partial(),
});

export const statusSchema = z.object({
  params: z.object({ id: z.string().length(24) }),
  body: z.object({ status: z.enum(['draft', 'published', 'archive']) }),
});
```

## Appendix F. Invoice Number and Totals Logic

`backend/src/modules/invoices/invoiceNumber.ts`

```ts
import { InvoiceCounter } from './invoiceCounter.model';

/**
 * Atomically allocate the next sequence for a user.
 * $inc on a single document is atomic, so two simultaneous requests never receive the same value.
 * The counter is never decremented, so numbers of trashed or purged invoices are not reused.
 */
export async function allocateInvoiceNumber(userId: string, prefix = 'INV') {
  const counter = await InvoiceCounter.findOneAndUpdate(
    { userId },
    { $inc: { lastNumber: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  const sequence = counter.lastNumber;
  return { sequence, number: `${prefix}-${String(sequence).padStart(4, '0')}` };
}
```

`backend/src/modules/invoices/calc.ts` (shared with the frontend preview)

```ts
export interface LineItem {
  quantity: number;
  unitPriceMinor: number; // integer, smallest currency unit (cents, paise, ...)
}

export interface Totals {
  subtotalMinor: number;
  taxTotalMinor: number;
  totalMinor: number;
}

/**
 * Money is integers in minor units end to end.
 * taxRate is a percent with up to 2 decimals (e.g. 18.5), converted to basis points to avoid float drift.
 */
export function calcTotals(items: LineItem[], taxRate: number, discountMinor = 0): Totals {
  const lineTotals = items.map((i) => Math.round(i.quantity * i.unitPriceMinor));
  const subtotalMinor = lineTotals.reduce((sum, v) => sum + v, 0);
  const taxable = Math.max(0, subtotalMinor - discountMinor);
  const basisPoints = Math.round(taxRate * 100);
  const taxTotalMinor = Math.round((taxable * basisPoints) / 10000);
  return { subtotalMinor, taxTotalMinor, totalMinor: taxable + taxTotalMinor };
}

/** Display helper: use the currency's own decimals and symbol via Intl. */
export function formatMoney(minor: number, currency: string, locale = 'en-US') {
  const digits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions()
    .maximumFractionDigits;
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(minor / 10 ** digits);
}
```

Unit test starter (`calc.test.ts`):

```ts
import { calcTotals } from './calc';

test('applies tax to the discounted subtotal', () => {
  const t = calcTotals([{ quantity: 2, unitPriceMinor: 5000 }], 10, 1000);
  expect(t).toEqual({ subtotalMinor: 10000, taxTotalMinor: 900, totalMinor: 9900 });
});
```

Trash (soft delete, restore) service logic:

```ts
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function moveToTrash(userId: string, id: string) {
  const invoice = await Invoice.findOne({ _id: id, userId, isDeleted: false });
  if (!invoice) throw new AppError(404, 'NOT_FOUND', 'Invoice not found'); // also covers other users' invoices
  invoice.statusBeforeDelete = invoice.status;
  invoice.isDeleted = true;
  invoice.deletedAt = new Date();
  invoice.purgeAt = new Date(Date.now() + THIRTY_DAYS_MS);
  await invoice.save();
}

export async function restoreFromTrash(userId: string, id: string) {
  const invoice = await Invoice.findOne({ _id: id, userId, isDeleted: true });
  if (!invoice) throw new AppError(404, 'NOT_FOUND', 'Invoice not found');
  invoice.isDeleted = false;
  invoice.deletedAt = undefined;
  invoice.purgeAt = undefined; // clearing purgeAt removes it from the TTL index
  invoice.status = invoice.statusBeforeDelete ?? 'draft';
  await invoice.save();
}
```

## Appendix G. Express App, Errors, and Security Middleware

`backend/src/app.ts`

```ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/users/user.routes';
import { invoiceRoutes } from './modules/invoices/invoice.routes';
import { templateRoutes } from './modules/templates/template.routes';
import { signatureRoutes } from './modules/signatures/signature.routes';
import { contactRoutes } from './modules/contact/contact.routes';

export const app = express();

// Middleware order (blueprint): [Sentry request handler] → helmet → cors → body limit → sanitize → rate limit → routes → errors
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGINS.split(',').map((o) => o.trim()), // explicit allowlist, never * with credentials
    credentials: true,
  }),
);
app.use(express.json({ limit: '10kb' })); // raise only on the signature route if needed
app.use(cookieParser());
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5 });

app.get('/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/signatures', signatureRoutes);
app.use('/api/v1/contact', contactLimiter, contactRoutes);

app.use(errorHandler);
```

`backend/src/middleware/errorHandler.ts`

```ts
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: Record<string, string[]>,
  ) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', fields: err.flatten().fieldErrors },
    });
  }
  if (err instanceof AppError) {
    return res
      .status(err.status)
      .json({ success: false, error: { code: err.code, message: err.message, fields: err.fields } });
  }
  // Log without secrets or raw personal data; report to Sentry here
  return res
    .status(500)
    .json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } });
};
```

`backend/src/middleware/validate.ts`

```ts
import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

export const validate =
  (schema: ZodTypeAny): RequestHandler =>
  (req, _res, next) => {
    const result = schema.parse({ body: req.body, query: req.query, params: req.params });
    req.body = result.body ?? req.body;
    next();
  };
```

`backend/src/utils/ownershipCheck.ts`

```ts
import { AppError } from '../middleware/errorHandler';

// Always 404 (never 403) so users cannot probe for other users' resources
export function assertOwnership<T extends { userId: unknown }>(doc: T | null, userId: string): T {
  if (!doc || String(doc.userId) !== userId) {
    throw new AppError(404, 'NOT_FOUND', 'Resource not found');
  }
  return doc;
}
```

## Appendix H. API Documentation Example (Blueprint Template)

### POST /api/v1/invoices

Creates a draft invoice for the authenticated user and assigns the next invoice number.

**Auth:** `Authorization: Bearer <access token>`

#### Request

```json
{
  "templateId": "classic",
  "country": "IN",
  "currency": "INR"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| templateId | string | Yes | Must exist in the template list |
| country | string | Yes | ISO 3166 alpha-2 |
| currency | string | Yes | ISO 4217 alpha-3 |

#### Response: 201 Created

```json
{
  "success": true,
  "data": {
    "invoice": {
      "id": "665f1c2a9b1e4a0012ab34cd",
      "number": "INV-0001",
      "status": "draft",
      "templateId": "classic",
      "country": "IN",
      "currency": "INR",
      "lineItems": [],
      "subtotalMinor": 0,
      "taxTotalMinor": 0,
      "totalMinor": 0
    }
  }
}
```

#### Response: 400 Validation Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "fields": { "currency": ["String must contain exactly 3 character(s)"] }
  }
}
```

#### Response: 401 Unauthorized

```json
{ "success": false, "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }
```

#### Business rules

- The number comes from the atomic counter (Appendix F) and is never reused.
- Free plan limit (if confirmed in section 5.5): returns `INVALID_REQUEST` when the monthly invoice limit is reached.

## Appendix I. Frontend Starters (Next.js)

`frontend/src/lib/env.ts`

```ts
import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = schema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
```

`frontend/src/auth/tokenStore.ts`

```ts
// Access token lives in memory only: never localStorage or sessionStorage
let accessToken: string | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token;
  },
};
```

`frontend/src/lib/api/client.ts`

```ts
import axios from 'axios';
import { env } from '../env';
import { tokenStore } from '../../auth/tokenStore';
import { refreshClient } from './refreshClient';

export const api = axios.create({ baseURL: env.NEXT_PUBLIC_API_BASE_URL, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string> | null = null; // single-flight refresh

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.data?.error?.code === 'TOKEN_EXPIRED' && !original._retried) {
      original._retried = true;
      refreshing ??= refreshClient
        .post('/auth/refresh')
        .then((r) => r.data.data.accessToken as string)
        .finally(() => {
          refreshing = null;
        });
      const token = await refreshing;
      tokenStore.set(token);
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    }
    return Promise.reject(error);
  },
);
```

`frontend/src/lib/api/refreshClient.ts`

```ts
import axios from 'axios';
import { env } from '../env';

// Separate instance with no interceptors, so a failed refresh cannot loop
export const refreshClient = axios.create({ baseURL: env.NEXT_PUBLIC_API_BASE_URL, withCredentials: true });
```

Signature pad (drawn on canvas) starter, `frontend/src/components/SignaturePad.tsx`:

```tsx
'use client';
import { useRef, useState } from 'react';

export function SignaturePad({ onSave }: { onSave: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = point(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = point(e);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2E251B';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clear = () => {
    const c = canvasRef.current!;
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height);
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={480}
        height={160}
        className="w-full touch-none rounded border border-brand/30 bg-white"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={() => setDrawing(false)}
        onPointerLeave={() => setDrawing(false)}
      />
      <div className="flex gap-2">
        <button type="button" onClick={clear} className="rounded border px-3 py-1">
          Clear
        </button>
        <button
          type="button"
          onClick={() => onSave(canvasRef.current!.toDataURL('image/png'))}
          className="rounded bg-brand px-3 py-1 text-brand-foreground"
        >
          Use signature
        </button>
      </div>
    </div>
  );
}
```

Server note: validate the saved signature on the backend (allowed type, size of 100 KB or less) before storing it.