import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      description: "Perfect for individuals getting started",
      features: ["Up to 5 projects", "Basic analytics", "Email support", "1GB storage"],
    },
    {
      name: "Professional",
      price: "$29",
      description: "Great for growing teams",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "10GB storage",
        "Team collaboration",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Dedicated support",
        "Unlimited storage",
        "Advanced security",
        "SLA guarantee",
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your needs. All plans include a 14-day free trial.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className={plan.popular ? "border-primary shadow-lg" : ""}>
            <CardHeader>
              {plan.popular && (
                <div className="text-center">
                  <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardTitle className="text-center">{plan.name}</CardTitle>
              <CardDescription className="text-center">{plan.description}</CardDescription>
              <div className="text-center">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
