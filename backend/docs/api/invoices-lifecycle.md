### GET /api/v1/invoices

Query: `status`, `q` (client name or number), `sort=date|amount`, `order=asc|desc`, `page`, `limit`.

Excludes trashed invoices. Filtered by `userId`.

### GET /api/v1/invoices/:id

Returns `NOT_FOUND` if missing **or** owned by another user.

### PATCH /api/v1/invoices/:id

Autosave. Drafts only. Recalculates totals. Duplicate `number` → `CONFLICT`.

### PATCH /api/v1/invoices/:id/status

Allowed transitions: draft → published|archive; published → archive; archive → published.

### POST /api/v1/invoices/:id/duplicate

New draft with the next invoice number and copied content.

### GET /api/v1/invoices/:id/download

Requires verified email. PDF. Free plan includes an invoygen footer. Filename: `invoice-{number}-{client}.pdf`.

### DELETE /api/v1/invoices/:id

Soft delete (30-day trash / TTL on `purgeAt`).

### GET /api/v1/invoices/trash

### POST /api/v1/invoices/:id/restore

Restores previous status and the same number.

### DELETE /api/v1/invoices/:id/permanent

Body `{ "confirmation": "DELETE" }` or `CONFIRM_TEXT_MISMATCH`.
