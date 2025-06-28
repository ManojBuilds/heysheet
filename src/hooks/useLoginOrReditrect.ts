'use client'

import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "nextjs-toploader/app";
import { useCallback } from "react";

const useLoginOrRedirect = () => {
    const { isSignedIn } = useAuth()
    const { redirectToSignIn } = useClerk()
    const router = useRouter()

    const loginOrRedirect = useCallback(() => {
        if (!isSignedIn) {
            redirectToSignIn({
                redirectUrl: '/dashboard'
            })
        } else {
            router.push('/dashboard')
        }
    }, [isSignedIn, redirectToSignIn, router]);

    return loginOrRedirect;
};

export default useLoginOrRedirect;
