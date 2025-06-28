import { currentUser } from "@clerk/nextjs/server";
import { getFormsByUserId } from "@/actions";
import FormsPageClient from "./forms-client";

export const metadata = {
  title: "Forms - HeySheet",
  description: "Manage your forms and Google Sheets integrations.",
};

export default async function FormsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}) {
  const user = await currentUser();
  const userId = user?.id || "";
  const searchQuery = await searchParams;

  // Parse pagination params
  const page = Number(searchQuery?.page) || 1;
  const pageSize = Number(searchQuery?.pageSize) || 1;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Fetch paginated forms and total count
  const { forms, totalCount } = await getFormsByUserId(userId, from, to);

  return (
    <FormsPageClient
      forms={forms}
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
    />
  );
}
