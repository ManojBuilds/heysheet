import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type ActivityItem = {
  id: string
  endpointName: string
  createdAt: Date
}

type RecentActivityProps = {
  activities: ActivityItem[]
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 && (
          <p className="text-muted-foreground text-sm">No recent activity yet.</p>
        )}

        {activities.map((activity, idx) => (
          <div key={activity.id} className="flex items-start gap-3">
            <FileText className="w-5 h-5 mt-1 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm">
                Endpoint <span className="font-medium">‘{activity.endpointName}’</span> received a new submission
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}