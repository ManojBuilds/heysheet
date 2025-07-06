"use client";

import { updateForm } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { Globe, Plus, X, SaveIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const DomainManager = ({
  domains,
  formId,
}: {
  domains: string[] | null;
  formId: string;
}) => {
  const [domainList, setDomainList] = useState<string[]>(domains || []);
  const [newDomain, setNewDomain] = useState("");

  const updateFormMutation = useMutation({
    mutationFn: async ({ domains }: { domains: string[] }) =>
      updateForm({ domains }, formId),
    onSuccess: () => {
      toast.success("Allowed domains updated successfully");
    },
    onError: (e) => {
      console.log(e);
      toast.error("Failed to update allowed domains");
    },
  });

  const extractDomainFromUrl = (input: string): string => {
    try {
      // If input looks like a URL, extract the hostname
      if (input.includes('://')) {
        const url = new URL(input);
        return url.hostname;
      }
      // If it starts with www., return as is
      if (input.startsWith('www.')) {
        return input;
      }
      // Otherwise assume it's already a domain
      return input;
    } catch {
      // If URL parsing fails, return the original input
      return input;
    }
  };

  const validateDomain = (domain: string): { isValid: boolean; error?: string } => {
    if (!domain.trim()) {
      return { isValid: false, error: "Domain cannot be empty" };
    }

    const trimmedDomain = domain.trim().toLowerCase();

    // Allow localhost and localhost with ports for testing
    if (trimmedDomain === 'localhost' || trimmedDomain.startsWith('localhost:')) {
      return { isValid: true };
    }

    // Allow IP addresses (for local development)
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::[0-9]+)?$/;
    if (ipRegex.test(trimmedDomain)) {
      return { isValid: true };
    }

    // Validate regular domains
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(trimmedDomain)) {
      return { 
        isValid: false, 
        error: "Please enter a valid domain (e.g., example.com, localhost, or 192.168.1.1:3000)" 
      };
    }

    return { isValid: true };
  };

  const addDomain = () => {
    if (!newDomain.trim()) return;
    
    const extractedDomain = extractDomainFromUrl(newDomain.trim());
    const validation = validateDomain(extractedDomain);
    
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    const normalizedDomain = extractedDomain.toLowerCase();
    
    if (domainList.map(d => d.toLowerCase()).includes(normalizedDomain)) {
      toast.error("Domain already exists in the list");
      return;
    }

    setDomainList([...domainList, normalizedDomain]);
    setNewDomain("");
  };

  const removeDomain = (domainToRemove: string) => {
    setDomainList(domainList.filter(domain => domain !== domainToRemove));
  };

  const saveDomains = () => {
    updateFormMutation.mutate({ domains: domainList });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addDomain();
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Domain Restrictions
        </CardTitle>
        <CardDescription>
          Restrict form submissions to specific domains. Leave empty to allow all domains.
          This helps prevent unauthorized submissions from other websites.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Allowed Domains</Label>
          <p className="text-muted-foreground text-sm">
            Add domains or paste URLs. Supports domains (example.com), localhost (localhost:3000), and IP addresses (192.168.1.1:8080).
          </p>
          
          {domainList.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md">
              {domainList.map((domain, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 font-mono">
                  {domain}
                  <button
                    onClick={() => removeDomain(domain)}
                    className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="example.com, localhost:3000, or https://mysite.com"
              className="font-mono"
            />
            <Button onClick={addDomain} variant="outline" size="sm">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={saveDomains}
            disabled={updateFormMutation.isPending}
          >
            {updateFormMutation.isPending ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <SaveIcon className="w-4 h-4" />
            )}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
