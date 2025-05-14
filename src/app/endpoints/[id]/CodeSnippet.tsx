'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  endpointUrl: string;
};

export default function CodeSnippet({ endpointUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('html');
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Code copied to clipboard')
  };
  
  const htmlCode = `<form action="${endpointUrl}" method="POST">
  <input type="text" name="name" placeholder="Your name" required />
  <input type="email" name="email" placeholder="Your email" required />
  <textarea name="message" placeholder="Your message" required></textarea>
  <button type="submit">Send</button>
</form>`;

  // Render the HTML form below the code snippet when HTML tab is active
  const renderHtmlForm = () => {
    if (activeTab !== 'html') return null;
    return (
      <div className="p-4 border-t bg-muted/10">
        <form action={endpointUrl} method="POST" className="space-y-2">
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
          >
            Send
          </button>
        </form>
      </div>
    );
  };

  const fetchCode = `// Using fetch API
fetch("${endpointUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello world!"
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));`;

  const reactCode = `// React example with fetch
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch("${endpointUrl}", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
      case 'html':
        return htmlCode;
      case 'fetch':
        return fetchCode;
      case 'react':
        return reactCode;
      default:
        return htmlCode;
    }
  };
  
  return (
    <div className="bg-card border rounded-md overflow-hidden">
      <div className="p-4 border-b bg-muted/50">
        <h3 className="font-medium mb-2">Integration Code</h3>
        <Tabs defaultValue="html" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="html">HTML Form</TabsTrigger>
            <TabsTrigger value="fetch">Fetch API</TabsTrigger>
            <TabsTrigger value="react">React</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm bg-muted/30 font-geist-mono">
          <code>{getCodeForTab()}</code>
        </pre>
        
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
      </div>
      {renderHtmlForm()}
    </div>
  );
}