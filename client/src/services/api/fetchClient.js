const API_BASE = '/api';

/**
 * Custom fetch wrapper with auth token injection, error handling,
 * and consistent response parsing. Replaces Axios.
 */
class FetchClient {
  constructor(baseURL = API_BASE) {
    this.baseURL = baseURL;
  }

  getToken() {
    return localStorage.getItem('tmf_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // If token expired, clear auth
        if (response.status === 401) {
          localStorage.removeItem('tmf_token');
          localStorage.removeItem('tmf_user');
          // Only redirect if we're not already on auth pages
          if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
            window.location.href = '/login';
          }
        }
        throw new ApiRequestError(data.message || 'Something went wrong', response.status, data.errors);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiRequestError) throw error;
      throw new ApiRequestError('Network error. Please check your connection.', 0);
    }
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

class ApiRequestError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = 'ApiRequestError';
  }
}

// Singleton instance
const api = new FetchClient();
export { api, ApiRequestError };
export default api;
