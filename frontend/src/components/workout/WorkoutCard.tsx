import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WorkoutPlan } from '../../types';
import { COLORS } from '../../utils/constants';

interface WorkoutCardProps {
  plan: WorkoutPlan;
  onPress: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ plan, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.header}>
      <Text style={styles.name}>{plan.name}</Text>
      {plan.aiGenerated && (
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>AI</Text>
        </View>
      )}
    </View>
    <Text style={styles.description} numberOfLines={2}>{plan.description}</Text>
    <View style={styles.footer}>
      <Text style={styles.meta}>{plan.days?.length ?? 0} days/week</Text>
      <Text style={styles.meta}>{plan.durationWeeks} weeks</Text>
      <Text style={styles.goal}>{plan.fitnessGoal?.replace('_', ' ')}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  name: { color: COLORS.text, fontSize: 16, fontWeight: '700', flex: 1 },
  aiBadge: { backgroundColor: COLORS.primary, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  aiBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  description: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 12 },
  footer: { flexDirection: 'row', gap: 8 },
  meta: { color: COLORS.textSecondary, fontSize: 12, backgroundColor: COLORS.background, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  goal: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
});
