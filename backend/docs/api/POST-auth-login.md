### POST /api/v1/auth/login

**Auth:** Public

#### Request

```json
{ "email": "ada@example.com", "password": "supersecret1" }
```

#### Response: 200

```json
{ "success": true, "data": { "user": { "id": "..." }, "accessToken": "<jwt>" } }
```

Sets rotating `refreshToken` cookie.

#### Errors

- `401 UNAUTHORIZED` with message `Invalid email or password` for unknown users, bad passwords, and lockouts (5 failures lock 15 minutes).
- `429 RATE_LIMIT_EXCEEDED` after too many attempts from one IP.
