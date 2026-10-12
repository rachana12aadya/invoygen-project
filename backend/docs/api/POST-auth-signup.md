### POST /api/v1/auth/signup

Creates an account and starts a session. Sends a verification email. Download stays blocked until the email is verified.

**Auth:** Public

#### Request

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "supersecret1"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| name | string | Yes | 1–100 characters |
| email | string | Yes | Unique, lowercased |
| password | string | Yes | 10–128 characters |

#### Response: 201 Created

```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "Ada Lovelace", "email": "ada@example.com", "emailVerified": false, "plan": "free" },
    "accessToken": "<jwt>"
  }
}
```

Sets `refreshToken` HttpOnly cookie.

Duplicate emails return `CONFLICT` without confirming whether the address exists beyond that conflict.
