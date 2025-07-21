'use client'
import { config } from "@/config"
import { UserButton } from "@clerk/nextjs"
import { dark, neobrutalism } from "@clerk/themes"
import { useTheme } from "next-themes"

export const MyUserButton = () => {
    const { resolvedTheme } = useTheme()
    return (
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
        />
    )
}
