import * as SecureStore from 'expo-secure-store';
import api from './api';

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    fitnessGoal?: string;
    fitnessLevel?: string;
  }) {
    const response = await api.post('/api/auth/register', data);
    await SecureStore.setItemAsync('auth_token', response.data.token);
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await api.post('/api/auth/login', { email, password });
    await SecureStore.setItemAsync('auth_token', response.data.token);
    return response.data;
  },

  async logout() {
    await SecureStore.deleteItemAsync('auth_token');
  },

  async getToken() {
    return SecureStore.getItemAsync('auth_token');
  },
};
