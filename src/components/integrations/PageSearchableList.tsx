import React, { useState, useMemo } from "react";
import { SelectItem } from "@/components/ui/select";
import { Input } from "../ui/input";

interface PageSearchableListProps {
  pages: { id: string; title: string }[];
  setSelectedPageId: (id: string) => void;
}

export function PageSearchableList({ pages, setSelectedPageId }: PageSearchableListProps) {
  const [search, setSearch] = useState("");

  const filteredPages = useMemo(() => {
    if (!search) return pages;
    return pages.filter((page) =>
      page.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, pages]);

  return (
    <>
      <div className="p-2">
        <Input
          type="text"
          placeholder="Search pages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {filteredPages.length > 0 ? (
        filteredPages.map((page) => (
          <SelectItem key={page.id} value={page.id} onClick={() => setSelectedPageId(page.id)}>
            {page.title}
          </SelectItem>
        ))
      ) : (
        <div className="text-xs text-muted-foreground p-2 text-center">No pages found.</div>
      )}
    </>
  );
}
