'use client'
import { config } from "@/config"
import { UserButton, useUser } from "@clerk/nextjs"
import { dark, neobrutalism } from "@clerk/themes"
import { useTheme } from "next-themes"

export const MyUserButton = () => {
    const { resolvedTheme } = useTheme()
    const { isLoaded } = useUser();

    return (
        isLoaded ?
            <UserButton
                appearance={{
                    baseTheme: resolvedTheme === "dark" ? dark : neobrutalism,
                    layout: {
                        logoLinkUrl: "/",
                        logoPlacement: "inside",
                        termsPageUrl: config.landingPageUrl + "/terms",
                        privacyPageUrl: config.landingPageUrl + "/privacy-policy",
                        shimmer: true,
                        socialButtonsVariant: "blockButton",
                        socialButtonsPlacement: "top",
                    },
                }}
            /> : null
    )
}
