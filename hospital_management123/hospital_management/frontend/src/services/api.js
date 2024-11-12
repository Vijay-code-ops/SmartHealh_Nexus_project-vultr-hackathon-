import axios from 'axios';
import { getToken, removeToken } from './storage';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        removeToken();
        window.location.href = '/login';
      }
      
      // Return error message from backend if available
      const message = error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(message));
    }
    
    if (error.request) {
      // Network error
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Users endpoints
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Patients endpoints
export const patientsAPI = {
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  create: (patientData) => api.post('/patients', patientData),
  update: (id, patientData) => api.put(`/patients/${id}`, patientData),
  delete: (id) => api.delete(`/patients/${id}`),
  getMedicalHistory: (id) => api.get(`/patients/${id}/medical-history`),
  updateMedicalHistory: (id, historyData) => api.put(`/patients/${id}/medical-history`, historyData),
};

// Doctors endpoints
export const doctorsAPI = {
  getAll: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (doctorData) => api.post('/doctors', doctorData),
  update: (id, doctorData) => api.put(`/doctors/${id}`, doctorData),
  delete: (id) => api.delete(`/doctors/${id}`),
  getSchedule: (id, params) => api.get(`/doctors/${id}/schedule`, { params }),
  updateSchedule: (id, scheduleData) => api.put(`/doctors/${id}/schedule`, scheduleData),
};

// Appointments endpoints
export const appointmentsAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (appointmentData) => api.post('/appointments', appointmentData),
  update: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  delete: (id) => api.delete(`/appointments/${id}`),
  getAvailableSlots: (doctorId, date) => 
    api.get('/appointments/available-slots', { params: { doctorId, date } }),
};

// Beds endpoints
export const bedsAPI = {
  getAll: (params) => api.get('/beds', { params }),
  getById: (id) => api.get(`/beds/${id}`),
  create: (bedData) => api.post('/beds', bedData),
  update: (id, bedData) => api.put(`/beds/${id}`, bedData),
  delete: (id) => api.delete(`/beds/${id}`),
  assignPatient: (bedId, patientId) => api.post(`/beds/${bedId}/assign`, { patientId }),
  releasePatient: (bedId) => api.post(`/beds/${bedId}/release`),
};

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
  getOccupancyRate: () => api.get('/dashboard/occupancy-rate'),
  getAppointmentStats: () => api.get('/dashboard/appointment-stats'),
};

// File upload endpoint
export const uploadAPI = {
  uploadFile: (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Reports endpoints
export const reportsAPI = {
  generatePatientReport: (patientId, options) => 
    api.post(`/reports/patient/${patientId}`, options),
  generateOccupancyReport: (params) => 
    api.get('/reports/occupancy', { params }),
  generateRevenueReport: (dateRange) => 
    api.post('/reports/revenue', dateRange),
};

// Export the base api instance for custom requests
export default api;