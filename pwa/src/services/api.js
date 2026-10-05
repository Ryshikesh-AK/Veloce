import { SAMPLE_CARS } from '../constants';

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')).replace(/\/+$/, '');
const API_ROOT = `${API_ORIGIN}/api/v1`;
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 12000;
const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';

export function resolveImageUrl(image) {
  if (!image || /^(https?:|data:|blob:)/i.test(image)) return image || '';
  return new URL(image.startsWith('/') ? image : `/${image}`, API_ORIGIN || window.location.origin).toString();
}

async function request(path, options = {}) {
  if (!API_ORIGIN) {
    throw new Error('Live inventory is not configured. Set VITE_API_BASE_URL to the DriveXCars API URL and redeploy.');
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    let response;
    try {
      response = await fetch(`${API_ROOT}${path}`, { ...options, signal: controller.signal });
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('The DriveXCars service took too long to respond. Please try again.');
      }
      throw new Error('Could not reach the DriveXCars service. Check your connection and try again.');
    }
    const payload = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const detail = payload?.detail;
      const message = Array.isArray(detail) ? detail.map((item) => item.msg).join(', ') : detail;
      throw new Error(message || `DriveXCars request failed (${response.status}). Please try again.`);
    }
    return payload;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function formatCarObject(car) {
  if (!car) return null;
  const rawMileage = Number(car.mileage) || 0;
  const formattedMileage = rawMileage > 0 ? `${rawMileage.toLocaleString()} miles` : 'Low Mileage';

  return {
    ...car,
    id: car.id,
    title: car.title || [car.name, car.model].filter(Boolean).join(' ') || 'Vehicle Details',
    submodel: car.submodel || car.trim || car.variant || (car.name && car.model ? car.model : ''),
    category: car.type || car.category || 'Luxury',
    mileage: rawMileage,
    mileageFormatted: formattedMileage,
    transmission: car.transmission || 'Automatic',
    fuel: car.fuel || car.fuelType || 'Petrol',
    imageUrl: resolveImageUrl(car.image || car.imageUrl),
    images: Array.isArray(car.images) && car.images.length > 0
      ? car.images.map(img => typeof img === 'object' ? resolveImageUrl(img.url || img.image_url) : resolveImageUrl(img))
      : (typeof car.images === 'string' && car.images.trim().startsWith('[')
          ? (function() { try { return JSON.parse(car.images).map(resolveImageUrl); } catch { return [resolveImageUrl(car.image || car.imageUrl)]; } })()
          : (car.image || car.imageUrl ? [resolveImageUrl(car.image || car.imageUrl)] : [])),
    documents: Array.isArray(car.documents) ? car.documents.map(doc => ({
      id: doc.id,
      fileUrl: resolveImageUrl(doc.fileUrl || doc.file_url),
      fileName: doc.fileName || doc.file_name,
      fileType: doc.fileType || doc.file_type || 'Document',
      fileSize: doc.fileSize || doc.file_size
    })) : [],
    currency: car.currency || 'USD',
    priceAmount: isNaN(Number(car.price)) ? 0 : Number(car.price),
    price: typeof car.price === 'string' && (car.price.startsWith('$') || car.price.startsWith('£') || car.price.startsWith('€'))
      ? car.price
      : new Intl.NumberFormat((car.currency || 'USD') === 'GBP' ? 'en-GB' : 'en-US', {
          style: 'currency',
          currency: car.currency || 'USD',
          maximumFractionDigits: 0
        }).format(Number(car.price) || 0),
    isFeatured: car.isFeatured
  };
}

export async function listCars(page = 1, pageSize = 50) {
  try {
    const result = await request(`/cars?page=${page}&page_size=${pageSize}`);
    const items = Array.isArray(result) ? result : (result.items || []);
    if (!items || items.length === 0) return ENABLE_MOCK_FALLBACK ? SAMPLE_CARS : [];

    return items.map(formatCarObject);
  } catch (error) {
    if (ENABLE_MOCK_FALLBACK) {
      console.warn('Backend API request failed, using SAMPLE_CARS from constants:', error.message);
      return SAMPLE_CARS;
    }
    throw error;
  }
}

export async function getCarById(id) {
  const numId = Number(id);
  const isNumeric = !isNaN(numId) && String(id).trim() !== '';

  try {
    if (isNumeric) {
      const car = await request(`/cars/${numId}`);
      if (car) return formatCarObject(car);
    }
    const sample = SAMPLE_CARS.find((c) => String(c.id) === String(id));
    if (sample) return formatCarObject(sample);
    return null;
  } catch (error) {
    console.warn(`Failed to fetch car details for ID ${id}:`, error.message);
    const sample = SAMPLE_CARS.find((c) => String(c.id) === String(id));
    if (sample) return formatCarObject(sample);
    if (ENABLE_MOCK_FALLBACK) {
      return null;
    }
    throw error;
  }
}

export function loginApi(email, password) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export function registerApi(full_name, email, password, phone = null) {
  return request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name, email, password, phone }),
  });
}

export function getMeApi(token) {
  return request('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createLeadApi(leadData, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return request('/leads', {
    method: 'POST',
    headers,
    body: JSON.stringify(leadData),
  });
}

export async function generateDescriptionApi(vehicleData) {
  const url = `${API_ORIGIN}/api/ai/generate-description`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicleData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || `Generation failed (${response.status})`);
  }
  const data = await response.json();
  return data.description;
}
