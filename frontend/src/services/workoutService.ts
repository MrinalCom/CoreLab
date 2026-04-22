import api from './api';
import { WorkoutPlan } from '../types';

export const workoutService = {
  async generatePlan(data: {
    fitnessGoal: string;
    fitnessLevel: string;
    daysPerWeek: number;
    equipment?: string;
  }): Promise<WorkoutPlan> {
    const response = await api.post('/api/workouts/generate', data);
    return response.data;
  },

  async getMyPlans(): Promise<WorkoutPlan[]> {
    const response = await api.get('/api/workouts');
    return response.data;
  },

  async getPlan(planId: string): Promise<WorkoutPlan> {
    const response = await api.get(`/api/workouts/${planId}`);
    return response.data;
  },

  async deletePlan(planId: string): Promise<void> {
    await api.delete(`/api/workouts/${planId}`);
  },
};
