# Deploy to Netlify

1. Push this folder to a GitHub repository.
2. In Netlify, choose Add new site -> Import an existing project.
3. Select the repository.
4. Build command: leave blank.
5. Publish directory: `.`
6. Functions directory: `netlify/functions`
7. Add environment variables:

```text
BRAZE_REST_API_KEY=your-braze-rest-api-key
BRAZE_REST_ENDPOINT=https://rest.YOUR-REGION.braze.com
BRAZE_DRY_RUN=false
ALLOWED_ORIGIN=https://your-site.netlify.app
EXTERNAL_ID_SALT=replace-with-a-random-secret-string
```

8. Deploy.
9. Test the form from the Netlify URL, not from a local file or GitHub Pages.
10. Add `?debug=orbit-admin` to see the Local Event Log.
