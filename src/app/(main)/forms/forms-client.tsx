"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FormCard } from "@/components/FormCard";
import CreateFormModal from "@/components/CreateFormModal";
import GoogleSheetLogo from "@/components/GoogleSheetLogo";
import { useState, useMemo } from "react";
import AllowGooglePermissions from "@/components/AllowGooglePermissions";
import { useUser } from "@clerk/nextjs";
import { useGoogleAccounts } from "@/hooks/use-google-accounts-store";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";

type FormsPageClientProps = {
  forms: {
    id: string;
    title: string;
    sheet_name: string;
    created_at: string;
    is_active: string;
    submission_count: number;
  }[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export default function FormsPageClient({
  forms,
  page,
  pageSize,
  totalCount,
}: FormsPageClientProps) {
  const { accounts } = useGoogleAccounts();
  const { user } = useUser();
  const userName = user?.fullName || "User";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const router = useRouter();
  const searchParams = useSearchParams();

  const filteredForms = useMemo(() => {
    return forms
      .filter((form) => {
        const matchesSearch = form.title
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === "all"
            ? true
            : statusFilter === "active"
              ? form.is_active
              : !form.is_active;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "title":
            return a.title.localeCompare(b.title);
          case "submission_count":
            return b.submission_count - a.submission_count;
          default:
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
        }
      });
  }, [forms, search, statusFilter, sortBy]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    params.set("pageSize", String(pageSize));
    router.push(`?${params.toString()}`);
  };

  if (forms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 max-w-6xl mx-auto px-4 h-[calc(100vh-200px)]">
        <GoogleSheetLogo className="w-24 h-24 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Create your first form</h2>
        <p className="text-muted-foreground mb-6">
          You haven&apos;t created any forms yet. Get started by creating your
          first one.
        </p>
        <CreateFormModal />
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col items-center max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between w-full gap-4">
        <h1 className="text-3xl font-bold">Holla, {userName}</h1>
        <CreateFormModal />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
        <Input
          type="text"
          placeholder="Search forms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
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

      {/* Form Cards */}
      {filteredForms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full mt-4">
          {filteredForms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-16">
          <h3 className="text-xl font-semibold">No Forms Found</h3>
          <p className="text-muted-foreground mt-2">
            No forms match your current search and filter criteria.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredForms.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            variant={"outline"}
          >
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            variant={"outline"}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
