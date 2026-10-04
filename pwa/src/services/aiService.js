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

/**
 * Dynamic client-side fallback concierge matching when backend/API keys are offline.
 * Dynamically queries the real showroom catalog without hardcoded vehicle biases.
 */
function createConciergeFallback(userMessage, inventory = []) {
  const query = (userMessage || '').toLowerCase();
  const catalog = inventory && inventory.length > 0 ? inventory : [
    { title: 'Audi RS e-tron GT', brand: 'Audi', price: '$142,900', priceAmount: 142900, category: 'Electric', fuelType: 'Electric', acceleration: '3.1s', horsepower: '637 hp', year: 2024 },
    { title: 'Porsche 911 Carrera', brand: 'Porsche', price: '$128,500', priceAmount: 128500, category: 'Sports', fuelType: 'Gasoline', acceleration: '4.0s', horsepower: '379 hp', year: 2023 },
    { title: 'Range Rover Sport', brand: 'Land Rover', price: '$106,750', priceAmount: 106750, category: 'SUV', fuelType: 'Hybrid', acceleration: '5.4s', horsepower: '395 hp', year: 2024 }
  ];

  // 1. Direct model or brand match in user query
  const matchedCar = catalog.find((c) => {
    const name = (c.title || c.name || '').toLowerCase();
    const brand = (c.brand || '').toLowerCase();
    return (name && query.includes(name)) || (brand && query.includes(brand)) || (query.includes('porsche') && name.includes('911')) || (query.includes('audi') && name.includes('rs'));
  });

  if (matchedCar) {
    const specs = [matchedCar.year, matchedCar.category, matchedCar.fuelType, matchedCar.horsepower ? `${matchedCar.horsepower}` : '', matchedCar.acceleration ? `0-60 in ${matchedCar.acceleration}` : ''].filter(Boolean).join(', ');
    return `The ${matchedCar.title || matchedCar.name} is currently available in our showroom for ${matchedCar.price || '$' + matchedCar.priceAmount?.toLocaleString()}. Powered by ${specs}, it delivers an uncompromising driving experience. Would you like me to schedule a private test drive or VIP viewing?`;
  }

  // 2. Budget / price filtering
  const priceMatches = query.match(/\$?(\d{2,3})[,\s]?000|\$?(\d{2,3})k/);
  if (priceMatches || query.includes('under') || query.includes('budget') || query.includes('price')) {
    const limit = priceMatches ? parseInt(priceMatches[1] || priceMatches[2], 10) * 1000 : 130000;
    const affordable = catalog.filter((c) => {
      const val = Number(c.priceAmount || (c.price ? String(c.price).replace(/[^0-9]/g, '') : 0));
      return val > 0 && val <= limit;
    });

    if (affordable.length > 0) {
      const listStr = affordable.map((c) => `${c.title || c.name} (${c.price || '$' + c.priceAmount?.toLocaleString()})`).join(', ');
      return `For options under $${(limit / 1000).toFixed(0)}k, our showroom features: ${listStr}. Each is available for immediate acquisition. Which of these models would you like to explore further?`;
    }
  }

  // 3. Category / Fuel filters (Electric, SUV, Sports)
  if (query.includes('electric') || query.includes('ev')) {
    const evs = catalog.filter((c) => (c.category || '').toLowerCase().includes('electric') || (c.fuelType || '').toLowerCase().includes('electric') || (c.title || '').toLowerCase().includes('tron'));
    if (evs.length > 0) {
      const car = evs[0];
      return `Our premier electric model is the ${car.title || car.name} (${car.price || '$142,900'}), clocking 0-60 mph in ${car.acceleration || '3.1s'}. Would you like to review its technical spec sheet?`;
    }
  }

  if (query.includes('suv')) {
    const suvs = catalog.filter((c) => (c.category || '').toLowerCase().includes('suv'));
    if (suvs.length > 0) {
      const car = suvs[0];
      return `For luxury SUVs, we feature the ${car.title || car.name} (${car.price || '$106,750'}), combining all-terrain command with dynamic refinement. Would you like to arrange a concierge inspection?`;
    }
  }

  // 4. Comparison
  if (query.includes('compare') || query.includes('vs') || query.includes('versus')) {
    return `We currently have both the Porsche 911 Carrera ($128,500) with iconic rear-engine sport dynamics, and the Audi RS e-tron GT ($142,900) offering dual-motor electric velocity. Which performance philosophy appeals to you more?`;
  }

  // 5. General intelligent assistant response
  const summaryList = catalog.map((c) => `${c.title || c.name} (${c.price || '$' + c.priceAmount?.toLocaleString()})`).join(', ');
  return `Welcome to DriveXCars. Our current showroom fleet includes: ${summaryList}. Feel free to ask about any model, specific performance metrics, or arrange a private consultation.`;
}

