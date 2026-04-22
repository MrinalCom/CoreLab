import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ExerciseLog } from '../../types';
import { COLORS } from '../../utils/constants';

interface Props {
  log: ExerciseLog;
}

export const ExerciseLogCard: React.FC<Props> = ({ log }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{log.exerciseName}</Text>
    <View style={styles.sets}>
      {log.sets.map((set, i) => (
        <View key={set.id ?? i} style={styles.set}>
          <Text style={styles.setLabel}>Set {set.setNumber}</Text>
          {set.reps !== undefined && <Text style={styles.setVal}>{set.reps} reps</Text>}
          {set.weight !== undefined && <Text style={styles.setVal}>{set.weight} kg</Text>}
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  name: { color: COLORS.text, fontSize: 15, fontWeight: '600', marginBottom: 8 },
  sets: { gap: 4 },
  set: { flexDirection: 'row', gap: 12 },
  setLabel: { color: COLORS.textSecondary, fontSize: 13, width: 50 },
  setVal: { color: COLORS.text, fontSize: 13 },
});
