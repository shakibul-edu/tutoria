# Troubleshooting Google Login

If you see "Can't continue to google.com something went wrong" or authentication errors:

## 1. Check Environment Variables
Ensure your `.env` (or `.env.local`) file has the following:

```env
GOOGLE_ID=your-client-id.apps.googleusercontent.com
GOOGLE_SECRET=your-client-secret
NEXT_PUBLIC_GOOGLE_ID=your-client-id.apps.googleusercontent.com
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret
```

**Restart your server** after changing `.env`.

## 2. Google Cloud Console Configuration

1.  Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2.  Edit your **OAuth 2.0 Client ID**.
3.  **Authorized JavaScript origins**:
    *   `http://localhost:3000` (Exact match, no trailing slash)
    *   `http://localhost` (Sometimes needed)
4.  **Authorized redirect URIs**:
    *   `http://localhost:3000/api/auth/callback/google`

## 3. Google One Tap Specifics
*   One Tap requires `Authorized JavaScript origins` to be correct.
*   If testing on `localhost`, ensure you are not using Incognito mode with "Block third-party cookies" enabled, as One Tap needs cookies.
*   Check the browser console (F12) for specific error messages from the Google library.

## 4. "Can't continue to google.com"
This error often means the **Origin** sending the request (your localhost) does not match the **Authorized Origins** in Google Cloud Console.
*   Double check `http` vs `https`.
*   Double check port `3000`.

## 5. Verify ID Token Verification
The backend attempts to verify the token with:
`https://oauth2.googleapis.com/tokeninfo?id_token=...`
If this fails, check if your server has internet access.
