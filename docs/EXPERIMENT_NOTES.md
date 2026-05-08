# Experiment Notes

This website creates the data surface for the Braze experiment. It does not claim performance lift by itself.

## What can be actual

- Waitlist form submissions
- Preference data
- Braze user profile creation/update
- Braze custom events
- Canvas entry event
- Treatment/holdout assignment inside Braze
- Observed conversion counts

## What should not be claimed without enough sample size

- Statistically meaningful lift
- Incremental revenue
- Long-term retention improvement

## Local Event Log

The Local Event Log is for admin QA only and appears with:

```text
?debug=orbit-admin
```

Clearing it deletes only browser localStorage. It does not delete Netlify submissions or Braze data already sent.
