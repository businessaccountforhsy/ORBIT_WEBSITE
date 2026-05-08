# Payload Examples

## Waitlist payload from website to Netlify Function

```json
{
  "email": "user@example.com",
  "display_name": "Reader",
  "first_content_preference": "thriller",
  "email_rhythm": "3_over_7_days",
  "email_marketing_opt_in": true,
  "project_acknowledgement": true,
  "selected_interests": "stories,market,live",
  "tone_preference": "quiet_direct",
  "format_preference": "story_preview",
  "source": "instagram_story",
  "utm_source": "instagram",
  "utm_medium": "story",
  "utm_campaign": "orbit_first_7d_test"
}
```

## Conversion event payload

```json
{
  "event_name": "add_to_cart",
  "external_id": "orbit_xxxxxxxxxxxxxxxx",
  "properties": {
    "product_id": "blackout_casebook",
    "product_name": "Blackout Broadcast Casebook",
    "cart_size": 1
  }
}
```
