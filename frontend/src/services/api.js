// API service voor communicatie met de backend
import axios from 'axios';

// Basis API configuratie
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor voor het toevoegen van de auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor voor error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Automatisch uitloggen bij 401 Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email, wachtwoord) => {
    const response = await API.post('/auth/login', { email, wachtwoord });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return API.post('/auth/logout');
  },
  
  getCurrentUser: async () => {
    return API.get('/auth/me');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Kunstwerken services
export const kunstwerkenService = {
  getAll: async (params) => {
    return API.get('/kunstwerken', { params });
  },
  
  getById: async (id) => {
    return API.get(`/kunstwerken/${id}`);
  },
  
  create: async (data) => {
    return API.post('/kunstwerken', data);
  },
  
  update: async (id, data) => {
    return API.put(`/kunstwerken/${id}`, data);
  },
  
  delete: async (id) => {
    return API.delete(`/kunstwerken/${id}`);
  },
  
  addAfbeelding: async (id, formData) => {
    return API.post(`/kunstwerken/${id}/afbeeldingen`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteAfbeelding: async (id, afbeeldingId) => {
    return API.delete(`/kunstwerken/${id}/afbeeldingen/${afbeeldingId}`);
  },
  
  addBijlage: async (id, formData) => {
    return API.post(`/kunstwerken/${id}/bijlagen`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteBijlage: async (id, bijlageId) => {
    return API.delete(`/kunstwerken/${id}/bijlagen/${bijlageId}`);
  }
};

// Kunstenaars services
export const kunstenaarsService = {
  getAll: async (params) => {
    return API.get('/kunstenaars', { params });
  },
  
  getById: async (id) => {
    return API.get(`/kunstenaars/${id}`);
  },
  
  create: async (data) => {
    return API.post('/kunstenaars', data);
  },
  
  update: async (id, data) => {
    return API.put(`/kunstenaars/${id}`, data);
  },
  
  delete: async (id) => {
    return API.delete(`/kunstenaars/${id}`);
  },
  
  getKunstwerken: async (id, params) => {
    return API.get(`/kunstenaars/${id}/kunstwerken`, { params });
  }
};

// Locaties services
export const locatiesService = {
  getAll: async (params) => {
    return API.get('/locaties', { params });
  },
  
  getById: async (id) => {
    return API.get(`/locaties/${id}`);
  },
  
  create: async (data) => {
    return API.post('/locaties', data);
  },
  
  update: async (id, data) => {
    return API.put(`/locaties/${id}`, data);
  },
  
  delete: async (id) => {
    return API.delete(`/locaties/${id}`);
  },
  
  getKunstwerken: async (id, params) => {
    return API.get(`/locaties/${id}/kunstwerken`, { params });
  }
};

// Rapportages services
export const rapportagesService = {
  getOverzichtsrapportage: async (params) => {
    return API.get('/rapportages/overzicht', { params });
  },
  
  getWaarderingsrapportage: async (params) => {
    return API.get('/rapportages/waardering', { params });
  },
  
  getKunstenaarRapportage: async (id, params) => {
    return API.get(`/rapportages/kunstenaar/${id}`, { params });
  },
  
  getLocatieRapportage: async (id, params) => {
    return API.get(`/rapportages/locatie/${id}`, { params });
  },
  
  exportRapportage: async (data) => {
    return API.post('/rapportages/export', data);
  }
};

// Admin services
export const adminService = {
  getGebruikers: async () => {
    return API.get('/admin/gebruikers');
  },
  
  getGebruikerById: async (id) => {
    return API.get(`/admin/gebruikers/${id}`);
  },
  
  createGebruiker: async (data) => {
    return API.post('/admin/gebruikers', data);
  },
  
  updateGebruiker: async (id, data) => {
    return API.put(`/admin/gebruikers/${id}`, data);
  },
  
  deleteGebruiker: async (id) => {
    return API.delete(`/admin/gebruikers/${id}`);
  },
  
  importData: async (type, formData) => {
    return API.post('/admin/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: { type }
    });
  },
  
  createBackup: async () => {
    return API.get('/admin/backup');
  },
  
  restoreBackup: async (formData) => {
    return API.post('/admin/restore', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

export default {
  authService,
  kunstwerkenService,
  kunstenaarsService,
  locatiesService,
  rapportagesService,
  adminService
};
