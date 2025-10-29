'use server';

import {
  automatedEnergyAdjustments,
  type AutomatedEnergyAdjustmentsInput,
} from '@/ai/flows/automated-energy-adjustments';
import { occupancyDetection, type OccupancyDetectionInput } from '@/ai/flows/occupancy-detection';
import {
  predictEnergyUse,
  type PredictiveEnergyUseInput,
} from '@/ai/flows/predictive-energy-use-tool';
import { z } from 'zod';

export async function runAutomatedAdjustments(input: AutomatedEnergyAdjustmentsInput) {
  return await automatedEnergyAdjustments(input);
}

export async function detectOccupancy(input: OccupancyDetectionInput) {
  return await occupancyDetection(input);
}

const PredictiveEnergyUseSchema = z.object({
  historicalData: z.string(),
  currentDate: z.string(),
  preferences: z.string().optional(),
});

export async function predictEnergyUsage(
  input: z.infer<typeof PredictiveEnergyUseSchema>
): Promise<{ prediction: string; suggestions: string }> {
  return await predictEnergyUse(input);
}
