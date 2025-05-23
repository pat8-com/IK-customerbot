import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, PackageSearch, BarChart3, LifeBuoy, ArrowRight } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "AI Chatbot",
    description: "Ask questions about our products and get instant, AI-powered answers.",
    href: "/chat",
    cta: "Start Chatting",
  },
  {
    icon: PackageSearch,
    title: "Product Tools",
    description: "Check product availability, estimated restock dates, and analyze popularity.",
    href: "/product-tools",
    cta: "Explore Tools",
  },
  {
    icon: LifeBuoy,
    title: "FAQ & Support",
    description: "Find answers to common questions or get in touch with our support team.",
    href: "/support",
    cta: "Get Support",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <section className="text-center py-12 md:py-16">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          Welcome to CustomerQ
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-foreground/80 sm:text-xl">
          Your intelligent assistant for all product-related inquiries. Get instant answers, check availability, and discover product trends.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/chat">
              Ask our AI Bot <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/product-tools">
              Explore Product Tools
            </Link>
          </Button>
        </div>
      </section>

      <section className="w-full max-w-5xl space-y-8">
        <h2 className="text-3xl font-semibold text-center text-primary/90">Key Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
              <CardContent>
                 <Button asChild variant="link" className="p-0 h-auto text-primary">
                    <Link href={feature.href}>
                      {feature.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full max-w-3xl py-12 md:py-16 text-center">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Why CustomerQ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <p>
                CustomerQ leverages cutting-edge AI to provide you with fast, accurate, and insightful information about our products. 
                Whether you need quick answers, want to check if an item is in stock, or are curious about what's popular, CustomerQ is here to help.
              </p>
              <p>
                Our goal is to enhance your shopping experience by making product information readily accessible and easy to understand.
              </p>
            </CardContent>
          </Card>
        </section>
    </div>
  );
}
