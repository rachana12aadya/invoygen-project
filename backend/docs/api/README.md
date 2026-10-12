# invoygen API

Base path: `/api/v1`

Success envelope: `{ "success": true, "data": ... }`  
Error envelope: `{ "success": false, "error": { "code", "message", "fields?" } }`

Auth for user routes: `Authorization: Bearer <access token>`.  
Refresh token is an HttpOnly cookie named `refreshToken` (path `/api/v1/auth/refresh`).

Error codes: `VALIDATION_ERROR`, `INVALID_REQUEST`, `CONFIRM_TEXT_MISMATCH`, `UNAUTHORIZED`, `TOKEN_EXPIRED`, `TOKEN_INVALID`, `REFRESH_TOKEN_INVALID`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMIT_EXCEEDED`, `INTERNAL_ERROR`.

| Method | Path | Auth |
|---|---|---|
| GET | /health | Public |
| GET | /ready | Public |
| POST | /api/v1/auth/signup | Public |
| POST | /api/v1/auth/login | Public |
| POST | /api/v1/auth/refresh | Cookie |
| POST | /api/v1/auth/logout | User |
| POST | /api/v1/auth/verify-email | Public |
| POST | /api/v1/auth/forgot-password | Public |
| POST | /api/v1/auth/reset-password | Public |
| GET, PATCH | /api/v1/users/me | User |
| GET | /api/v1/users/me/export | User |
| DELETE | /api/v1/users/me | User |
| GET | /api/v1/templates | User |
| POST, GET | /api/v1/invoices | User |
| GET, PATCH, DELETE | /api/v1/invoices/:id | User |
| PATCH | /api/v1/invoices/:id/status | User |
| POST | /api/v1/invoices/:id/duplicate | User |
| GET | /api/v1/invoices/:id/download | User |
| GET | /api/v1/invoices/trash | User |
| POST | /api/v1/invoices/:id/restore | User |
| DELETE | /api/v1/invoices/:id/permanent | User |
| GET, POST | /api/v1/signatures | User |
| DELETE | /api/v1/signatures/:id | User |
| POST | /api/v1/contact | Public |
