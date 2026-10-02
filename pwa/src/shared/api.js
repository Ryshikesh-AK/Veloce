const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');
const API_ROOT = `${API_ORIGIN}/api/v1`;

export function resolveImageUrl(image) {
  if (!image || /^(https?:|data:|blob:)/i.test(image)) return image || '';
  return new URL(image.startsWith('/') ? image : `/${image}`, API_ORIGIN).toString();
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_ROOT}${path}`, options);
  } catch {
    throw new Error('Could not reach the Veloce service. Check your connection and try again.');
  }
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const detail = payload?.detail;
    const message = Array.isArray(detail) ? detail.map((item) => item.msg).join(', ') : detail;
    throw new Error(message || `Request failed (${response.status})`);
  }
  return payload;
}

export async function listCars() {
  const cars = [];
  let page = 1;
  let total = Infinity;

  while (cars.length < total) {
    const result = await request(`/cars?page=${page}&page_size=100`);
    cars.push(...result.items);
    total = result.total;
    if (result.items.length === 0) break;
    page += 1;
  }

  return cars.map((car) => ({
    ...car,
    title: [car.name, car.model].filter(Boolean).join(' '),
    category: car.type,
    imageUrl: resolveImageUrl(car.image),
    price: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(Number(car.price)),
    isFeatured: car.isFeatured,
    rating: car.rating == null ? null : Number(car.rating)
  }));
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

function normalizeTestDrive(request) {
  return { ...request, carImage: resolveImageUrl(request.carImage) };
}