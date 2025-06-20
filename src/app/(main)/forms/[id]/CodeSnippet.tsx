"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Loader } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CodeBlock from "@/components/code-block";

type Props = {
  endpointUrl: string;
};

export default function CodeSnippet({ endpointUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("html");

  const demoFormSubmissionMutation = useMutation({
    mutationFn: (e: FormEvent) => demoFormSubmission(e),
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Code copied to clipboard");
  };

  const htmlCode = `<form action="${endpointUrl}" method="POST">
  <input type="text" name="name" placeholder="Your name" required />
  <input type="email" name="email" placeholder="Your email" required />
  <textarea name="message" placeholder="Your message" required></textarea>
  <button type="submit">Send</button>
</form>`;

  const demoFormSubmission = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const res = await fetch(endpointUrl, {
      method: "POST",
      body: formData,
    });
  };
  const renderHtmlForm = () => {
    if (activeTab !== "html") return null;
    return (
      <div className="p-4 border-t bg-muted/10">
        <form
          onSubmit={demoFormSubmissionMutation.mutate}
          className="space-y-2"
        >
          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
            className="block w-full border rounded px-2 py-1"
          />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            className="block w-full border rounded px-2 py-1"
          />
          <textarea
            name="message"
            placeholder="Your message"
            required
            className="block w-full border rounded px-2 py-1"
          ></textarea>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-1 rounded"
            disabled={demoFormSubmissionMutation.isPending}
          >
            {demoFormSubmissionMutation.isPending && (
              <Loader className="animate-spin mr-2" />
            )}
            Send
          </button>
        </form>
      </div>
    );
  };

  const fetchCode = `// Using fetch API
  const formData = new FormData();
  formData.append("name", "John Doe");
  formData.append("email", "john@example.com");
  formData.append("message", "Hello world!");
fetch("${endpointUrl}", {
  method: "POST",
  body: formData,
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));`;

  const reactCode = `// React example with fetch
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
    const response = await fetch("${endpointUrl}", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log(result);

    // Reset form on success
    if (result.success) {
      e.target.reset();
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};

return (
  <form onSubmit={handleSubmit}>
    <input name="name" placeholder="Your name" required />
    <input name="email" type="email" placeholder="Your email" required />
    <textarea name="message" placeholder="Your message" required></textarea>
    <button type="submit">Send</button>
  </form>
);`;

  const getCodeForTab = () => {
    switch (activeTab) {
      case "html":
        return htmlCode;
      case "fetch":
        return fetchCode;
      case "react":
        return reactCode;
      default:
        return htmlCode;
    }
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Embed Code</CardTitle>
        <CardDescription>
          Copy and paste this code into your website to connect the form.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative border-t">
        <Tabs defaultValue="html" className="mt-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="html">Basic HTML</TabsTrigger>
            <TabsTrigger value="fetch">JavaScript (Fetch)</TabsTrigger>
            <TabsTrigger value="react">React Sinppet</TabsTrigger>
          </TabsList>
        </Tabs>
        <CodeBlock
          code={getCodeForTab()}
          lang={activeTab === "html" ? "html" : "javascript"}
        />

        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={() => copyToClipboard(getCodeForTab())}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
