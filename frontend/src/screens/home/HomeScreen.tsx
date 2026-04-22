import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchStats } from '../../store/slices/trackingSlice';
import { fetchPlans } from '../../store/slices/workoutSlice';
import { COLORS } from '../../utils/constants';

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((s: RootState) => s.auth);
  const { stats } = useSelector((s: RootState) => s.tracking);
  const { plans } = useSelector((s: RootState) => s.workout);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchPlans());
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hey, {user?.name?.split(' ')[0]} 👋</Text>
      <Text style={styles.subtitle}>Let's crush today's workout</Text>

      <Text style={styles.sectionTitle}>Your Progress</Text>
      <View style={styles.statsRow}>
        <StatCard label="Workouts" value={stats?.completedSessions ?? 0} />
        <StatCard label="Streak" value={`${stats?.currentStreak ?? 0}d`} />
        <StatCard label="Minutes" value={stats?.totalMinutes ?? 0} />
      </View>

      <Text style={styles.sectionTitle}>Active Plans</Text>
      {plans.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No workout plans yet.</Text>
          <Text style={styles.emptyHint}>Generate one from the Workout tab!</Text>
        </View>
      ) : (
        plans.slice(0, 2).map(plan => (
          <View key={plan.id} style={styles.planRow}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planMeta}>{plan.days?.length ?? 0} days · {plan.durationWeeks}w</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20 },
  greeting: { color: COLORS.text, fontSize: 26, fontWeight: '800', marginTop: 8 },
  subtitle: { color: COLORS.textSecondary, fontSize: 15, marginBottom: 28 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { color: COLORS.primary, fontSize: 24, fontWeight: '800' },
  statLabel: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  emptyCard: { backgroundColor: COLORS.card, borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  emptyText: { color: COLORS.text, fontSize: 15 },
  emptyHint: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  planRow: { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  planName: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  planMeta: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
});
