'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant replies to support agents
 * based on the current chat context and customer history.
 *
 * - suggestReplies - A function that handles the reply suggestion process.
 * - SuggestRepliesInput - The input type for the suggestReplies function.
 * - SuggestRepliesOutput - The return type for the suggestReplies function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestRepliesInputSchema = z.object({
  chatContext: z.string().describe('The current chat context with the customer.'),
  customerHistory: z.string().describe('The history of the customer.'),
});
export type SuggestRepliesInput = z.infer<typeof SuggestRepliesInputSchema>;

const SuggestRepliesOutputSchema = z.object({
  suggestedReplies: z.array(
    z.string().describe('A suggested reply for the support agent.')
  ).describe('An array of suggested replies.'),
});
export type SuggestRepliesOutput = z.infer<typeof SuggestRepliesOutputSchema>;

export async function suggestReplies(input: SuggestRepliesInput): Promise<SuggestRepliesOutput> {
  return suggestRepliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRepliesPrompt',
  input: {
    schema: z.object({
      chatContext: z.string().describe('The current chat context with the customer.'),
      customerHistory: z.string().describe('The history of the customer.'),
    }),
  },
  output: {
    schema: z.object({
      suggestedReplies: z.array(
        z.string().describe('A suggested reply for the support agent.')
      ).describe('An array of suggested replies.'),
    }),
  },
  prompt: `You are a helpful AI assistant that suggests replies for support agents.

  Given the current chat context and customer history, suggest 3 relevant replies for the support agent to use.

  Chat Context:
  {{chatContext}}

  Customer History:
  {{customerHistory}}

  Suggested Replies:
  `,
});

const suggestRepliesFlow = ai.defineFlow<
  typeof SuggestRepliesInputSchema,
  typeof SuggestRepliesOutputSchema
>({
  name: 'suggestRepliesFlow',
  inputSchema: SuggestRepliesInputSchema,
  outputSchema: SuggestRepliesOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
