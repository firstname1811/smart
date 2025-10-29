'use server';
/**
 * @fileOverview Generates a simulated energy usage report for the last 7 days.
 *
 * - generateEnergyReportFlow - A function that generates the report data.
 * - EnergyReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyUsageSchema = z.object({
  day: z.string().describe("The day of the week (e.g., 'Monday')."),
  usage: z.number().describe('The total energy usage for that day in Watt-hours (Wh).'),
});

const EnergyReportOutputSchema = z.object({
  report: z
    .array(DailyUsageSchema)
    .length(7)
    .describe('An array of 7 objects, each representing a day and its energy usage.'),
});
export type EnergyReportOutput = z.infer<typeof EnergyReportOutputSchema>;

export async function generateEnergyReport(): Promise<EnergyReportOutput> {
  return generateEnergyReportFlow();
}

const prompt = ai.definePrompt({
  name: 'generateEnergyReportPrompt',
  output: {schema: EnergyReportOutputSchema},
  prompt: `You are an AI assistant that generates simulated energy consumption data for a smart home.

  Create a realistic-looking energy usage report for the last 7 days.

  Instructions:
  1.  Generate data for each of the last 7 days (e.g., Monday, Tuesday, ... Sunday).
  2.  For each day, provide a 'usage' value representing total energy consumption in Watt-hours (Wh).
  3.  The usage values should be realistic for a small household, typically fluctuating between 1500Wh and 4000Wh.
  4.  Ensure there are variations in usage, with some days (like weekends) potentially having higher consumption than weekdays.
  5.  Return the data as an array of 7 objects, where each object has a 'day' and a 'usage' property.

  Example Output:
  {
    "report": [
      { "day": "Monday", "usage": 1860 },
      { "day": "Tuesday", "usage": 3050 },
      ...
    ]
  }
  `,
});

const generateEnergyReportFlow = ai.defineFlow(
  {
    name: 'generateEnergyReportFlow',
    outputSchema: EnergyReportOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
