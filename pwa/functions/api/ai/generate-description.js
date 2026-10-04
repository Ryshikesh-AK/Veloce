import { GoogleGenAI } from '@google/genai';

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { name, brand, category, year, horsepower, acceleration, features } = body;

    if (!name || !brand) {
      return new Response(JSON.stringify({ error: 'Vehicle name and brand are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a world-class luxury automotive copywriter for DriveXCars, an elite dealership.
Generate an engaging, evocative, and prestigious vehicle description / story for the following car:

- Vehicle: ${brand} ${name}
- Category: ${category || 'Luxury'}
- Model Year: ${year || new Date().getFullYear()}
${horsepower ? `- Horsepower: ${horsepower}` : ''}
${acceleration ? `- 0-60 mph Acceleration: ${acceleration}` : ''}
${features ? `- Key Features: ${features}` : ''}

Write a captivating 2-3 paragraph detailed overview/story that highlights what makes driving this automobile an unparalleled luxury experience. Emphasize performance, craftsmanship, emotion, and prestige. Do not include markdown headers or bullet points; output only the compelling narrative paragraphs.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return new Response(JSON.stringify({ description: response.text.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to generate description' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
