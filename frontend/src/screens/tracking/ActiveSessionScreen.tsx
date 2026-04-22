import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { logSet, completeSession } from '../../store/slices/trackingSlice';
import { Button } from '../../components/common/Button';
import { ExerciseLogCard } from '../../components/tracking/ExerciseLogCard';
import { COLORS } from '../../utils/constants';
import { WorkoutSession } from '../../types';

export const ActiveSessionScreen = ({ route, navigation }: any) => {
  const session: WorkoutSession = route.params.session;
  const dispatch = useDispatch<AppDispatch>();
  const [exerciseName, setExerciseName] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [setNumber, setSetNumber] = useState(1);
  const [currentSession, setCurrentSession] = useState(session);
  const [duration, setDuration] = useState('');

  const handleLogSet = async () => {
    if (!exerciseName || !reps) { Alert.alert('Error', 'Exercise name and reps required'); return; }
    const result = await dispatch(logSet({
      sessionId: session.id,
      data: {
        exerciseName,
        setNumber,
        reps: parseInt(reps),
        weight: weight ? parseFloat(weight) : undefined,
      },
    }));
    if (logSet.fulfilled.match(result)) {
      setCurrentSession(result.payload);
      setSetNumber(n => n + 1);
      setReps('');
      setWeight('');
    }
  };

  const handleComplete = async () => {
    const mins = duration ? parseInt(duration) : 0;
    const result = await dispatch(completeSession({ sessionId: session.id, durationMinutes: mins }));
    if (completeSession.fulfilled.match(result)) {
      Alert.alert('Workout Complete!', 'Great job!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{session.workoutName ?? 'Active Workout'}</Text>

      <View style={styles.logForm}>
        <Text style={styles.formTitle}>Log a Set</Text>
        <TextInput style={styles.input} placeholder="Exercise name" placeholderTextColor={COLORS.textSecondary}
          value={exerciseName} onChangeText={setExerciseName} />
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Reps" placeholderTextColor={COLORS.textSecondary}
            keyboardType="number-pad" value={reps} onChangeText={setReps} />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Weight (kg)" placeholderTextColor={COLORS.textSecondary}
            keyboardType="decimal-pad" value={weight} onChangeText={setWeight} />
        </View>
        <Button title={`Log Set ${setNumber}`} onPress={handleLogSet} />
      </View>

      {currentSession.exerciseLogs?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Logged Exercises</Text>
          {currentSession.exerciseLogs.map(log => <ExerciseLogCard key={log.id} log={log} />)}
        </>
      )}

      <View style={styles.finishSection}>
        <TextInput style={styles.input} placeholder="Duration (minutes)" placeholderTextColor={COLORS.textSecondary}
          keyboardType="number-pad" value={duration} onChangeText={setDuration} />
        <Button title="Finish Workout" onPress={handleComplete} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '800', marginBottom: 20 },
  logForm: { backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  formTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: COLORS.background, color: COLORS.text, borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', gap: 8 },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: 10 },
  finishSection: { marginTop: 20 },
});
