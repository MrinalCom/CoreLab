export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  fitnessGoal: FitnessGoal;
  fitnessLevel: FitnessLevel;
}

export type FitnessGoal = 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'STRENGTH' | 'ENDURANCE' | 'GENERAL_FITNESS';
export type FitnessLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  fitnessGoal: string;
  fitnessLevel: string;
  durationWeeks: number;
  aiGenerated: boolean;
  days: WorkoutDay[];
  createdAt: string;
}

export interface WorkoutDay {
  id: string;
  dayNumber: number;
  dayName: string;
  focus: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restSeconds: number;
  type: string;
  notes: string;
}

export interface WorkoutSession {
  id: string;
  workoutPlanId?: string;
  workoutDayId?: string;
  workoutName?: string;
  sessionDate: string;
  durationMinutes?: number;
  notes?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  exerciseLogs: ExerciseLog[];
  createdAt: string;
}

export interface ExerciseLog {
  id: string;
  exerciseName: string;
  exerciseId?: string;
  sets: SetLog[];
}

export interface SetLog {
  id: string;
  setNumber: number;
  reps?: number;
  weight?: number;
  durationSeconds?: number;
  completed: boolean;
}

export interface ProgressStats {
  totalSessions: number;
  completedSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalVolumeKg: number;
  totalMinutes: number;
}
