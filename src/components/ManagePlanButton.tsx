'use client'
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const getSessionUrl = async () => {
    try {
        const res = await fetch('/api/paddle/customer-portal');
        const data = await res.json();
        return data
    } catch (e) {
        throw e
    }
}
export const ManagePlanButton = () => {
    const sessionMutation = useMutation({
        mutationFn: getSessionUrl,
        onSuccess: (data) => {
            console.log(data)
            if (data.url) {
                window.open(data.url)
            }
        },
        onError: (error) => {
            console.error(error)
            toast.error(error.message)
        }
    })
    return <Button leftIcon={sessionMutation.isPending && <Loader2 size={18} strokeWidth={1.5} className="animate-spin" />} onClick={() => sessionMutation.mutate()} disabled={sessionMutation.isPending}>Manage Plan</Button>
}
