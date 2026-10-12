### GET /api/v1/users/me

### PATCH /api/v1/users/me

Optional `name` and `defaults` (country, currency, font, primaryColor, invoicePrefix).

### GET /api/v1/users/me/export

User profile, invoices, and saved signatures.

### DELETE /api/v1/users/me

Body `{ "confirmation": "DELETE" }`. Removes invoices, signatures, sessions, and the user.

### GET /api/v1/templates

Free plan: `classic`, `minimal`. Paid: also `bold`.

### GET /api/v1/signatures

### POST /api/v1/signatures

`{ "type": "font"|"drawn", "data": "..." }` max 100 KB. Drawn signatures must be `data:image/...` URLs.

### DELETE /api/v1/signatures/:id

### POST /api/v1/contact

Public. Fields: name, email, subject, message. Honeypot field `company`: if filled, returns success and stores nothing.

### POST /api/v1/auth/refresh

Cookie only. Rotates refresh token. Reuse of a rotated token revokes **all** sessions for that user (`REFRESH_TOKEN_INVALID`).

### POST /api/v1/auth/logout

Bearer access token. Revokes all refresh sessions and clears the cookie.

### POST /api/v1/auth/verify-email

`{ "token": "..." }`

### POST /api/v1/auth/forgot-password

Always `{ message: "If an account exists for that email, a reset link has been sent" }`.

### POST /api/v1/auth/reset-password

`{ "token", "password" }`. Revokes all sessions.
