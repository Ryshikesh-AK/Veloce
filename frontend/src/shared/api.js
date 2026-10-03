const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');
const API_ROOT = `${API_ORIGIN}/api/v1`;
const ADMIN_TOKEN_KEY = 'veloce-admin-token';
const ADMIN_EMAIL_KEY = 'veloce-admin-email';

export const getAdminToken = () => sessionStorage.getItem(ADMIN_TOKEN_KEY);
export const getAdminEmail = () => sessionStorage.getItem(ADMIN_EMAIL_KEY);

export const clearAdminToken = () => {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_EMAIL_KEY);
};

export function resolveImageUrl(image) {
  if (!image || /^(https?:|data:|blob:)/i.test(image)) return image || '';
  return `${API_ORIGIN}${image.startsWith('/') ? image : `/${image}`}`;
}

export function normalizeCar(car) {
  return {
    ...car,
    price: Number(car.price),
    currency: car.currency || 'USD',
    costBasis: car.costBasis == null ? null : Number(car.costBasis),
    soldPrice: car.soldPrice == null ? null : Number(car.soldPrice),
    pendingAmount: car.pendingAmount == null ? null : Number(car.pendingAmount),
    rating: car.rating == null ? null : Number(car.rating),
    imagePath: car.image,
    image: resolveImageUrl(car.image)
  };
}

async function request(path, { body, headers: suppliedHeaders, auth = false, method = 'GET' } = {}) {
  const headers = new Headers(suppliedHeaders);
  const token = getAdminToken();
  if (auth && !token) throw new Error('Sign in as an administrator to continue.');
  if (auth && token) headers.set('Authorization', `Bearer ${token}`);
  if (body !== undefined && !(body instanceof Blob) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_ROOT}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : body instanceof Blob ? body : JSON.stringify(body)
  });
  if (response.status === 401 && auth) {
    clearAdminToken();
    window.dispatchEvent(new Event('veloce-admin-session-expired'));
  }
  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = payload?.detail;
    const message = Array.isArray(detail) ? detail.map((item) => item.msg).join(', ') : detail;
    throw new Error(message || `Request failed (${response.status})`);
  }
  return payload;
}

export const carApi = {
  async list() {
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
    return cars.map(normalizeCar);
  },
  login(email, password) {
    return request('/auth/login', { method: 'POST', body: { email, password } }).then((result) => {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, result.access_token);
      sessionStorage.setItem(ADMIN_EMAIL_KEY, email.trim().toLowerCase());
      return result;
    });
  },
  create(car) {
    return request('/cars', { method: 'POST', body: car, auth: true }).then(normalizeCar);
  },
  update(id, changes) {
    return request(`/cars/${id}`, { method: 'PATCH', body: changes, auth: true }).then(normalizeCar);
  },
  remove(id) {
    return request(`/cars/${id}`, { method: 'DELETE', auth: true });
  },
  createTestDrive(requestDetails) {
    return request('/test-drives', { method: 'POST', body: requestDetails });
  },
  listMyTestDrives(email) {
    return request(`/test-drives/mine?email=${encodeURIComponent(email)}`);
  },
  listTestDrives() {
    return request('/test-drives', { auth: true });
  },
  reviewTestDrive(id, status, approvedAt) {
    return request(`/test-drives/${id}`, {
      method: 'PATCH',
      body: { status, approvedAt },
      auth: true
    });
  },
  uploadImage(file) {
    return request('/cars/images', {
      method: 'POST',
      body: file,
      headers: { 'Content-Type': file.type },
      auth: true
    });
  }
};