import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      title: "Advanced Analytics",
      description: "Get detailed insights into your data with our powerful analytics tools.",
      benefits: ["Real-time reporting", "Custom dashboards", "Data visualization"],
    },
    {
      title: "Team Collaboration",
      description: "Work together seamlessly with built-in collaboration features.",
      benefits: ["Shared workspaces", "Real-time editing", "Comment system"],
    },
    {
      title: "API Integration",
      description: "Connect with your favorite tools and services effortlessly.",
      benefits: ["REST API", "Webhooks", "Third-party integrations"],
    },
    {
      title: "Mobile Support",
      description: "Access your work from anywhere with our mobile-responsive design.",
      benefits: ["Responsive design", "Mobile app", "Offline support"],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Features</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover all the powerful features that make MyApp the perfect choice for your business.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
