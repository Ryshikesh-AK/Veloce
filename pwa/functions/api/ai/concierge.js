import { GoogleGenAI } from '@google/genai';

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { message, history = [], inventory = [] } = body;

    const userMsg = (message || '').trim();
    if (!userMsg) {
      return new Response(JSON.stringify({ error: 'Message cannot be empty.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Gemini API key is not configured.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format showroom fleet catalog
    const fleetLines = (inventory.length > 0 ? inventory : [
      { title: 'Audi RS e-tron GT', price: '$142,900', specs: '2024 Electric, 637 hp, 0-60 in 3.1s' },
      { title: 'Porsche 911 Carrera', price: '$128,500', specs: '2023 Sports, 379 hp, 0-60 in 4.0s' },
      { title: 'Range Rover Sport', price: '$106,750', specs: '2024 Luxury SUV, 395 hp, 0-60 in 5.4s' }
    ]).map((c) => {
      const name = c.title || c.name;
      const price = c.price || (c.priceAmount ? `$${Number(c.priceAmount).toLocaleString()}` : 'Inquire for pricing');
      const specs = [c.year, c.category, c.fuelType, c.horsepower ? `${c.horsepower}` : '', c.acceleration ? `0-60 in ${c.acceleration}` : ''].filter(Boolean).join(', ');
      return `- ${name} (${specs}): ${price}`;
    }).join('\n');

    const systemInstruction = `You are the DriveXCars AI Luxury Concierge, an elite, polished, and knowledgeable luxury car advisor.
Your role is to guide clients through DriveXCars's exclusive showroom fleet.

GUIDELINES:
1. Recommend specific vehicle models from the current fleet with their prices and key performance highlights.
2. Keep your answers concise, engaging, and strictly under 3 sentences.
3. Maintain a warm, prestigious, VIP tone.
4. If a client asks for something outside current inventory, graciously suggest the closest match in the showroom.

CURRENT DRIVE-X SHOWROOM INVENTORY:
${fleetLines}`;

    const historyPrompt = history.map((h) => `${h.role === 'user' ? 'Client' : 'Concierge'}: ${h.content}`).join('\n');
    const fullPrompt = `${systemInstruction}\n\nCONVERSATION HISTORY:\n${historyPrompt}\n\nClient: ${userMsg}\nConcierge (concise under 3 sentences):`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return new Response(JSON.stringify({ reply: response.text.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to generate concierge response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
