import api from './api';
import { WorkoutSession, ProgressStats } from '../types';

export const trackingService = {
  async createSession(data: {
    workoutPlanId?: string;
    workoutDayId?: string;
    workoutName?: string;
    sessionDate: string;
    notes?: string;
  }): Promise<WorkoutSession> {
    const response = await api.post('/api/tracking/sessions', data);
    return response.data;
  },

  async getSessions(): Promise<WorkoutSession[]> {
    const response = await api.get('/api/tracking/sessions');
    return response.data;
  },

  async getSession(sessionId: string): Promise<WorkoutSession> {
    const response = await api.get(`/api/tracking/sessions/${sessionId}`);
    return response.data;
  },

  async completeSession(sessionId: string, durationMinutes: number): Promise<WorkoutSession> {
    const response = await api.patch(`/api/tracking/sessions/${sessionId}/complete`, { durationMinutes });
    return response.data;
  },

  async logSet(sessionId: string, data: {
    exerciseName: string;
    exerciseId?: string;
    setNumber: number;
    reps?: number;
    weight?: number;
    durationSeconds?: number;
  }): Promise<WorkoutSession> {
    const response = await api.post(`/api/tracking/sessions/${sessionId}/log`, data);
    return response.data;
  },

  async getStats(): Promise<ProgressStats> {
    const response = await api.get('/api/tracking/stats');
    return response.data;
  },
};
