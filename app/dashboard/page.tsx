import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Users, DollarSign, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,345",
      change: "+12.5%",
      icon: DollarSign,
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+5.2%",
      icon: Users,
    },
    {
      title: "Growth Rate",
      value: "23.1%",
      change: "+2.1%",
      icon: TrendingUp,
    },
    {
      title: "Conversion",
      value: "3.2%",
      change: "+0.8%",
      icon: BarChart3,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>
        <Button>New Project</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest projects and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { project: "Website Redesign", status: "In Progress", progress: 75 },
                { project: "Mobile App", status: "Review", progress: 90 },
                { project: "API Integration", status: "Planning", progress: 25 },
                { project: "Database Migration", status: "Completed", progress: 100 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.project}</h4>
                    <p className="text-sm text-muted-foreground">{item.status}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24">
                      <Progress value={item.progress} className="h-2" />
                    </div>
                    <span className="text-sm font-medium w-12">{item.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              Create New Project
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              Invite Team Member
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              View Analytics
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              Export Data
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              Account Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
