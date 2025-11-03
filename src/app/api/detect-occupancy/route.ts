// src/app/api/detect-occupancy/route.ts
import { occupancyDetection } from '@/ai/flows/occupancy-detection';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { photoDataUri } = body;

    if (!photoDataUri) {
      return NextResponse.json(
        { error: 'photoDataUri is required' },
        { status: 400 }
      );
    }

    const result = await occupancyDetection({ photoDataUri });

    return NextResponse.json(result);
  } catch (e: unknown) {
    const error = e as Error;
    console.error('API Error:', error);
    // Check if the error message is from Genkit/Gemini about permissions
    if (error.message.includes('The caller does not have permission')) {
      return NextResponse.json(
        {
          error:
            'AI API permission error. Please ensure the Generative Language API is enabled and billing is configured in your Google Cloud project.',
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

// Optional: Handle other HTTP methods if needed
export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed. Please use POST.' },
    { status: 405 }
  );
}
