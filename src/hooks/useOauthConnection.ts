'use client'

import { getOauthConnection } from "@/actions"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"

const useOauthConnection = (oauthProvider: 'google' | 'notion' | 'slack') => {
    const { userId } = useAuth()
    const { data, error, isLoading } = useQuery({
        queryKey: ['oauthConnection', oauthProvider, userId],
        queryFn: () => getOauthConnection(oauthProvider),
        enabled: !!userId,
    })
    return {
        accessToken: data?.accessToken,
        isLoading,
        error,
        isConnected: data?.isConnected,
    }
}

export default useOauthConnection
