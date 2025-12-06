"use client";
import Script from "next/script";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const GoogleOneTap = () => {
  const { status } = useSession();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Debug logging
    if (status === "unauthenticated" && scriptLoaded) {
      if (!process.env.NEXT_PUBLIC_GOOGLE_ID) {
        console.error("Google One Tap: NEXT_PUBLIC_GOOGLE_ID is missing.");
        return;
      }

      const { google } = window as any;
      if (google) {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_ID,
          callback: async (response: any) => {
            console.log("Google One Tap response received", response);
            // Call the custom credentials provider
            const result = await signIn("googleonetap", {
              credential: response.credential,
              redirect: false,
            });

            if (result?.error) {
                console.error("Google One Tap Sign In failed:", result.error);
            } else {
                console.log("Google One Tap Sign In success");
                // Optional: Force a reload or router.refresh() if session doesn't update immediately
                // window.location.reload();
            }
          },
          auto_select: true, // Attempt to automatically sign in
          cancel_on_tap_outside: false,
          use_fedcm_for_prompt: true, // Opt-in to FedCM to silence warning and future-proof
        });

        // Display the One Tap prompt
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log("One Tap skipped or not displayed:", notification.getNotDisplayedReason());
          }
        });
      }
    }
  }, [status, scriptLoaded]);

  if (status === "authenticated" || status === "loading") {
    return null;
  }

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={() => setScriptLoaded(true)}
    />
  );
};

export default GoogleOneTap;
