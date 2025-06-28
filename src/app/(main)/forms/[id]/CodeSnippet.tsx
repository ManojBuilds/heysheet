"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Codepen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CodeBlock from "@/components/code-block";
import { Terminal } from "lucide-react";
import { React, Python, SvelteJS, HTML5, JavaScript, } from "developer-icons";
import { Button } from "@/components/ui/button";

type Props = {
  endpointUrl: string;
};

export default function CodeSnippet({ endpointUrl }: Props) {
  const [activeTab, setActiveTab] = useState("html");

  const htmlCode = `<form action="${endpointUrl}" method="POST">
  <input type="text" name="name" placeholder="Your name" required />
  <input type="email" name="email" placeholder="Your email" required />
  <textarea name="message" placeholder="Your message" required></textarea>
  <button type="submit">Send</button>
</form>`;


  const fetchCode = `// JavaScript (Fetch API)
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

  const reactCode = `// React example
function MyForm() {
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
      if (result.success) e.target.reset();
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
  );
}`;

  const pythonCode = `import requests

url = "${endpointUrl}"
data = {
    "name": "Manoj",
    "email": "stack@x.com",
    "message": "hi"
}
r = requests.post(url, data=data)
print(r.json())`;

  const svelteCode = `<!-- SvelteKit example -->
<script>
  let name = '';
  let email = '';
  let message = '';
  async function submitForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch('${endpointUrl}', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    console.log(result);
  }
<\/script>

<form on:submit={submitForm}>
  <input name="name" bind:value={name} required />
  <input name="email" type="email" bind:value={email} required />
  <textarea name="message" bind:value={message} required /><\/textarea>
  <button type="submit">Send<\/button>
<\/form>`;

  const curlCode = `curl -X POST ${endpointUrl} \\
  -F "name=Manoj" \\
  -F "email=stack@x.com" \\
  -F "message=hi"`;

  const getCodeForTab = () => {
    switch (activeTab) {
      case "html":
        return htmlCode;
      case "fetch":
        return fetchCode;
      case "react":
        return reactCode;
      case "python":
        return pythonCode;
      case "svelte":
        return svelteCode;
      case "curl":
        return curlCode;
      default:
        return htmlCode;
    }
  };

  const tabList = [
    { value: "html", label: "Basic HTML", icon: <HTML5 className="w-4 h-4 mr-2" /> },
    { value: "fetch", label: "JavaScript (Fetch)", icon: <JavaScript className="w-4 h-4 mr-2" /> },
    { value: "react", label: "React", icon: <React className="w-4 h-4 mr-2" /> },
    { value: "python", label: "Python", icon: <Python className="w-4 h-4 mr-2" /> },
    { value: "svelte", label: "Svelte", icon: <SvelteJS className="w-4 h-4 mr-2" /> },
    { value: "curl", label: "cURL", icon: <Terminal className="w-4 h-4 mr-2" /> },
  ];

  // Function to open HTML code in CodePen
  const openInCodePen = useCallback(() => {
    const data = {
      title: "Form Example",
      html: htmlCode,
      js: "",
      css: "body { font-family: sans-serif; }",
      editors: "100",
    };
    const form = document.createElement("form");
    form.action = "https://codepen.io/pen/define";
    form.method = "POST";
    form.target = "_blank";
    form.style.display = "none";
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "data";
    input.value = JSON.stringify(data);
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }, [htmlCode]);

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Embed Code</CardTitle>
            <CardDescription>
              Copy and paste this code into your website to connect the form.
            </CardDescription>
          </div>
          <Button
            type="button"
            onClick={openInCodePen}
            title="Try in CodePen"
            size={'sm'}
            variant={'ghost'}
            leftIcon={<Codepen />}
          >
            Try it in CodePen
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative border-t">
        <Tabs defaultValue="html" className="mt-4" onValueChange={setActiveTab}>
          <TabsList>
            {tabList.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                <span className="flex items-center">{tab.icon}{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <CodeBlock
          code={getCodeForTab()}
          lang={
            activeTab === "html"
              ? "html"
              : activeTab === "python"
                ? "python"
                : activeTab === "svelte"
                  ? "markup" // Use 'markup' for Svelte for better highlighting
                  : "javascript"
          }
        />
      </CardContent>
    </Card>
  );
}
