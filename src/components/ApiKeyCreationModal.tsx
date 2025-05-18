"use client";

import { Check, Copy, Loader2, Plus, UserRoundIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { generateApiKey } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiKey } from "@/lib/settings";
import { useUser } from "@clerk/nextjs";
import { Label } from "./ui/label";

export default function ApiKeyCreationModal() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState(generateApiKey());

  const addNewApiKeyMutation = useMutation({
    mutationFn: ({
      userId,
      name,
      key,
      active,
    }: {
      userId: string;
      name: string;
      key: string;
      active: boolean;
    }) => createApiKey(userId, name, key, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },

    onError: () => toast.error("Failed to save api key"),
  });
  console.log("apiKey", apiKey);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Api key has been copied");
    setTimeout(() => setIsCopied(false), 1500);
  };

  useEffect(() => {
    setApiKey(generateApiKey());
  }, []);

  const saveApiKeyToDB = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!user) return;
      await addNewApiKeyMutation.mutate({
        name,
        userId: user.id,
        key: apiKey,
        active: true,
      });
    } catch (error) {
      toast.error("Failed to save api key");
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Generate New API Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new api key</DialogTitle>
          <DialogDescription>
            Please create a new api key and save somewhere
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={saveApiKeyToDB}>
          <div className="my-4 space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="default"
            />
            <div className="my-4 flex items-center gap-2">
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled
              />
              <Button size={"icon"} onClick={() => handleCopy(apiKey)}>
                {isCopied ? <Check /> : <Copy />}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"ghost"}>Cancel</Button>
            </DialogClose>
            <Button
              disabled={addNewApiKeyMutation.isPending}
              type="submit"
            >
              {addNewApiKeyMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
