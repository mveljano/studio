'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting remedial actions for employees
 *   with delayed or incomplete training, helping EHS managers address compliance gaps efficiently.
 *
 * @exported
 * - `suggestTrainingRemediation`: Function to trigger the flow and get remediation suggestions.
 * - `TrainingRemediationInput`: Input type for the `suggestTrainingRemediation` function.
 * - `TrainingRemediationOutput`: Output type for the `suggestTrainingRemediation` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the training remediation suggestion flow.
 */
const TrainingRemediationInputSchema = z.object({
  employeeName: z.string().describe('The name of the employee.'),
  trainingName: z.string().describe('The name of the training module.'),
  daysDelayed: z.number().describe('The number of days the training is delayed.'),
  completionStatus: z
    .string()
    .describe(
      'The completion status of the training (e.g., Incomplete, Partially Completed).' 
    ),
});
export type TrainingRemediationInput = z.infer<typeof TrainingRemediationInputSchema>;

/**
 * Output schema for the training remediation suggestion flow.
 */
const TrainingRemediationOutputSchema = z.object({
  remediationSuggestions: z
    .string()
    .describe('Suggested actions to remediate the delayed or incomplete training.'),
});
export type TrainingRemediationOutput = z.infer<typeof TrainingRemediationOutputSchema>;

/**
 * Wrapper function to trigger the training remediation suggestion flow.
 * @param input - The input data for the flow.
 * @returns A promise that resolves to the remediation suggestions.
 */
export async function suggestTrainingRemediation(
  input: TrainingRemediationInput
): Promise<TrainingRemediationOutput> {
  return trainingRemediationFlow(input);
}

/**
 * Prompt definition for generating training remediation suggestions.
 */
const trainingRemediationPrompt = ai.definePrompt({
  name: 'trainingRemediationPrompt',
  input: {schema: TrainingRemediationInputSchema},
  output: {schema: TrainingRemediationOutputSchema},
  prompt: `You are an EHS training specialist. An employee is delayed in completing their required training. Provide specific, actionable remediation suggestions to ensure the employee completes the training and complies with safety standards. Consider the employee's name, the training name, how many days the training is delayed, and its completion status when generating the suggestions.\n\nEmployee Name: {{{employeeName}}}\nTraining Name: {{{trainingName}}}\nDays Delayed: {{{daysDelayed}}}\nCompletion Status: {{{completionStatus}}}\n\nRemediation Suggestions:`,
});

/**
 * Genkit flow for suggesting training remediation actions.
 */
const trainingRemediationFlow = ai.defineFlow(
  {
    name: 'trainingRemediationFlow',
    inputSchema: TrainingRemediationInputSchema,
    outputSchema: TrainingRemediationOutputSchema,
  },
  async input => {
    const {output} = await trainingRemediationPrompt(input);
    return output!;
  }
);
