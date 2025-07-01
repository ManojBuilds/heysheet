"use client";

import { FORM_COMPONENT_TYPES } from "@/lib/form-builder";
import {
  FormComponent,
  FormComponentType,
  FormData,
  FormTheme,
} from "@/types/form-builder";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import FormCanvas from "./FormCanvas";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import FormPreview, { handleConfetti } from "./FormPreview";
import FormComponentsSidebar from "./FormComponentsSidebar";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import ComponentSettingsSidebar from "./ComponentSettingsSidebar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "nextjs-toploader/app";
import { useMutation, useQuery } from "@tanstack/react-query";
import FormBuilderHeader from "./FormBuilderHeader";
import SuccessPageSettings from "./SuccessPageSettings";
import { generateTheme } from "@/lib/theme";
import { getDefaultProperties } from "./form-preview/RenderComponentInput";
import SuccessPreview from "./form-preview/SuccessPreview";
import { useAuth } from "@clerk/nextjs";
import useSubscription from "@/hooks/useSubscription";

async function fetchFormByFormId(formId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("forms")
    .select("id, title, builder_config, user_id")
    .eq("id", formId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function upsertForm(formData: FormData & { formId: string }) {
  console.log("fromId", formData.formId, formData);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("forms")
    .update({
      title: formData.title,
      builder_config: {
        pages: formData.pages,
        theme: {
          font: formData.theme.font,
          color: formData.theme.primary,
          mode: formData.theme.mode,
          radius: formData.theme.radius,
        },
        components: formData.components,
        active_page: formData.activePage,
        success_page: formData.successPage,
      },
    })
    .eq("id", formData.formId)
    .select();
  if (error) throw error;
  return data;
}

const FormBuilder = ({ formId }: { formId: string }) => {
  const router = useRouter();
  const { userId } = useAuth();
  const { data: subscription } = useSubscription();
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
    theme: generateTheme("#e66100", "Outfit", "lg", "dark"),
    title: "Untitled Form",
    description: "",
    successPage: {
      title: "Thanks for your submission",
      description: "Your response has been recorded",
    },
  });
  const [currentComponent, setCurrentComponent] =
    useState<FormComponent | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] =
    useState<string>("components");
  const [activeId, setActiveId] = useState<string | null>(null);

  const {
    data: existingForm,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => fetchFormByFormId(formId),
    enabled: !!formId,
    retry: false,
  });
  console.log("formbuilder", formData.components);

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
    if (existingForm && existingForm.builder_config) {
      console.log("INSIDE: ", existingForm?.builder_config);
      const theme = existingForm.builder_config.theme;
      const generatedTheme = generateTheme(
        theme.color,
        theme.font,
        theme.radius,
        theme.mode,
      );
      // Only update if the generated theme is different to prevent infinite loops
      if (JSON.stringify(generatedTheme) !== JSON.stringify(formData.theme)) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          id: existingForm.id,
          title: existingForm.title,
          theme: generatedTheme,
          components: existingForm.builder_config.components,
          pages: existingForm.builder_config.pages,
          activePage: existingForm.builder_config.active_page,
          successPage: existingForm.builder_config.success_page,
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          id: existingForm.id,
          title: existingForm.title,
          components: existingForm.builder_config.components,
          pages: existingForm.builder_config.pages,
          activePage: existingForm.builder_config.active_page,
          successPage: existingForm.builder_config.success_page,
        }));
      }
      const firstComponentOfPageOne =
        existingForm.builder_config.components.filter(
          (c: { pageId: string }) => c.pageId === "page-1",
        )?.[0];
      setCurrentComponent(firstComponentOfPageOne ?? null);
    }
  }, [existingForm]);

  useEffect(() => {
    if (activeSidebarTab === "success") {
      handleConfetti();
    }
  }, [activeSidebarTab]);

  useEffect(() => {
    if (formData.theme.font) {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${formData.theme.font.replace(/ /g, "+")}&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, [formData.theme.font]);

  if (!formId) {
    router.push("/dashboard");
  }

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
  };

  const handleEditComponent = (component: FormComponent) => {
    setCurrentComponent(component);
  };

  const handleSaveComponent = (updatedComponent: FormComponent) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.id === updatedComponent.id ? updatedComponent : c,
      ),
    }));
    // setCurrentComponent(null);
    // toast.success("Component updated successfully!");
  };

  const handleSaveForm = () => {
    console.log("@iM, sAVING THEME FORM BUILDER:", {
      ...formData,
      formId: formId,
    });
    saveFormMutation.mutate({
      ...formData,
      formId: formId,
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
      (c) => c.type === formElementId,
    );
    if (!component) return;
    if (component.isPaid && !subscription?.plan) {
      toast.warning("Please upgrade your plan to use this feature!");
      return;
    }

    const typeCount =
      formData.components.filter((c) => c.type === formElementId).length + 1;
    const name =
      typeCount > 1 ? `${formElementId}-${typeCount}` : formElementId;

    const defaultProperties = getDefaultProperties(
      formElementId as FormComponentType,
    );

    const newComponent = {
      name,
      id: `${formElementId}x${formData.components.length}`,
      properties: defaultProperties,
      required: false,
      title: component.label,
      type: formElementId as FormComponentType,
      pageId: formData.activePage || defaultPageId,
    } as FormComponent;

    setFormData((formData) => ({
      ...formData,
      components: [...formData.components, newComponent],
    }));
    // setCurrentComponent(newComponent);
  }

  const handleRemovePage = (pageId: string) => {
    const updatedComponents = formData.components.filter(
      (c) => c.pageId !== pageId,
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

  const updateSuccessPage = (updates: Partial<FormData["successPage"]>) => {
    setFormData((prev) => ({
      ...prev,
      successPage: {
        ...prev.successPage,
        ...updates,
      },
    }));
  };

  return (
    <div className="flex flex-col h-screen">
      <FormBuilderHeader
        formData={formData}
        updateFormTheme={updateFormTheme}
        handleSaveForm={handleSaveForm}
        isSaving={saveFormMutation.isPending}
        setIsPreviewOpen={setIsPreviewOpen}
        updateFormTitle={updateFormTitle}
        formId={formId}
      />
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="flex flex-1 h-[calc(100svh-50px)] overflow-hidden">
          <div className="w-[400px] shrink-0 p-4 border-r">
            <Tabs value={activeSidebarTab} onValueChange={setActiveSidebarTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="success">Success</TabsTrigger>
              </TabsList>
              <TabsContent value="components">
                <FormComponentsSidebar activeId={activeId} />
              </TabsContent>
              <TabsContent value="success">
                <SuccessPageSettings
                  formData={formData}
                  updateSuccessPage={updateSuccessPage}
                />
              </TabsContent>
            </Tabs>
          </div>
          {activeSidebarTab === "success" ? (
            <div className="w-full relative">
              <SuccessPreview formData={formData} redirectUrl={null} />
            </div>
          ) : (
            <>
              <div className="w-full">
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
                      {formData.components.length === 1
                        ? "question"
                        : "questions"}{" "}
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
                    formId={formId}
                  />
                </div>
              </div>
              {currentComponent && formData.components.length > 0 && (
                <div className="w-fit shrink-0">
                  <ComponentSettingsSidebar
                    component={currentComponent}
                    onClose={() => setCurrentComponent(null)}
                    onSave={handleSaveComponent}
                    onDelete={(id) => {
                      const newComponents = formData.components.filter(
                        (c) => c.id !== id,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        components: newComponents,
                      }));
                      setCurrentComponent(null);
                      // toast.success("Component deleted!");
                    }}
                  />
                </div>
              )}{" "}
            </>
          )}
        </div>
      </DndContext>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent
          className="p-2 sm:max-w-2xl overflow-y-auto max-h-[70svh]"
          style={{ backgroundColor: formData.theme.background }}
        >
          <DialogTitle className="sr-only">{formData.title}</DialogTitle>
          <FormPreview
            formData={formData}
            onClose={() => setIsPreviewOpen(false)}
            className="min-h-full"
            formId={formId}
            redirectUrl={null}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormBuilder;
