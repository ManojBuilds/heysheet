import React, { useState, useMemo } from "react";
import { SelectItem } from "@/components/ui/select";
import { Input } from "../ui/input";

interface DatabaseSearchableListProps {
  databases: { id: string; title: string }[];
  setSelectedDatabase: (id: string) => void;
}

export function DatabaseSearchableList({ databases, setSelectedDatabase }: DatabaseSearchableListProps) {
  const [search, setSearch] = useState("");

  const getPlainText = (title: any): string => {
    if (typeof title === 'string') {
      return title;
    }
    if (Array.isArray(title) && title.length > 0) {
      const text = title.map(t => t.plain_text).join('');
      if (text) return text;
    }
    if (title && typeof title.plain_text === 'string') {
        return title.plain_text;
    }
    return "Untitled Database";
  };

  const filteredDatabases = useMemo(() => {
    if (!search) return databases;
    return databases.filter((db) =>
      getPlainText(db.title).toLowerCase().includes(search.toLowerCase())
    );
  }, [search, databases]);

  return (
    <>
      <div className="p-2">
        <Input
          type="text"
          placeholder="Search databases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {filteredDatabases.length > 0 ? (
        filteredDatabases.map((db) => (
          <SelectItem key={db.id} value={db.id} onClick={() => setSelectedDatabase(db.id)}>
            {getPlainText(db.title)}
          </SelectItem>
        ))
      ) : (
        <div className="text-xs text-muted-foreground p-2 text-center">No databases found.</div>
      )}
    </>
  );
}
