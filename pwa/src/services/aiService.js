import { GoogleGenAI } from '@google/genai';

/**
 * High-quality fallback generator when neither remote backend nor Gemini API key is configured.
 */
function createCuratedDescription({ name, brand, category, year, horsepower, acceleration, features }) {
  const modelYear = year || new Date().getFullYear();
  const carType = category || 'High-Performance Luxury';
  const perfSpecs = [horsepower, acceleration ? `0-60 in ${acceleration}` : null].filter(Boolean).join(', ');
  const featureList = features
    ? (typeof features === 'string' ? features : features.join(', '))
    : 'Bespoke hand-stitched leather appointments, active dynamic suspension, and an immersive sound architecture';

  return `The ${modelYear} ${brand} ${name} stands as an uncompromising pinnacle of automotive craftsmanship, engineered for those who demand effortless supremacy on the road. Cloaked in aerodynamic elegance and sculpted with pure purpose, this ${carType} commands attention before you even ignite the ignition.

Underneath its evocative silhouette lies an extraordinary powertrain${perfSpecs ? ` delivering ${perfSpecs}` : ''}, producing exhilarating acceleration coupled with razor-sharp dynamics. Every corner is navigated with surgical poise, transforming mundane highway miles into a private symphony of speed and composure.

Inside, the cabin is an exclusive sanctuary of modern luxury. Featuring ${featureList}, the interior marries progressive digital innovation with timeless tactile indulgence. Whether embarking on a grand touring expedition or arriving at an exclusive evening gala, the ${brand} ${name} guarantees an experience that is nothing short of unforgettable.`;
}

/**
 * Service to generate car descriptions using Google Gen AI SDK (@google/genai)
 * Model: gemini-2.5-flash
 */
export async function generateCarDescription(vehicleData) {
  const apiOrigin = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')).replace(/\/+$/, '');
  
  const endpoints = [
    `${apiOrigin}/api/ai/generate-description`,
    `${apiOrigin}/api/v1/ai/generate-description`,
    '/api/ai/generate-description'
  ].filter((url, idx, arr) => arr.indexOf(url) === idx);

  // 1. Try sending to the backend endpoint first
  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && (data.description || data.text)) {
          return data.description || data.text;
        }
      }
    } catch {
      // Continue to next endpoint or fallback
    }
  }

  // 2. Direct client-side invocation with @google/genai if API key is provided
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';

  if (apiKey && apiKey.trim() !== '' && apiKey !== 'undefined') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const { name, brand, category, year, horsepower, acceleration, features } = vehicleData;

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

      if (response?.text) {
        return response.text.trim();
      }
    } catch (aiErr) {
      console.warn('Direct Gemini API call failed, using high-fidelity fallback:', aiErr);
    }
  }

  // 3. Graceful fallback generation so the user experience is seamless even without live keys/offline
  return createCuratedDescription(vehicleData);
}
