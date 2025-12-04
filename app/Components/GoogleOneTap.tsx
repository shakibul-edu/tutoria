"use client";
import Script from "next/script";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const GoogleOneTap = () => {
  const { data: session, status } = useSession();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" && scriptLoaded) {
      const { google } = window as any;
      if (google) {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_ID, // Ensure this env var is set
          callback: async (response: any) => {
            // Call the custom credentials provider
            await signIn("googleonetap", {
              credential: response.credential,
              redirect: false,
            });
          },
          auto_select: true, // Attempt to automatically sign in
          cancel_on_tap_outside: false,
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
