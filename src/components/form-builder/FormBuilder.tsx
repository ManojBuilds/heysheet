"use client";

import { DEFAULT_FORM_THEMES, FORM_COMPONENT_TYPES } from "@/lib/form-builder";
import {
  FormComponent,
  FormComponentType,
  FormData,
  FormTheme,
} from "@/types/form-builder";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, Palette, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import FormCanvas from "./FormCanvas";
import { Dialog, DialogContent } from "../ui/dialog";
import FormPreview from "./FormPreview";
import FormComponentsSidebar from "./FormComponentsSidebar";
import { ThemeSelector } from "./ThemeSelector";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FormBuilder = () => {
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

  const handleDragStart = (type: FormComponentType) => {
    // This function is only kept for API compatibility with existing components
    // The actual drag handling is now done in FormCanvas and FormComponentsSidebar
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

  const handleSaveForm = () => {
    toast.success("Form saved successfully!");
    console.log("Form data saved:", formData);

    // For Next.js integration, you would add code like:
    // const saveForm = async () => {
    //   try {
    //     const response = await fetch('/api/forms', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(formData)
    //     });
    //     const data = await response.json();
    //     toast.success("Form saved successfully!");
    //   } catch (error) {
    //     toast.error("Failed to save form");
    //   }
    // };
    // saveForm();
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
    console.log(active.id, over?.id);
    if (!over || over.id !== "form-canvas") return;
    const formElementId = active.id as string;

    console.log(formElementId);
    const component = FORM_COMPONENT_TYPES.find(
      (c) => c.type === formElementId
    );
    if (!component) return;
    // Add new component on that formData
    setFormData((formData) => ({
      ...formData,
      components: [
        ...formData.components,
        {
          id: `${formElementId}x${formData.components.length}`,
          properties: {},
          required: false,
          title: component.label,
          type: formElementId as FormComponentType,
          pageId: formData.activePage,
        } as FormComponent,
      ],
    }));
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      <header className="border-b ">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              FormBuilder
            </h1>
            <div className="flex-1 max-w-md">
              <Input
                value={formData.title}
                onChange={(e) => updateFormTitle(e.target.value)}
                className="border-0 text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                placeholder="Untitled Form"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
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
                  className="border-none rounded-none shadow-none"
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
            <Button onClick={handleSaveForm} className="gap-1.5">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </header>
      <DndContext onDragEnd={handleDragEnd}>
        <main className="flex-1 container py-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3 space-y-6">
              <Tabs
                value={activeSidebarTab}
                onValueChange={setActiveSidebarTab}
              >
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="components">Components</TabsTrigger>
                  <TabsTrigger value="theme">Theme</TabsTrigger>
                </TabsList>
                <TabsContent value="components">
                  <FormComponentsSidebar onDragStart={handleDragStart} />
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
            <div className="col-span-12 md:col-span-9">
              <Card className="w-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Form Builder</h2>
                    <div className="text-sm text-muted-foreground">
                      {formData.components.length}{" "}
                      {formData.components.length === 1
                        ? "question"
                        : "questions"} {" "}
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
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </DndContext>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl p-0">
          <FormPreview
            formData={formData}
            onClose={() => setIsPreviewOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* <Dialog open={isThemeDialogOpen} onOpenChange={setIsThemeDialogOpen}>
        <DialogContent className="">
          
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default FormBuilder;
