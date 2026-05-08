# Braze Canvas Setup

## Canvas name

ORBIT First 7 Days Onboarding Canvas

## Entry event

`submit_waitlist`

## Target audience

- email is not blank
- `email_marketing_opt_in = true`
- `orbit_canvas_candidate = true`
- `lifecycle_stage = new_explorer`
- `is_internal_test_user = false`

## Experiment split

Configure inside Braze Canvas, not in frontend JavaScript.

Recommended for a real pilot:

- If opt-in users are under 1,000: 50% treatment / 50% holdout
- If opt-in users are 1,000-3,000: 70% treatment / 30% holdout or 50/50
- If opt-in users are over 3,000: 80/20 or 90/10 can be considered

## Treatment path

- Day 0: Welcome email
- Day 2: Preference-based story recommendation email
- Day 5: Pass interest email for users with story or membership signals

## Holdout path

- No onboarding email
- Still track conversion events from the website

## Primary conversion

`view_story`

## Secondary conversions

- `complete_preference_quiz`
- `click_membership_cta`
- `add_to_cart`
- `view_market_drop`
- `view_live_event`
- `rsvp_popup`
- `view_reward_mission`
- `complete_mission`

## Guardrail metrics

- unsubscribe
- spam complaint
- email bounce
- high frequency complaints
