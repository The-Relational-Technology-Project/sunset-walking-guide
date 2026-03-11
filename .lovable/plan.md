

## Plan: Secure API Endpoint for External Data Contributions

### What We're Building

A backend function that Claude can call with a private API key to insert new places into the database. This keeps the database secure while giving Claude a clean interface to add entries.

### Approach

1. **Generate and store a private API key** as a backend secret (`CURATOR_API_KEY`). You'll create a strong random key and we'll store it securely.

2. **Create a backend function (`add-place`)** that:
   - Accepts POST requests with place data (name, lat, lng, description, time_layers, address, thumbnail, etc.)
   - Validates the `x-api-key` header against the stored `CURATOR_API_KEY`
   - Returns 401 if the key is wrong
   - Uses the service role client to bypass RLS and insert directly into the `places` table
   - Validates required fields and returns clear error messages

3. **No RLS changes needed** — the edge function will use the service role key (already available as a built-in secret), which bypasses RLS entirely. The existing "no public INSERT" policy stays intact, keeping the table locked down from the client side.

### How Claude Will Use It

```
POST https://twhclpffynyltkxprfij.supabase.co/functions/v1/add-place
Headers:
  x-api-key: <CURATOR_API_KEY>
  Content-Type: application/json

Body:
{
  "id": "serra-house",
  "name": "The Serra House",
  "lat": 37.7637,
  "lng": -122.5040,
  "time_layers": ["past"],
  "description": "...",
  "address": "2351 43rd Avenue (historical)",
  "thumbnail": "/placeholder.svg"
}
```

Optional fields: `photo_credit`, `drawing`, `drawing_credit`, `audio`, `links`, `sort_order`.

### Steps

1. Ask you to set the `CURATOR_API_KEY` secret (you generate a strong random string)
2. Create the `add-place` edge function with key validation and insertion logic
3. Update `supabase/config.toml` to register the function with `verify_jwt = false`

