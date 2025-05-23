"use client";

import { DEFAULT_FORM_THEMES, FORM_COMPONENT_TYPES } from "@/lib/form-builder";
import {
  FormComponent,
  FormComponentType,
  FormData,
  FormTheme,
} from "@/types/form-builder";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Loader } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import FormCanvas from "./FormCanvas";
import { Dialog, DialogContent } from "../ui/dialog";
import FormPreview from "./FormPreview";
import FormComponentsSidebar from "./FormComponentsSidebar";
import { ThemeSelector } from "./ThemeSelector";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import ComponentSettingsSidebar from "./ComponentSettingsSidebar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import FormBuilderHeader from "./FormBuilderHeader";

async function fetchFormByEndpoint(endpointId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("forms")
    .select(
      `
      *
    `
    )
    .eq("endpoint_id", endpointId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function upsertForm(formData: FormData & { endpoint_id: string }) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("upsert_form", {
    p_endpoint_id: formData.endpoint_id,
    p_title: formData.title,
    p_theme: formData.theme,
    p_components: formData.components,
    p_pages: formData.pages,
    p_active_page: formData.activePage,
  });

  if (error) throw error;
  return data;
}

const FormBuilder = ({ endpointId }: { endpointId: string }) => {
  const router = useRouter();
  const defaultPageId = "page-1";
  const [formData, setFormData] = useState<FormData>({
    activePage: defaultPageId,
    components: [],
    id: "1",
    pages: [
      {
        id: defaultPageId,
        title: "Page 1",
      },
    ],
    theme: DEFAULT_FORM_THEMES[0],
    title: "Untitled Form",
    description: "",
  });
  const [currentComponent, setCurrentComponent] =
    useState<FormComponent | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] =
    useState<string>("components");
  const [isDropped, setIsDropped] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const {
    data: existingForm,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["form", endpointId],
    queryFn: () => fetchFormByEndpoint(endpointId),
    enabled: !!endpointId,
    retry: false,
  });

  const saveFormMutation = useMutation({
    mutationFn: upsertForm,
    onSuccess: () => {
      toast.success("Form saved successfully!");
    },
    onError: (error) => {
      toast.error("Failed to save form: " + error.message);
    },
  });

  useEffect(() => {
    if (existingForm) {
      setFormData({
        id: existingForm.id,
        title: existingForm.title,
        theme: existingForm.theme,
        components: existingForm.components,
        pages: existingForm.pages,
        activePage: existingForm.active_page,
      });
      const firstComponentOfPageOne = existingForm.components.filter(
        (c: { pageId: string }) => c.pageId === "page-1"
      )?.[0];
      setCurrentComponent(firstComponentOfPageOne ?? null);
    }
  }, [existingForm]);

  if (!endpointId) {
    router.push("/dashboard");
  }

  if (isLoading)
    return (
      <div className="h-44 w-full grid place-items-center">
        <Loader className="w-5 h-5 animate-spin" />
        <p className="font-main animate-pulse mt-4">Loading...</p>
      </div>
    );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const updateFormComponents = (components: FormComponent[]) => {
    setFormData({ ...formData, components });
  };

  const updateFormTitle = (title: string) => {
    setFormData({ ...formData, title });
  };

  const updateFormTheme = (theme: FormTheme) => {
    setFormData({ ...formData, theme });
    setIsThemeDialogOpen(false);
  };

  const handleEditComponent = (component: FormComponent) => {
    setCurrentComponent(component);
  };

  const handleSaveComponent = (updatedComponent: FormComponent) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.id === updatedComponent.id ? updatedComponent : c
      ),
    }));
    // setCurrentComponent(null);
    toast.success("Component updated successfully!");
  };

  const handleSaveForm = () => {
    saveFormMutation.mutate({
      ...formData,
      endpoint_id: endpointId,
    });
  };

  const addNewPage = () => {
    const newPageId = `page-${formData.pages.length + 1}`;
    const newPage = {
      id: newPageId,
      title: `Page ${formData.pages.length + 1}`,
    };

    setFormData({
      ...formData,
      pages: [...formData.pages, newPage],
      activePage: newPageId,
    });

    toast.success("New page added!");
  };

  const setActivePage = (pageId: string) => {
    setFormData({
      ...formData,
      activePage: pageId,
    });
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || over.id !== "form-canvas") return;
    const formElementId = active.id as string;

    const component = FORM_COMPONENT_TYPES.find(
      (c) => c.type === formElementId
    );
    if (!component) return;

    const typeCount =
      formData.components.filter((c) => c.type === formElementId).length + 1;
    const name = `${formElementId}_${typeCount}`;

    const defaultProperties = getDefaultProperties(
      formElementId as FormComponentType
    );

    const newComponent = {
      name,
      id: `${formElementId}x${formData.components.length}`,
      properties: defaultProperties,
      required: false,
      title: component.label,
      type: formElementId as FormComponentType,
      pageId: formData.activePage,
    } as FormComponent;

    setFormData((formData) => ({
      ...formData,
      components: [...formData.components, newComponent],
    }));
    setCurrentComponent(newComponent);
  }

  // Add this helper function
  // TODO:
  function getDefaultProperties(type: FormComponentType) {
    switch (type) {
      case "short-text":
      case "long-text":
        return { placeholder: "Enter your answer" };
      case "number":
        return { min: 0, max: 100, placeholder: "Enter a number" };
      case "multiple-choice":
      case "single-choice":
      case "dropdown":
        return { options: ["Option 1", "Option 2", "Option 3"] };
      case "rating":
        return { maxRating: 5 };
      case "date":
        return { format: "MM/DD/YYYY" };
      case "email":
        return { placeholder: "Enter your email" };
      case "phone":
        return { placeholder: "Enter your phone number" };
      // case "file":
      //   return { maxSize: 5, allowedTypes: ["image/*", "application/pdf"] };
      default:
        return {};
    }
  }
  const handleRemovePage = (pageId: string) => {
    const updatedComponents = formData.components.filter(
      (c) => c.pageId !== pageId
    );
    const updatedPages = formData.pages.filter((p) => p.id !== pageId);

    const newActivePage =
      pageId === formData.activePage
        ? updatedPages[0]?.id
        : formData.activePage;
    setFormData({
      ...formData,
      pages: updatedPages,
      components: updatedComponents,
      activePage: newActivePage,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <FormBuilderHeader
        formData={formData}
        updateFormTheme={updateFormTheme}
        handleSaveForm={handleSaveForm}
        isSaving={saveFormMutation.isPending}
        setIsPreviewOpen={setIsPreviewOpen}
        setIsThemeDialogOpen={setIsThemeDialogOpen}
        updateFormTitle={updateFormTitle}
        formId={existingForm.id}
      />
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="flex flex-1 gap-6 h-[calc(100svh-50px)] overflow-hidden">
          {/* Left Sidebar - Components & Theme */}
          <div className="w-[300px] shrink-0 p-4 border-r">
            <Tabs value={activeSidebarTab} onValueChange={setActiveSidebarTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="theme">Theme</TabsTrigger>
              </TabsList>
              <TabsContent value="components">
                <FormComponentsSidebar activeId={activeId} />
              </TabsContent>
              <TabsContent value="theme">
                <ThemeSelector
                  selectedTheme={formData.theme}
                  onSelectTheme={updateFormTheme}
                  onCustomizeTheme={updateFormTheme}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Main Content Area - Form Canvas */}
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex-1 overflow-y-auto h-full p-6">
              <div className="flex items-center justify-between mb-4">
                <Input
                  value={formData.title}
                  onChange={(e) => updateFormTitle(e.target.value)}
                  className="border-0 text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0 px-2 w-fit bg-transparent shadow-none"
                  placeholder="Untitled Form"
                />
                <div className="text-sm text-muted-foreground">
                  {formData.components.length}{" "}
                  {formData.components.length === 1 ? "question" : "questions"}{" "}
                  across {formData.pages.length}{" "}
                  {formData.pages.length === 1 ? "page" : "pages"}
                </div>
              </div>
              <Separator className="mb-6" />
              <FormCanvas
                components={formData.components}
                theme={formData.theme}
                pages={formData.pages}
                activePage={formData.activePage}
                onUpdateComponents={updateFormComponents}
                onEditComponent={handleEditComponent}
                onAddPage={addNewPage}
                onChangePage={setActivePage}
                onUpdateFormData={setFormData}
                onRemovePage={handleRemovePage}
              />
            </div>
          </div>

          {/* Right Sidebar - Component Settings */}
          {currentComponent && formData.components.length && (
            <div className="w-[400px] shrink-0">
              <ComponentSettingsSidebar
                component={currentComponent}
                onClose={() => setCurrentComponent(null)}
                onSave={handleSaveComponent}
                onDelete={(id) => {
                  const newComponents = formData.components.filter(
                    (c) => c.id !== id
                  );
                  setFormData((prev) => ({
                    ...prev,
                    components: newComponents,
                  }));
                  setCurrentComponent(null);
                  toast.success("Component deleted!");
                }}
              />
            </div>
          )}
        </div>
      </DndContext>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="p-2 sm:max-w-3xl">
          <FormPreview
            formData={formData}
            onClose={() => setIsPreviewOpen(false)}
            endpoint={endpointId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormBuilder;
