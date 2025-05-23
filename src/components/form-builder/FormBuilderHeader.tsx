"use client";
import {
  ExternalLink,
  Eye,
  Loader2,
  Palette,
  Save,
  Share2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ThemeSelector } from "./ThemeSelector";
import { FormTheme, FormData } from "@/types/form-builder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormBuilderHeaderProps {
  formData: FormData;
  updateFormTitle: (title: string) => void;
  updateFormTheme: (theme: FormTheme) => void;
  setIsThemeDialogOpen: (open: boolean) => void;
  setIsPreviewOpen: (open: boolean) => void;
  handleSaveForm: () => void;
  isSaving: boolean;
  formId: string;
}

const FormBuilderHeader = ({
  formData,
  updateFormTitle,
  updateFormTheme,
  setIsThemeDialogOpen,
  setIsPreviewOpen,
  handleSaveForm,
  isSaving,
  formId,
}: FormBuilderHeaderProps) => {
  const router = useRouter();

  return (
    <header className="border-b">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4 flex-1">
          <h1
            onClick={() => router.back()}
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent cursor-pointer hover:opacity-90 transition-opacity"
          >
            FormBuilder
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="flex items-center gap-1.5"
            href={`${window.location.origin}/f/${formId}`}
            target="_blank"
          >
            Share URL
            <ExternalLink className="w-5 h-5" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setIsThemeDialogOpen(true)}
                className="gap-1.5"
              >
                <Palette className="h-4 w-4" />
                Theme
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <ThemeSelector
                selectedTheme={formData.theme}
                onSelectTheme={updateFormTheme}
                onCustomizeTheme={updateFormTheme}
                className="border-none rounded-none shadow-none p-4"
              />
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            className="gap-1.5"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            disabled={isSaving}
            onClick={handleSaveForm}
            className="gap-1.5"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </div>
    </header>
  );
};

export default FormBuilderHeader;
