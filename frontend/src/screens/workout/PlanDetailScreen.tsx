import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { WorkoutPlan, WorkoutDay, Exercise } from '../../types';
import { COLORS } from '../../utils/constants';

const ExerciseRow = ({ exercise }: { exercise: Exercise }) => (
  <View style={styles.exerciseRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <Text style={styles.exerciseMeta}>{exercise.muscleGroup}</Text>
    </View>
    <View style={styles.exerciseSets}>
      <Text style={styles.setsText}>{exercise.sets} x {exercise.reps}</Text>
      <Text style={styles.restText}>{exercise.restSeconds}s rest</Text>
    </View>
  </View>
);

const DayCard = ({ day }: { day: WorkoutDay }) => (
  <View style={styles.dayCard}>
    <View style={styles.dayHeader}>
      <Text style={styles.dayName}>{day.dayName}</Text>
      <Text style={styles.dayFocus}>{day.focus}</Text>
    </View>
    {day.exercises?.map(ex => <ExerciseRow key={ex.id} exercise={ex} />)}
  </View>
);

export const PlanDetailScreen = ({ route }: any) => {
  const plan: WorkoutPlan = route.params.plan;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{plan.name}</Text>
        {plan.aiGenerated && <View style={styles.badge}><Text style={styles.badgeText}>AI Generated</Text></View>}
      </View>
      <Text style={styles.description}>{plan.description}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{plan.durationWeeks} weeks</Text>
        <Text style={styles.meta}>{plan.fitnessLevel}</Text>
        <Text style={styles.meta}>{plan.fitnessGoal?.replace('_', ' ')}</Text>
      </View>
      {plan.days?.map(day => <DayCard key={day.id} day={day} />)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '800', flex: 1 },
  badge: { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  description: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 16 },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  meta: { color: COLORS.textSecondary, fontSize: 12, backgroundColor: COLORS.card, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  dayCard: { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  dayName: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  dayFocus: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  exerciseName: { color: COLORS.text, fontSize: 14, fontWeight: '500' },
  exerciseMeta: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  exerciseSets: { alignItems: 'flex-end' },
  setsText: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
  restText: { color: COLORS.textSecondary, fontSize: 11 },
});
