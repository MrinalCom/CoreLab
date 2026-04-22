import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchPlans, generatePlan, deletePlan } from '../../store/slices/workoutSlice';
import { WorkoutCard } from '../../components/workout/WorkoutCard';
import { Button } from '../../components/common/Button';
import { COLORS, FITNESS_GOALS, FITNESS_LEVELS } from '../../utils/constants';

export const WorkoutScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { plans, loading, generating } = useSelector((s: RootState) => s.workout);
  const [showForm, setShowForm] = useState(false);
  const [goal, setGoal] = useState('GENERAL_FITNESS');
  const [level, setLevel] = useState('BEGINNER');
  const [days, setDays] = useState(3);

  useEffect(() => { dispatch(fetchPlans()); }, []);

  const handleGenerate = async () => {
    const result = await dispatch(generatePlan({ fitnessGoal: goal, fitnessLevel: level, daysPerWeek: days }));
    if (generatePlan.fulfilled.match(result)) {
      setShowForm(false);
      Alert.alert('Success', 'Your AI workout plan is ready!');
    }
  };

  const handleDelete = (planId: string) => {
    Alert.alert('Delete Plan', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deletePlan(planId)) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Workout Plans</Text>

      {!showForm ? (
        <Button title="Generate AI Plan" onPress={() => setShowForm(true)} style={styles.generateBtn} />
      ) : (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Generate Your Plan</Text>

          <Text style={styles.label}>Fitness Goal</Text>
          <View style={styles.chips}>
            {FITNESS_GOALS.map(g => (
              <Button key={g.value} title={g.label}
                variant={goal === g.value ? 'primary' : 'outline'}
                onPress={() => setGoal(g.value)} style={styles.chip} />
            ))}
          </View>

          <Text style={styles.label}>Fitness Level</Text>
          <View style={styles.chips}>
            {FITNESS_LEVELS.map(l => (
              <Button key={l.value} title={l.label}
                variant={level === l.value ? 'primary' : 'outline'}
                onPress={() => setLevel(l.value)} style={styles.chip} />
            ))}
          </View>

          <Text style={styles.label}>Days per Week</Text>
          <View style={styles.chips}>
            {[2, 3, 4, 5, 6].map(d => (
              <Button key={d} title={`${d}x`}
                variant={days === d ? 'primary' : 'outline'}
                onPress={() => setDays(d)} style={styles.chip} />
            ))}
          </View>

          <Button title={generating ? 'Generating...' : 'Generate'} onPress={handleGenerate} loading={generating} style={{ marginTop: 8 }} />
          <Button title="Cancel" onPress={() => setShowForm(false)} variant="outline" style={{ marginTop: 8 }} />
        </View>
      )}

      {loading ? <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} /> : (
        plans.map(plan => (
          <WorkoutCard key={plan.id} plan={plan}
            onPress={() => navigation.navigate('PlanDetail', { plan })} />
        ))
      )}

      {!loading && plans.length === 0 && (
        <Text style={styles.empty}>No plans yet. Generate your first AI plan!</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20 },
  title: { color: COLORS.text, fontSize: 24, fontWeight: '800', marginBottom: 16 },
  generateBtn: { marginBottom: 20 },
  form: { backgroundColor: COLORS.card, borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  formTitle: { color: COLORS.text, fontSize: 17, fontWeight: '700', marginBottom: 16 },
  label: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { flex: 0, paddingVertical: 8, paddingHorizontal: 12, minHeight: 38 },
  empty: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 40 },
});
