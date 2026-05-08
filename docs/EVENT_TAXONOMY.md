# ORBIT Website Event Reference

Internal implementation reference for the Netlify Functions and Braze workspace.

## Entry events

| Event | Source |
|---|---|
| `submit_waitlist` | Early access form submit |
| `complete_preference_quiz` | Preference values submitted with early access form |
| `update_preference` | Preference Passport saved after a profile exists |

## Service surface events

| Surface | Event | Source |
|---|---|---|
| Stories | `view_story` | Preview story button |
| Stories | `save_creator` | Save creator button |
| Pass | `click_membership_cta` | See Pass benefits button |
| Pass | `request_pass_invite` | Request invite button |
| Market | `view_market_drop` | View drop button |
| Market | `add_to_cart` | Add to cart button |
| Live | `view_live_event` | View event button |
| Live | `rsvp_popup` | RSVP interest button |
| Rewards | `view_reward_mission` | View mission button |
| Rewards | `complete_mission` | Complete mission button |
