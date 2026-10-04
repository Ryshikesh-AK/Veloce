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

export async function listCars(page = 1, pageSize = 50) {
  try {
    const result = await request(`/cars?page=${page}&page_size=${pageSize}`);
    const items = Array.isArray(result) ? result : (result.items || []);
    if (!items || items.length === 0) return ENABLE_MOCK_FALLBACK ? SAMPLE_CARS : [];

    return items.map((car) => ({
      ...car,
      title: [car.name, car.model].filter(Boolean).join(' '),
      category: car.type || car.category || 'Luxury',
      imageUrl: resolveImageUrl(car.image),
      images: Array.isArray(car.images) && car.images.length > 0
        ? car.images.map(resolveImageUrl)
        : (typeof car.images === 'string' && car.images.trim().startsWith('[')
            ? (function() { try { return JSON.parse(car.images).map(resolveImageUrl); } catch { return [resolveImageUrl(car.image)]; } })()
            : (car.image ? [resolveImageUrl(car.image)] : [])),
      currency: car.currency || 'USD',
      priceAmount: Number(car.price),
      price: new Intl.NumberFormat((car.currency || 'USD') === 'GBP' ? 'en-GB' : 'en-US', {
        style: 'currency',
        currency: car.currency || 'USD',
        maximumFractionDigits: 0
      }).format(Number(car.price)),
      isFeatured: car.isFeatured,
      rating: car.rating == null ? null : Number(car.rating)
    }));
  } catch (error) {
    if (ENABLE_MOCK_FALLBACK) {
      console.warn('Backend API request failed, using SAMPLE_CARS from constants:', error.message);
      return SAMPLE_CARS;
    }
    throw error;
  }
}

export function listMyTestDrives(email) {
  return request(`/test-drives/mine?email=${encodeURIComponent(email)}`).then((requests) => requests.map(normalizeTestDrive));
}

export function createTestDrive(details) {
  return request('/test-drives', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details)
  }).then(normalizeTestDrive);
}

export function loginApi(email, password) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export function getMeApi(token) {
  return request('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function normalizeTestDrive(request) {
  return { ...request, carImage: resolveImageUrl(request.carImage) };
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

