
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
  // To send actual emails, you need to integrate a service like Resend or SendGrid.
  console.log(`Sending notification to ${input.email}: ${input.message}`);
  
  // --- Example using Resend ---
  // 1. Install Resend: `npm install resend`
  // 2. Get an API key from https://resend.com
  // 3. Add the key to your .env file: RESEND_API_KEY=your_key_here
  // 4. Uncomment the code below:
  /*
  try {
    const { Resend } = await import('resend');
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
  */

  return { success: true, message: "Notification is a placeholder." };
}
