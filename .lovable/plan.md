## ✅ Completed: Secure API Endpoint for External Data Contributions

The `add-place` edge function is live and secured with the `CURATOR_API_KEY` secret.

### Endpoint

```
POST https://twhclpffynyltkxprfij.supabase.co/functions/v1/add-place
Headers:
  x-api-key: <CURATOR_API_KEY>
  Content-Type: application/json
```

### Required Fields
- `id` (string) — URL-friendly slug
- `name` (string)
- `lat` (number)
- `lng` (number)
- `time_layers` (string array) — e.g. ["past"], ["present", "future"]
- `description` (string)

### Optional Fields
- `address`, `thumbnail`, `photo_credit`, `drawing`, `drawing_credit`, `audio` (JSONB), `links` (JSONB), `sort_order` (integer)

### Behavior
- Uses **upsert** on `id` — sending an existing ID updates that place
- Returns 401 on invalid/missing API key
- Returns 400 on missing required fields
- Returns the inserted/updated place on success
