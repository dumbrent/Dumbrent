# Supabase Auth Callback: Fallback Session Check Fix

## Problem

When using Supabase email verification or OAuth, the verification link may redirect to a URL with a hash fragment (e.g. `#access_token=...`). After the first load, the hash fragment is gone, so if the user reloads or returns to `/auth/callback`, there's no verification info in the URL. This can cause the callback page to show "Verification Failed" even if the user is already authenticated.

## Solution

**Add a fallback session check in your auth callback page:**

- If there's no `code`, `token`, or `access_token` in the URL, check if a Supabase session already exists.
- If a session exists, treat the user as authenticated, show a success message, and redirect to the profile/dashboard.

## Example (React/JS)

```js
// In your AuthCallbackPage or similar component
const handleAuthCallback = async () => {
  // ... your existing code to check code/token/access_token ...

  // Fallback: If none found, check for existing session
  if (!code && !token && !accessToken) {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionData.session) {
      // User is already authenticated
      setStatus('success');
      setMessage('You are already signed in! Redirecting to your profile...');
      setTimeout(() => {
        navigate('/profile', { replace: true });
      }, 2000);
      return;
    }
    // Otherwise, show error
    setStatus('error');
    setMessage('No verification information found. Please check your email and try again.');
    return;
  }
};
```

## When to Use
- Any project using Supabase (or similar) with email verification, magic links, or OAuth, where the callback URL might be reloaded or revisited without the original hash/query parameters.

## Why This Works
- After successful verification, Supabase stores the session in local storage.
- Even if the URL is "empty" on reload, the session is still valid and the user is authenticated.

---

**If you see "Verification Failed" but the user is actually logged in, add this fallback session check!** 