import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import CreateFormModal from "@/components/CreateFormModal";
import FormFilterAndSearch from "./form-filter-and-search";
import { getFormsByUserId } from "@/actions";
import { FormCard } from "@/components/FormCard";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { FormListSkeleton } from "./form-list-skeleton";

export const metadata = {
  title: "Forms - Heysheet",
  description: "Manage your forms and Google Sheets integrations.",
};

export default function FormsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string; status?: string; sortBy?: string }>;
}) {
  return (
    <div className="space-y-4 flex flex-col items-center max-w-6xl mx-auto px-4">
      <div className="flex justify-between w-full gap-4 items-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Your Forms</h1>
        <CreateFormModal />
      </div>
      <Suspense fallback={null}>
        <FormFilterAndSearch />
      </Suspense>
      <Suspense fallback={<FormListSkeleton />}>
        <FormList
          searchParams={searchParams}
        />
      </Suspense>

    </div>
  );
}

async function FormList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string; status?: string; sortBy?: string }>;
}) {
  const [{ userId }, searchQuery] = await Promise.all([auth(), searchParams]);

  const page = Number(searchQuery?.page) || 1;
  const pageSize = Number(searchQuery?.pageSize) || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const search = searchQuery?.search || ''
  const statusFilter = searchQuery?.status || 'all'
  const sortBy = searchQuery?.sortBy || ''

  const { forms, totalCount } = await getFormsByUserId(userId!, from, to);
  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : (statusFilter === "active" ? form.is_active : !form.is_active);
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "submission_count":
        return b.submission_count - a.submission_count;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
  const totalPages = Math.ceil(totalCount / pageSize);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) {
      return "#";
    }
    const currentParams = new URLSearchParams();
    for (const key in searchQuery) {
      if (Object.prototype.hasOwnProperty.call(searchQuery, key)) {
        currentParams.set(key, String(searchQuery[key as keyof typeof searchQuery]));
      }
    }
    currentParams.set("page", String(newPage));
    currentParams.set("pageSize", String(pageSize));
    return `?${currentParams.toString()}`;
  };
  if (forms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 max-w-6xl mx-auto px-4 ">
        <div className="h-52">
          <Image
            src={'https://ik.imagekit.io/q3ksr5fk3/ChatGPT%20Image%20Jul%2022,%202025,%2008_11_51%20AM_4_11zon.png?updatedAt=1753152271844'}
            alt="No forms"
            width={1024}
            height={1536}
            className="pointer-events-none w-full h-full"
          />
        </div>
        <h2 className="text-xl font-bold mb-2 sm:text-2xl">Create your first form</h2>
        <p className="text-muted-foreground mb-6 text-sm sm:text-base">
          You haven't created any forms yet. Get started by creating your
          first one.
        </p>
        <CreateFormModal />
      </div>
    );
  }

  return <>

    {filteredForms.length > 0 ? (
      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 xl:grid-cols-3 w-full">
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
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link
          href={goToPage(page - 1)}
          className={buttonVariants({ variant: 'outline' })}
          aria-disabled={page <= 1}
          tabIndex={page <= 1 ? -1 : undefined}
        >
          Previous
        </Link>
        <span>
          Page {page} of {totalPages}
        </span>
        <Link
          href={goToPage(page + 1)}
          className={buttonVariants({ variant: 'outline' })}
          aria-disabled={page >= totalPages}
          tabIndex={page >= totalPages ? -1 : undefined}
        >
          Next
        </Link>
      </div>
    )}
  </>
}
