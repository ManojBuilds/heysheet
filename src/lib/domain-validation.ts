import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { NextResponse } from "next/server";

export const validateDomains = (domains: string[], allHeaders: ReadonlyHeaders) => {
    if (domains && domains.length > 0) {
        const originHeader = allHeaders.get("origin");
        const refererHeader = allHeaders.get("referer");

        console.log("Received headers:", {
            origin: originHeader,
            referer: refererHeader,
        });

        let origin: string | null | undefined = originHeader;
        if (!origin && refererHeader?.startsWith("http")) {
            origin = refererHeader;
        }
        let allowedDomain = false;

        if (origin && origin !== "null") {
            console.log("Validating origin:", origin);
            try {
                const originUrl = new URL(origin);
                const hostname = originUrl.hostname;

                // Check if the hostname matches any of the allowed domains
                allowedDomain = domains.some((domain: string) => {
                    // Handle localhost and IP addresses
                    if (domain === "localhost" || domain.startsWith("localhost:")) {
                        return (
                            hostname === "localhost" ||
                            hostname.startsWith("localhost:") ||
                            hostname === "127.0.0.1" ||
                            hostname.startsWith("127.0.0.1:")
                        );
                    }

                    // Handle IP addresses with optional ports
                    const ipRegex =
                        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::[0-9]+)?$/;
                    if (ipRegex.test(domain)) {
                        const domainBase = domain.split(":")[0];
                        const hostnameBase = hostname.split(":")[0];
                        return domainBase === hostnameBase;
                    }

                    // Remove www. prefix for comparison if present
                    const normalizedHostname = hostname.replace(/^www\./, "");
                    const normalizedDomain = domain.replace(/^www\./, "");

                    // Exact match or subdomain match
                    return (
                        normalizedHostname === normalizedDomain ||
                        normalizedHostname.endsWith("." + normalizedDomain)
                    );
                });
            } catch (error) {
                console.error("Invalid origin URL:", error);
            }
        } else {
            allowedDomain = true;
        }

        if (!allowedDomain) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Form submissions are not allowed from this domain",
                },
                { status: 403 },
            );
        }
    }
}
