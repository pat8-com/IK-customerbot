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
import { Loader2, BarChart3, TrendingUp, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { AssessProductPopularityInput, AssessProductPopularityOutput } from "@/ai/flows/assess-product-popularity";
import { assessProductPopularity } from "@/ai/flows/assess-product-popularity"; // Server action
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters."),
  recentPurchaseData: z.string().min(10, "Purchase data must be at least 10 characters."),
});

export function ProductPopularityTool() {
  const [isPending, startTransition] = useTransition();
  const [popularityResult, setPopularityResult] = useState<AssessProductPopularityOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      recentPurchaseData: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPopularityResult(null); // Clear previous results
    startTransition(async () => {
      try {
        const input: AssessProductPopularityInput = {
          productName: values.productName,
          recentPurchaseData: values.recentPurchaseData,
        };
        const result: AssessProductPopularityOutput = await assessProductPopularity(input);
        setPopularityResult(result);
      } catch (error) {
        console.error("Error assessing product popularity:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        toast({
          title: "Error",
          description: `Failed to assess popularity: ${errorMessage}`,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <BarChart3 className="h-6 w-6 text-primary" />
          Product Popularity Analysis
        </CardTitle>
        <CardDescription>
          Assess product popularity based on recent purchase data using AI.
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
                    <Input placeholder="e.g., Eco Coffee Maker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recentPurchaseData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recent Purchase Data</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste recent purchase data here (e.g., timestamps, quantities). Example: '10 units sold on 2023-10-26, 5 units sold on 2023-10-25...'"
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Popularity"
              )}
            </Button>
          </form>
        </Form>

        {isPending && !popularityResult && (
            <div className="mt-6 flex items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing popularity data...
            </div>
        )}

        {popularityResult && (
          <div className="mt-6 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center gap-2 text-primary/90">
                  <TrendingUp className="h-5 w-5" />
                  Popularity Score for "{form.getValues("productName")}"
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Progress value={popularityResult.popularityScore} className="w-full h-3" />
                  <span className="text-lg font-semibold text-primary">
                    {popularityResult.popularityScore}/100
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Alert>
              <Activity className="h-5 w-5" />
              <AlertTitle className="font-semibold">AI Analysis</AlertTitle>
              <AlertDescription className="mt-1 whitespace-pre-wrap">
                {popularityResult.analysis}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
