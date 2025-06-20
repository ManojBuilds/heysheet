"use client";
import {
  ExternalLink,
  Eye,
  Loader2,
  Palette,
  Save,
  Share2,
} from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ThemeSelector } from "./ThemeSelector";
import { FormTheme, FormData } from "@/types/form-builder";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TooltipWrapper from "../TooltipWrapper";
import { useEffect, useState } from "react";
import { Logo } from "../Logo";

interface FormBuilderHeaderProps {
  formData: FormData;
  updateFormTitle: (title: string) => void;
  updateFormTheme: (theme: FormTheme) => void;
  setIsPreviewOpen: (open: boolean) => void;
  handleSaveForm: () => void;
  isSaving: boolean;
  formId: string;
}

const FormBuilderHeader = ({
  formData,
  updateFormTitle,
  updateFormTheme,
  setIsPreviewOpen,
  handleSaveForm,
  isSaving,
  formId,
}: FormBuilderHeaderProps) => {
  const router = useRouter();
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (window) {
      setOrigin(window.location.origin)
    }
  }, [])

  return (
    <header className="border-b">
      <div className="flex justify-between items-center p-4">
        <Logo/>
      
        <div className="flex items-center gap-2">
          <TooltipWrapper content="Open preview in new tab">
            <Link
              href={origin ? `${window?.location.origin}/f/${formId}` : '#'}
              target="_blank"
              aria-label="Open preview in new tab"
              className={buttonVariants({ variant: "outline" })}
            >
              <ExternalLink className="w-5 h-5" />
            </Link>
          </TooltipWrapper>

          <DropdownMenu>
            <TooltipWrapper content="Configure theme">
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5">
                  <Palette className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipWrapper>
            <DropdownMenuContent className="p-0">
              <ThemeSelector
                selectedTheme={formData.theme}
                onSelectTheme={updateFormTheme}
                onCustomizeTheme={updateFormTheme}
                className="border-none rounded-none shadow-none p-4 bg-background"
                formData={formData}
              />
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipWrapper content="View Preview">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="gap-1.5"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipWrapper>
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
