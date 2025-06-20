import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

type Endpoint = {
  id: string
  name: string
  slug: string
  description?: string
  submissionsCount: number
  createdAt: Date
}

type EndpointCardProps = {
  endpoint: Endpoint
}

export const EndpointCard = ({ endpoint }: EndpointCardProps) => {
  const fullUrl = `https://yourdomain.com/api/${endpoint.slug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl)
    toast.success('Copied to clipboard')
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{endpoint.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {endpoint.description || "No description provided."}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Endpoint URL</p>
          <div className="flex items-center justify-between bg-muted px-3 py-2 rounded-md text-sm">
            <span className="truncate">{fullUrl}</span>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{endpoint.submissionsCount} submissions</span>
          <span>Created {format(endpoint.createdAt, "MMM d, yyyy")}</span>
        </div>

        <Button variant="outline" className="w-full flex gap-2">
          <ExternalLink className="w-4 h-4" />
          View Submissions
        </Button>
      </CardContent>
    </Card>
  )
}