# ORBIT Braze Experiment Site

A fictional ORBIT service website for a student CRM portfolio project. It is designed as a Netlify + Braze-ready experiment surface, not as a static demo-only page.

## What this site includes

- Monochrome public website for ORBIT's five service surfaces: Stories, Pass, Market, Live, Rewards
- Preference Passport modal
- Early access / waitlist form
- Netlify Forms backup collection
- Netlify Functions backend
- Braze `/users/track` integration
- Canvas entry event: `submit_waitlist`
- Conversion events mapped to visible UI actions only
- Admin-only Local Event Log via `?debug=orbit-admin`

## Important

Treatment / holdout assignment is intentionally not randomized in frontend code. It should be configured inside Braze Canvas using Experiment Paths or a Control Group. The public site sends entry and conversion events; Braze owns the experiment split.

## Local testing

Static file preview shows the UI only. For serverless functions, run:

```bash
netlify dev
```

or deploy to Netlify and set environment variables.

## Environment variables

```text
BRAZE_REST_API_KEY=your-braze-rest-api-key
BRAZE_REST_ENDPOINT=https://rest.YOUR-REGION.braze.com
BRAZE_DRY_RUN=false
ALLOWED_ORIGIN=https://your-site.netlify.app
EXTERNAL_ID_SALT=replace-with-a-random-secret-string
```


## v6 notes

- If Braze API access is not available, the Netlify function returns dry_run mode instead of breaking the public form.
- GA4 custom events are sent through window.gtag when a Google tag is installed on the page.
- Public button labels and analytics event names are different by design.
