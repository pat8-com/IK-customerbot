'use server';
/**
 * @fileOverview Checks the availability of a product and provides an estimated restock date if unavailable.
 *
 * - checkProductAvailability - A function that handles the product availability check.
 * - CheckProductAvailabilityInput - The input type for the checkProductAvailability function.
 * - CheckProductAvailabilityOutput - The return type for the checkProductAvailability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckProductAvailabilityInputSchema = z.object({
  productName: z.string().describe('The name of the product to check availability for.'),
});
export type CheckProductAvailabilityInput = z.infer<typeof CheckProductAvailabilityInputSchema>;

const CheckProductAvailabilityOutputSchema = z.object({
  isAvailable: z.boolean().describe('Whether the product is currently available.'),
  estimatedRestockDate: z.string().optional().describe('The estimated date when the product will be restocked if not available. Should be in ISO 8601 format.'),
  alternativeProducts: z.array(z.string()).optional().describe('If product is unavailable provide a list of alternative products the user can buy instead'),
});
export type CheckProductAvailabilityOutput = z.infer<typeof CheckProductAvailabilityOutputSchema>;

export async function checkProductAvailability(input: CheckProductAvailabilityInput): Promise<CheckProductAvailabilityOutput> {
  return checkProductAvailabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkProductAvailabilityPrompt',
  input: {schema: CheckProductAvailabilityInputSchema},
  output: {schema: CheckProductAvailabilityOutputSchema},
  prompt: `You are a customer support chatbot for an e-commerce store. A customer wants to know if a product is available and when it will be restocked if it is unavailable.

  Respond to the customer based on the following product name:
  Product Name: {{{productName}}}

  Determine if the product is available. If it is, set isAvailable to true and do not set estimatedRestockDate. If it is not, set isAvailable to false and provide an estimated restock date in ISO 8601 format (YYYY-MM-DD). If the product will never be available again, return null for estimatedRestockDate.
  Also provide up to 3 alternative products in the alternativeProducts field.
  Consider if there are alternative products that may work instead if the product requested isn't available.`, 
});

const checkProductAvailabilityFlow = ai.defineFlow(
  {
    name: 'checkProductAvailabilityFlow',
    inputSchema: CheckProductAvailabilityInputSchema,
    outputSchema: CheckProductAvailabilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
