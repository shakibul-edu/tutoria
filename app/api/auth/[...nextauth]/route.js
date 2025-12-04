import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      id: "googleonetap",
      name: "Google One Tap",
      credentials: {
        credential: { type: "text" },
      },
      async authorize(credentials) {
        const idToken = credentials.credential;
        if (!idToken) return null;

        try {
          const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
          const payload = await res.json();

          if (payload.error || !payload.email) {
            throw new Error(payload.error_description || "Invalid token");
          }

          return {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            image: payload.picture,
            id_token: idToken,
          };
        } catch (error) {
          console.error("Error verifying Google One Tap token", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // On initial sign in
      if (account) {
        if (account.provider === "google") {
          token.id_token = account.id_token;
          token.access_token = account.access_token;
          token.refresh_token = account.refresh_token;
          token.expires_at = account.expires_at || Math.floor(Date.now() / 1000) + 3600;
        } else if (account.provider === "googleonetap") {
           // For One Tap, we get the ID token directly.
           // We might not have an access_token or refresh_token unless we do a code exchange flow,
           // but for simple identity, this is often enough.
           // If backend needs access_token for API calls, One Tap is limited without further flows.
           // However, the user object is populated.
           token.id_token = user.id_token;
           // We don't have an access token for Google APIs here, just identity.
           // If the app relies on `token.access_token` for other Google APIs, this might be a limitation.
           // But based on `useLocation` hook in `utils/Hooks/LocationHook.tsx`, it uses `idToken` to call *our* backend, not Google's.
           // So `id_token` is key.
        }
      }

      // If token is expired, refresh it (only for standard Google provider)
      if (token.expires_at && Date.now() / 1000 > token.expires_at - 60) {
        try {
          // Only refresh if we have a refresh token (standard flow)
          if (token.refresh_token) {
            const params = new URLSearchParams({
              client_id: process.env.GOOGLE_ID,
              client_secret: process.env.GOOGLE_SECRET,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token,
            });
            const res = await fetch("https://oauth2.googleapis.com/token", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: params.toString(),
            });
            const refreshedTokens = await res.json();
            if (!res.ok) throw refreshedTokens;
            token.id_token = refreshedTokens.id_token;
            token.access_token = refreshedTokens.access_token;
            token.expires_at = Math.floor(Date.now() / 1000) + refreshedTokens.expires_in;
          }
        } catch (error) {
          console.error("Error refreshing Google tokens", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.id_token = token.id_token;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
