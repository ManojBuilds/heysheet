"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "nextjs-toploader/app";
import { useCallback } from "react";

const useLoginOrRedirect = () => {
  const { isSignedIn } = useAuth();
  const { openSignUp } = useClerk();
  const router = useRouter();

  const loginOrRedirect = useCallback(() => {
    if (!isSignedIn) {
      openSignUp({
        redirectUrl: "/dashboard",
      });
    } else {
      router.push("/dashboard");
    }
  }, [isSignedIn, openSignUp, router]);

  return loginOrRedirect;
};

export default useLoginOrRedirect;
