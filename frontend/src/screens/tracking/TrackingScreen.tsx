import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchSessions, startSession } from '../../store/slices/trackingSlice';
import { Button } from '../../components/common/Button';
import { COLORS } from '../../utils/constants';

export const TrackingScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { sessions, loading } = useSelector((s: RootState) => s.tracking);

  useEffect(() => { dispatch(fetchSessions()); }, []);

  const handleStartSession = async () => {
    const today = new Date().toISOString().split('T')[0];
    const result = await dispatch(startSession({ sessionDate: today, workoutName: 'Free Workout' }));
    if (startSession.fulfilled.match(result)) {
      navigation.navigate('ActiveSession', { session: result.payload });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Workout Log</Text>
      <Button title="Start Workout" onPress={handleStartSession} style={styles.startBtn} />

      {sessions.length === 0 ? (
        <Text style={styles.empty}>No sessions logged yet. Start your first workout!</Text>
      ) : (
        sessions.map(session => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionName}>{session.workoutName ?? 'Workout'}</Text>
              <View style={[styles.statusBadge, session.status === 'COMPLETED' && styles.statusCompleted]}>
                <Text style={styles.statusText}>{session.status}</Text>
              </View>
            </View>
            <Text style={styles.sessionDate}>{session.sessionDate}</Text>
            {session.durationMinutes && (
              <Text style={styles.sessionMeta}>{session.durationMinutes} min · {session.exerciseLogs?.length ?? 0} exercises</Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20 },
  title: { color: COLORS.text, fontSize: 24, fontWeight: '800', marginBottom: 16 },
  startBtn: { marginBottom: 20 },
  empty: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 40 },
  sessionCard: { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sessionName: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  statusBadge: { backgroundColor: COLORS.border, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  statusCompleted: { backgroundColor: COLORS.success },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  sessionDate: { color: COLORS.textSecondary, fontSize: 13 },
  sessionMeta: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
});
