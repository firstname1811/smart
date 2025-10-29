
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
import { Resend } from 'resend';

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
  // To send actual emails, you need to:
  // 1. Get a Resend API key from https://resend.com/api-keys
  // 2. Add the key to your .env file: RESEND_API_KEY=your_key_here
  // 3. Make sure you have a verified domain in Resend to send emails from.
  if (!process.env.RESEND_API_KEY) {
    console.log("Resend API key not found. Skipping email notification.");
    return { success: false, error: "Resend API key not configured." };
  }
  
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'onboarding@resend.dev', // Must be a verified domain on Resend
      to: input.email,
      subject: 'EcoTrack Energy Alert',
      html: `<p>${input.message}</p>`,
    });

    console.log("Email sent successfully!");
    return { success: true };

  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "Failed to send email." };
  }
}
