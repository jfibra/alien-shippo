import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to MyApp</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A simple and powerful solution for all your needs. Get started today and experience the difference.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/features">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose MyApp?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Easy to Use</CardTitle>
              <CardDescription>Intuitive interface designed for everyone</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get up and running in minutes with our user-friendly design.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reliable</CardTitle>
              <CardDescription>99.9% uptime guarantee</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Count on us to keep your business running smoothly.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secure</CardTitle>
              <CardDescription>Enterprise-grade security</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Your data is protected with the latest security measures.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