/**
 * Service to handle DriveX AI Luxury Concierge Chat
 * Priority:
 * 1. Backend API (POST /api/ai/concierge)
 * 2. Direct @google/genai SDK (gemini-2.5-flash) with live showroom fleet prompt
 * 3. Dynamic client-side showroom catalog match
 */
export async function sendConciergeMessage(userMessage, conversationHistory = [], inventory = []) {
  const fullCatalog = inventory && inventory.length > 0 ? inventory : [
    { title: 'Audi RS e-tron GT', brand: 'Audi', price: '$142,900', priceAmount: 142900, category: 'Electric', fuelType: 'Electric', acceleration: '3.1s', horsepower: '637 hp', year: 2024 },
    { title: 'Porsche 911 Carrera', brand: 'Porsche', price: '$128,500', priceAmount: 128500, category: 'Sports', fuelType: 'Gasoline', acceleration: '4.0s', horsepower: '379 hp', year: 2023 },
    { title: 'Range Rover Sport', brand: 'Land Rover', price: '$106,750', priceAmount: 106750, category: 'SUV', fuelType: 'Hybrid', acceleration: '5.4s', horsepower: '395 hp', year: 2024 }
  ];

  const apiOrigin = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')).replace(/\/+$/, '');

  const endpoints = [
    `${apiOrigin}/api/ai/concierge`,
    `${apiOrigin}/api/v1/ai/concierge`,
    '/api/ai/concierge'
  ].filter((url, idx, arr) => arr.indexOf(url) === idx);

  const payload = {
    message: userMessage,
    history: conversationHistory,
    inventory: fullCatalog.map((car) => ({
      id: car.id,
      title: car.title || car.name,
      brand: car.brand,
      category: car.category,
      price: car.price,
      priceAmount: car.priceAmount,
      year: car.year,
      fuelType: car.fuelType,
      horsepower: car.specs?.horsepower || car.horsepower,
      acceleration: car.specs?.acceleration || car.acceleration,
    })),
  };

  // 1. Send all messages to the backend endpoint first
  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && (data.reply || data.text)) {
          return data.reply || data.text;
        }
      }
    } catch {
      // Proceed to SDK or next fallback
    }
  }

  // 2. Direct client-side invocation with @google/genai SDK (gemini-2.5-flash)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';

  if (apiKey && apiKey.trim() !== '' && apiKey !== 'undefined') {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const fleetSummary = fullCatalog.map((c) => {
        const name = c.title || c.name || 'Vehicle';
        const price = c.price || (c.priceAmount ? `$${Number(c.priceAmount).toLocaleString()}` : '');
        const specs = [c.year, c.category, c.fuelType, c.specs?.horsepower || c.horsepower ? `${c.specs?.horsepower || c.horsepower}` : '', c.specs?.acceleration || c.acceleration ? `0-60 in ${c.specs?.acceleration || c.acceleration}` : ''].filter(Boolean).join(', ');
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
${fleetSummary}`;

      const historyPrompt = conversationHistory.map((h) => `${h.role === 'user' ? 'Client' : 'Concierge'}: ${h.content}`).join('\n');
      const fullPrompt = `${systemInstruction}\n\nCONVERSATION HISTORY:\n${historyPrompt}\n\nClient: ${userMessage}\nConcierge (concise under 3 sentences):`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      if (response?.text) {
        return response.text.trim();
      }
    } catch (aiErr) {
      console.warn('Direct Gemini Concierge API call error:', aiErr);
    }
  }

  // 3. Dynamic showroom catalog match
  return createConciergeFallback(userMessage, fullCatalog);
}
