import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import { DatabaseSearchableList } from "./DatabaseSearchableList";
import { Skeleton } from "../ui/skeleton";

interface NotionDatabaseSelectorProps {
  databases: any[];
  isLoadingDatabases: boolean;
  selectedDatabase: string;
  setSelectedDatabase: (id: string) => void;
  setOpenCreateDbDialog: (open: boolean) => void;
  updateNotionIntegration: (id: string, enabled: boolean) => void;
  isEnabled: boolean;
}

export function NotionDatabaseSelector({
  databases,
  isLoadingDatabases,
  selectedDatabase,
  setSelectedDatabase,
  setOpenCreateDbDialog,
  updateNotionIntegration,
  isEnabled,
}: NotionDatabaseSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedDatabase}
        onValueChange={(value) => {
          if (value === "create-new") {
            setOpenCreateDbDialog(true);
          } else {
            setSelectedDatabase(value);
            updateNotionIntegration(value, isEnabled);
          }
        }}
        disabled={isLoadingDatabases}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Notion database" />
        </SelectTrigger>
        <SelectContent className="w-full">
          {isLoadingDatabases ? (
            <div className="p-2">
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : databases && databases.length > 0 ? (
            <DatabaseSearchableList
              databases={databases}
              setSelectedDatabase={setSelectedDatabase}
            />
          ) : (
            <SelectItem value="no-dbs" disabled>
              No databases found.
            </SelectItem>
          )}
          {!isLoadingDatabases && (
            <SelectItem value="create-new">+ Create new database</SelectItem>
          )}
        </SelectContent>
      </Select>
      {selectedDatabase && isEnabled && (
        <Button
          variant="secondary"
          leftIcon={<ExternalLinkIcon />}
          onClick={() =>
            window.open(
              `https://www.notion.so/${selectedDatabase.replace(/-/g, "")}`,
              "_blank",
            )
          }
        >
          Open Notion Database
        </Button>
      )}
    </div>
  );
}
