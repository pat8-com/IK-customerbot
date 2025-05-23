'use server';
/**
 * @fileOverview Assesses the popularity of a product based on recent purchases using AI.
 *
 * - assessProductPopularity - A function that handles the product popularity assessment process.
 * - AssessProductPopularityInput - The input type for the assessProductPopularity function.
 * - AssessProductPopularityOutput - The return type for the assessProductPopularity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessProductPopularityInputSchema = z.object({
  productName: z.string().describe('The name of the product to assess.'),
  recentPurchaseData: z
    .string()
    .describe(
      'A string containing data about recent purchases of the product, including timestamps and quantities.'
    ),
});
export type AssessProductPopularityInput = z.infer<typeof AssessProductPopularityInputSchema>;

const AssessProductPopularityOutputSchema = z.object({
  popularityScore: z
    .number()
    .describe(
      'A numerical score representing the popularity of the product, with higher scores indicating greater popularity.'
    ),
  analysis: z
    .string()
    .describe(
      'A qualitative analysis of the product popularity, including reasons for its popularity or lack thereof.'
    ),
});
export type AssessProductPopularityOutput = z.infer<typeof AssessProductPopularityOutputSchema>;

export async function assessProductPopularity(input: AssessProductPopularityInput): Promise<
  AssessProductPopularityOutput
> {
  return assessProductPopularityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessProductPopularityPrompt',
  input: {schema: AssessProductPopularityInputSchema},
  output: {schema: AssessProductPopularityOutputSchema},
  prompt: `You are an expert in product popularity analysis.

You will analyze the recent purchase data for a given product and determine its popularity based on the provided information.

Product Name: {{{productName}}}
Recent Purchase Data: {{{recentPurchaseData}}}

Based on this data, provide a popularity score (a number between 0 and 100) and a qualitative analysis explaining the product's popularity or lack thereof.

Ensure that the popularity score is an integer between 0 and 100. Do not set the popularity score to null or undefined.
`,
});

const assessProductPopularityFlow = ai.defineFlow(
  {
    name: 'assessProductPopularityFlow',
    inputSchema: AssessProductPopularityInputSchema,
    outputSchema: AssessProductPopularityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
