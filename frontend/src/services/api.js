const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to get Auth Header
const getAuthHeaders = () => {
  const userJson = localStorage.getItem('campusfind_user');
  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      if (user?.token) {
        return {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        };
      }
    } catch (e) {
      console.error(e);
    }
  }
  return { 'Content-Type': 'application/json' };
};

// API Services
export const authAPI = {
  login: async (emailOrId, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrId, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
    return data;
  },

  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },

  forgotPassword: async (emailOrId) => {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to process forgot password request');
    return data;
  },

  resetPassword: async ({ emailOrId, resetToken, newPassword }) => {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrId, resetToken, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Password reset failed');
    return data;
  }
};

export const itemAPI = {
  getItems: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });

    const res = await fetch(`${API_BASE_URL}/items?${queryParams.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch items');
    return data;
  },

  getItemById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/items/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch item details');
    return data;
  },

  reportLost: async (itemData) => {
    const res = await fetch(`${API_BASE_URL}/items/lost`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit lost report');
    return data;
  },

  reportFound: async (itemData) => {
    const res = await fetch(`${API_BASE_URL}/items/found`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit found report');
    return data;
  },

  claimItem: async (id, message) => {
    const res = await fetch(`${API_BASE_URL}/items/${id}/claim`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit claim');
    return data;
  },

  updateStatus: async (id, status) => {
    const res = await fetch(`${API_BASE_URL}/items/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update status');
    return data;
  },

  getMyReports: async () => {
    const res = await fetch(`${API_BASE_URL}/items/my-reports`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch my reports');
    return data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE_URL}/items/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload image');
    return data;
  }
};
