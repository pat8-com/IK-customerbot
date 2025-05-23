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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, PackageCheck, PackageX, CalendarClock, ExternalLink, CheckCircle2, XCircle, ShoppingBag } from "lucide-react";
import type { CheckProductAvailabilityInput, CheckProductAvailabilityOutput } from "@/ai/flows/check-product-availability";
import { checkProductAvailability } from "@/ai/flows/check-product-availability"; // Server action
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters."),
});

export function ProductAvailabilityTool() {
  const [isPending, startTransition] = useTransition();
  const [availabilityResult, setAvailabilityResult] = useState<CheckProductAvailabilityOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setAvailabilityResult(null); // Clear previous results
    startTransition(async () => {
      try {
        const input: CheckProductAvailabilityInput = {
          productName: values.productName,
        };
        const result: CheckProductAvailabilityOutput = await checkProductAvailability(input);
        setAvailabilityResult(result);
      } catch (error) {
        console.error("Error checking product availability:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        toast({
          title: "Error",
          description: `Failed to check availability: ${errorMessage}`,
          variant: "destructive",
        });
      }
    });
  }

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "N/A";
    try {
      return new Date(isoDate).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch {
      return isoDate; // if parsing fails, show original string
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <PackageSearch className="h-6 w-6 text-primary" />
          Product Availability Check
        </CardTitle>
        <CardDescription>
          Enter a product name to check its current availability and estimated restock date.
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
                    <Input placeholder="e.g., Smart Blender Pro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "Check Availability"
              )}
            </Button>
          </form>
        </Form>

        {isPending && !availabilityResult && (
          <div className="mt-6 flex items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Checking availability...
          </div>
        )}

        {availabilityResult && (
          <div className="mt-6 space-y-4">
            <Alert variant={availabilityResult.isAvailable ? "default" : "destructive"} className={availabilityResult.isAvailable ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}>
              {availabilityResult.isAvailable ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
              <AlertTitle className="font-semibold">
                {availabilityResult.isAvailable
                  ? "Product is Available!"
                  : "Product is Currently Unavailable"}
              </AlertTitle>
              <AlertDescription>
                {availabilityResult.isAvailable
                  ? `Good news! "${form.getValues("productName")}" is currently in stock.`
                  : `"${form.getValues("productName")}" is out of stock.`}
              </AlertDescription>
            </Alert>

            {!availabilityResult.isAvailable && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2 text-primary/90">
                    <CalendarClock className="h-5 w-5" />
                    Restock Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {availabilityResult.estimatedRestockDate ? (
                    <p>
                      Estimated Restock Date: <Badge variant="secondary">{formatDate(availabilityResult.estimatedRestockDate)}</Badge>
                    </p>
                  ) : (
                    <p>No estimated restock date available. This product might be discontinued or information is pending.</p>
                  )}
                </CardContent>
              </Card>
            )}
            
            {availabilityResult.alternativeProducts && availabilityResult.alternativeProducts.length > 0 && (
                 <Card>
                    <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center gap-2 text-primary/90">
                        <ShoppingBag className="h-5 w-5" />
                        Alternative Products
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="mb-2 text-sm text-muted-foreground">
                        Consider these alternatives:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        {availabilityResult.alternativeProducts.map((altProduct, index) => (
                        <li key={index} className="text-sm">
                            {altProduct}
                        </li>
                        ))}
                    </ul>
                    </CardContent>
              </Card>
            )}

          </div>
        )}
      </CardContent>
    </Card>
  );
}
