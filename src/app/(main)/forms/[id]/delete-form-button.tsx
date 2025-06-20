"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import useSubscription from "@/hooks/useSubscription";

interface DeleteFormButtonProps {
  id: string;
  isActive: boolean;
}

const DeleteFormButton = ({ id, isActive }: DeleteFormButtonProps) => {
  const { data: subscription } = useSubscription()
  const [active, setActive] = useState(isActive);
  const router = useRouter();
  const supabase = createClient();

  const toggleActiveMutation = useMutation({
    mutationFn: async (newStatus: boolean) => {
      const { error } = await supabase
        .from("forms")
        .update({ is_active: newStatus })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, newStatus) => {
      setActive(newStatus);
      toast.success(
        `Form ${newStatus ? "activated" : "deactivated"} successfully.`,
      );
    },
    onError: (error) => {
      toast.error("Failed to update status: " + error.message);
    },
  });

  const deleteFormMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("forms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Form deleted.");
      router.push("/forms");
    },
    onError: (error) => {
      toast.error("Failed to delete form: " + error.message);
    },
  });

  return (
    <div className="space-y-6 border rounded-xl p-6 bg-card mt-6">
      <div>
        <h3 className="text-lg font-semibold mb-2"> Form Settings</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="active-toggle">Active status</Label>
          <Switch
            id="active-toggle"
            checked={active}
            onCheckedChange={(checked) => toggleActiveMutation.mutate(checked)}
            disabled={toggleActiveMutation.isPending}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-red-600 text-lg font-semibold mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This action is irreversible. Deleting this form will remove all
          associated data.
        </p>
        <Button
          variant="destructive"
          onClick={() => deleteFormMutation.mutate()}
          disabled={deleteFormMutation.isPending || subscription?.plan === "free"}
        >
          {deleteFormMutation.isPending ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Deleting...
            </>
          ) : (
            "Delete Form"
          )}
        </Button>
      </div>
    </div>
  );
};

export default DeleteFormButton;
