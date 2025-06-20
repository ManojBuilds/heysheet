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
import { FormDetails, GoogleAccount } from "@/types/form-details";

export default function FormsPageClient({
  userName,
  forms,
  googleAccountsData,
  googleAuthUrl,
}: { userName: string; forms: FormDetails[], googleAccountsData: GoogleAccount[], googleAuthUrl: string }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");

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
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [forms, search, statusFilter, sortBy]);

  if (googleAccountsData?.length === 0) {
    return <AllowGooglePermissions url={googleAuthUrl} />;
  }

  return (
    <div className="space-y-4 flex flex-col items-center max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between w-full gap-4">
        <h1 className="text-3xl font-bold">Holla, {userName}</h1>
        <CreateFormModal />
      </div>

      {forms?.length === 0 ? (
        <div className="text-center mt-12">
          <GoogleSheetLogo className="mx-auto" />
          <h1 className="text-2xl font-semibold">
            Let&apos;s create your first form 🚀
          </h1>
          <p className="text-muted-foreground mt-2 mb-6">
            Start from scratch or use a template connected to your Google Sheet.
          </p>
        </div>
      ) : (
        <>
          {/* Filters and Search */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full mt-4">
            {filteredForms.map((form) => (
              <FormCard key={form.id} form={form} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
