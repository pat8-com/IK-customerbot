"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Bot, User, Sparkles } from "lucide-react";
import type { AnswerProductQuestionInput, AnswerProductQuestionOutput } from "@/ai/flows/answer-product-question";
import { answerProductQuestion } from "@/ai/flows/answer-product-question"; // Server action
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters."),
  question: z.string().min(5, "Question must be at least 5 characters."),
});

type Message = {
  type: "user" | "bot";
  text: string;
  productName?: string;
};

export function ProductQuestionForm() {
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      question: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setMessages(prev => [...prev, { type: "user", text: values.question, productName: values.productName }]);
    
    startTransition(async () => {
      try {
        const input: AnswerProductQuestionInput = {
          productName: values.productName,
          question: values.question,
        };
        const result: AnswerProductQuestionOutput = await answerProductQuestion(input);
        setMessages(prev => [...prev, { type: "bot", text: result.answer }]);
        form.reset(); // Reset form after successful submission
      } catch (error) {
        console.error("Error answering product question:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        setMessages(prev => [...prev, { type: "bot", text: `Sorry, I encountered an error: ${errorMessage}` }]);
        toast({
          title: "Error",
          description: `Failed to get answer: ${errorMessage}`,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Bot className="h-7 w-7 text-primary" />
          Ask CustomerQ AI
        </CardTitle>
        <CardDescription>
          Have a question about a product? Our AI assistant is here to help.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SuperWidget X1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., What are its key features? Is it waterproof?"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Answer...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Ask AI
                </>
              )}
            </Button>
          </form>
        </Form>

        {messages.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-primary">Conversation</h3>
            {messages.map((msg, index) => (
              <Alert key={index} className={msg.type === 'bot' ? 'bg-secondary/50 border-secondary' : 'bg-primary/10 border-primary/20'}>
                <div className="flex items-start gap-3">
                  {msg.type === "user" ? <User className="h-5 w-5 text-primary mt-1" /> : <Bot className="h-5 w-5 text-foreground mt-1" />}
                  <div className="flex-1">
                    <AlertTitle className="font-semibold">
                      {msg.type === "user" ? (msg.productName ? `You (re: ${msg.productName})` : "You") : "CustomerQ AI"}
                    </AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap">{msg.text}</AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
             {isPending && messages[messages.length -1]?.type === 'user' && (
              <Alert className="bg-secondary/50 border-secondary">
                 <div className="flex items-start gap-3">
                   <Bot className="h-5 w-5 text-foreground mt-1" />
                   <div className="flex-1">
                      <AlertTitle className="font-semibold">CustomerQ AI</AlertTitle>
                      <AlertDescription className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Thinking...
                      </AlertDescription>
                   </div>
                 </div>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
