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
| templateId | string | Yes | Must exist and be allowed on the user's plan |
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

- The number comes from the atomic counter and is never reused.
- Free plan: `INVALID_REQUEST` when the monthly invoice limit (5) is reached.
- Totals are always recalculated on the server in integer minor units.
