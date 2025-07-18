'use client'
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function FormFilterAndSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get("search") || "";
    const initialStatusFilter = searchParams.get("status") || "all";
    const initialSortBy = searchParams.get("sortBy") || "created_at";

    const [search, setSearch] = useState(initialSearch);
    const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
    const [sortBy, setSortBy] = useState(initialSortBy);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (search) {
            params.set("search", search);
        } else {
            params.delete("search");
        }
        if (statusFilter !== "all") {
            params.set("status", statusFilter);
        } else {
            params.delete("status");
        }
        if (sortBy !== "created_at") {
            params.set("sortBy", sortBy);
        } else {
            params.delete("sortBy");
        }
        router.push(`?${params.toString()}`);
    }, [search, statusFilter, sortBy, router, searchParams]);

    return (
        <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
            <Input
                type="text"
                placeholder="Search forms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
            />
            <div className="flex gap-4 w-full">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="flex-1 sm:flex-auto w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="created_at">Newest</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="submission_count">Submissions</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
