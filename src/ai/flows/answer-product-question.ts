'use server';

/**
 * @fileOverview A flow to answer user questions about products.
 *
 * - answerProductQuestion - A function that answers a question about a product.
 * - AnswerProductQuestionInput - The input type for the answerProductQuestion function.
 * - AnswerProductQuestionOutput - The return type for the answerProductQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerProductQuestionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  question: z.string().describe('The question about the product.'),
});
export type AnswerProductQuestionInput = z.infer<typeof AnswerProductQuestionInputSchema>;

const AnswerProductQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the product.'),
});
export type AnswerProductQuestionOutput = z.infer<typeof AnswerProductQuestionOutputSchema>;

export async function answerProductQuestion(input: AnswerProductQuestionInput): Promise<AnswerProductQuestionOutput> {
  return answerProductQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerProductQuestionPrompt',
  input: {schema: AnswerProductQuestionInputSchema},
  output: {schema: AnswerProductQuestionOutputSchema},
  prompt: `You are a customer support chatbot for an e-commerce website.

  You are answering a question about a product. Answer the question as accurately and concisely as possible.

  Product Name: {{{productName}}}
  Question: {{{question}}}
  Answer: `,
});

const answerProductQuestionFlow = ai.defineFlow(
  {
    name: 'answerProductQuestionFlow',
    inputSchema: AnswerProductQuestionInputSchema,
    outputSchema: AnswerProductQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
