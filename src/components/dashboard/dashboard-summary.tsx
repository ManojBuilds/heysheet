'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Send, Network, Bell, Key, Copy } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

const summaryData = [
  {
    label: "Total Submissions / month",
    value: "8,492",
    icon: <Send className="w-6 h-6 text-green-600" />,
  },
  {
    label: "Active Endpoints",
    value: "12",
    icon: <Network className="w-6 h-6 text-blue-600" />,
  },
  {
    label: "Gmail Accounts Connected",
    value: "3",
    icon: <Mail className="w-6 h-6 text-orange-500" />,
  },
];

// TODO: Implement DashboardSummary component
export default function DashboardSummary() {
  const apiKey = "sk-live-1234-xxxx-5678"; // example, obfuscate if needed

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API Key copied to clipboard");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex gap-6">
            <div className="bg-muted p-2 rounded-full aspect-square grid place-items-center">
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="text-xl font-semibold">{item.value}</div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardContent>
            <div className="text-sm text-muted-foreground">Api Key</div>
            <div className="flex items-center gap-2 mt-2.5">
                <Input value={apiKey} />
                <Button onClick={handleCopy} className="cursor-pointer">
                    <Copy/>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
