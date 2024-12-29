import { NextResponse } from 'next/server';

interface RequestBody {
  city: string;
}

export async function POST(req: Request) {
  try {
    const { city } = await req.json() as RequestBody;

    // This is where you'll add your actual xAI call
    // For now, let's create a simple riddle format
    const riddle = `In this place of mystery and might,
                   Where ${city.split(' ').length > 1 ? 'words combine' : 'letters dance'} in urban light.
                   A city's heart beats day and night,
                   Can you guess this place just right?`;

    return NextResponse.json({ 
      success: true,
      result: riddle
    });

  } catch (error) {
    console.error('API Error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ success: false, error: 'Failed to generate response' }, { status: 500 });
  }
}