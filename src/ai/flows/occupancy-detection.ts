'use server';

/**
 * @fileOverview Determines the number of occupants in a room and detects fan motion using machine learning analysis of camera input.
 *
 * - occupancyDetection - A function that handles the occupancy detection process.
 * - OccupancyDetectionInput - The input type for the occupancyDetection function.
 * - OccupancyDetectionOutput - The return type for the occupancyDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OccupancyDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OccupancyDetectionInput = z.infer<typeof OccupancyDetectionInputSchema>;

const OccupancyDetectionOutputSchema = z.object({
  occupantCount: z
    .number()
    .describe('The number of occupants detected in the room.'),
  fanInMotion: z
    .boolean()
    .describe('Whether the fan is detected to be in motion.'),
});
export type OccupancyDetectionOutput = z.infer<typeof OccupancyDetectionOutputSchema>;

export async function occupancyDetection(input: OccupancyDetectionInput): Promise<OccupancyDetectionOutput> {
  return occupancyDetectionFlow(input);
}

const occupancyDetectionPrompt = ai.definePrompt({
  name: 'occupancyDetectionPrompt',
  input: {schema: OccupancyDetectionInputSchema},
  output: {schema: OccupancyDetectionOutputSchema},
  prompt: `You are an AI that analyzes images to determine occupancy and appliance status in a room.

  Analyze the provided image and determine two things:
  1. The number of people present in the room.
  2. Whether any ceiling fan in the image is in motion.

  Optimize for privacy by focusing only on detecting human presence and fan activity.

  Image: {{media url=photoDataUri}}

  Return the number of occupants and a boolean indicating if the fan is in motion.`,
});

const occupancyDetectionFlow = ai.defineFlow(
  {
    name: 'occupancyDetectionFlow',
    inputSchema: OccupancyDetectionInputSchema,
    outputSchema: OccupancyDetectionOutputSchema,
  },
  async input => {
    const {output} = await occupancyDetectionPrompt(input);
    return output!;
  }
);
