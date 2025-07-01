"use client";

import { FormEvent, useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import SpreadsheetsPicker from "./SpreadsheetsPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SPREADSHEET_TEMPLATES } from "@/lib/spreadsheet-templates";
import { createForm } from "@/actions";
import { useGoogleAccounts } from "@/hooks/use-google-accounts-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CallbackDoc } from "react-google-drive-picker/dist/typeDefs";
import useSubscription from "@/hooks/useSubscription";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import { useUpgradeModalStore } from "@/stores/upgradeModalStore";
import { planLimits } from "@/lib/planLimits";

const CreateFormModal = () => {
  const supabase = createClient();
  const { userId } = useAuth();
  const { data: subscription } = useSubscription();
  const { openUpgradeModal } = useUpgradeModalStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { selectedAccount } = useGoogleAccounts();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [sheet, setSheet] = useState<CallbackDoc | null>(null);
  const [template, setTemplate] = useState<
    keyof typeof SPREADSHEET_TEMPLATES | null
  >(null);

  const { data: formCount } = useQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const { error, count, data } = await supabase
        .from("forms")
        .select("*")
        .eq("user_id", userId);
      console.log("forms;data", data);

      if (error) throw error;
      return data?.length;
    },
    enabled: !!userId,
  });
  console.log("@formCount", formCount);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.info("Please enter a form title");
      return;
    }

    if (!selectedAccount) {
      toast.info("No Google account selected");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createForm({
          title: title.trim(),
          sheetId: sheet?.id || undefined,
          template: template || undefined,
          googleAccountId: selectedAccount.id,
          email: selectedAccount.email,
        });

        if (result?.error) {
          toast.error(`Error creating form: ${result.error}`);
        } else {
          console.log("Form created successfully:", result.data);
          setIsOpen(false);
          // Reset form
          setTitle("");
          setSheet(null);
          setTemplate(null);
          router.push(`/forms/${result.data.id}`);
        }
      } catch (error) {
        console.error("Error creating form:", error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  const handleDialogOpen = () => {
    console.log("hello", formCount);
    if (!formCount) return;
    const maxForms =
      planLimits[subscription?.plan as keyof typeof planLimits].maxForms ?? 1;
    const isMaxFormsReached = formCount >= maxForms;
    if (isMaxFormsReached) {
      openUpgradeModal({
        heading: "Upgrade to Add More Forms",
        subHeading:
          "You’ve created the max forms allowed on your plan. Upgrade to continue.",
      });
      return;
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger onClick={handleDialogOpen} asChild>
        <Button>
          <Plus />
          Create Form
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Form</DialogTitle>
            <DialogDescription>
              Create a new form to collect data from your users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Mailing List"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2 w-full">
              <Label>Pick a template</Label>
              <Select
                onValueChange={(value) => {
                  setTemplate(value as keyof typeof SPREADSHEET_TEMPLATES);
                  setSheet(null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(SPREADSHEET_TEMPLATES).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 w-full">
              <Separator className="flex-1" />
              OR
              <Separator className="flex-1" />
            </div>
            {selectedAccount && (
              <SpreadsheetsPicker
                onPicked={(data) => {
                  setSheet(data.docs?.[0] || null);
                  setTitle(data.docs?.[0].name || "");
                  setTemplate(null);
                  setIsOpen(true);
                }}
                selectedSheet={sheet}
              />
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateFormModal;
