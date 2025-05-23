import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, BookOpen, Mail } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "How do I use the AI Chatbot?",
    answer:
      "Navigate to the 'AI Chatbot' page from the sidebar. Enter the product name and your question in the respective fields, then click 'Ask AI'. The AI will provide an answer based on its knowledge.",
  },
  {
    question: "What kind of product information can I get?",
    answer:
      "You can ask about product features, specifications, usage instructions, compatibility, and more. The AI tries its best to provide accurate information.",
  },
  {
    question: "How does the Product Availability tool work?",
    answer:
      "On the 'Product Tools' page, select the 'Availability Check' tab. Enter the product name and the tool will query our system for real-time stock status and provide an estimated restock date if unavailable.",
  },
  {
    question: "What data is needed for Popularity Analysis?",
    answer:
      "The 'Popularity Analysis' tool requires the product name and a text description of recent purchase data. This could be a summary like '10 units sold last week, 50 units this month' or more detailed transaction logs if available.",
  },
  {
    question: "Is the AI always accurate?",
    answer:
      "While our AI is constantly learning and improving, it may occasionally provide incomplete or incorrect information. For critical decisions, please verify with official documentation or contact support.",
  },
];

export default function SupportPage() {
  return (
    <div className="container mx-auto py-8 space-y-10">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-3 flex items-center justify-center gap-3">
          <LifeBuoy className="h-10 w-10" />
          Help & Support
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Find answers to your questions, access documentation, or contact our support team.
        </p>
      </header>

      <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Common questions about using CustomerQ.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-foreground/90">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Documentation
            </CardTitle>
            <CardDescription>
              Explore our comprehensive guides and tutorials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 mb-4">
              Dive deeper into CustomerQ's features and capabilities with our official documentation.
            </p>
            <Button asChild>
              <Link href="#" target="_blank" rel="noopener noreferrer">
                Read Docs (Coming Soon)
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              Contact Support
            </CardTitle>
            <CardDescription>
              Can't find an answer? Reach out to our support team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 mb-4">
              If you need further assistance, please don't hesitate to contact us.
            </p>
            <Button asChild variant="outline">
              <Link href="mailto:support@customerq.example.com">
                Email Support
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
