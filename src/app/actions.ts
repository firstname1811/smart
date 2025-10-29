"use server";

import {
  automatedEnergyAdjustments,
  type AutomatedEnergyAdjustmentsInput,
} from "@/ai/flows/automated-energy-adjustments";
import {
  occupancyDetection,
  type OccupancyDetectionInput,
} from "@/ai/flows/occupancy-detection";
import {
  predictEnergyUse,
  type PredictiveEnergyUseInput,
} from "@/ai/flows/predictive-energy-use-tool";

export async function detectOccupancy(
  input: OccupancyDetectionInput
) {
  const result = await occupancyDetection(input);
  return result;
}

export async function runAutomatedAdjustments(
  input: AutomatedEnergyAdjustmentsInput
) {
  const result = await automatedEnergyAdjustments(input);
  return result;
}

export async function predictEnergyUsage(
  input: PredictiveEnergyUseInput
) {
  const result = await predictEnergyUse(input);
  return result;
}

export async function sendNotification(
  input: { email: string; message: string }
) {
  // This is a placeholder for a real notification service.
  // In a real application, you would use a service like SendGrid, Resend, or Firebase Cloud Messaging.
  console.log(`Sending notification to ${input.email}: ${input.message}`);

  // Example using a hypothetical email service:
  //
  // import { EmailClient } from 'some-email-service';
  // const client = new EmailClient(process.env.EMAIL_API_KEY);
  // await client.send({
  //   to: input.email,
  //   from: 'noreply@ecotrack.app',
  //   subject: 'EcoTrack Energy Alert',
  //   body: input.message,
  // });

  return { success: true };
}
