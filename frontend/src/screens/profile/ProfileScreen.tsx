import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { Button } from '../../components/common/Button';
import { COLORS } from '../../utils/constants';

export const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((s: RootState) => s.auth);
  const { stats } = useSelector((s: RootState) => s.tracking);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Workouts</Text>
          <Text style={styles.statValue}>{stats?.completedSessions ?? 0}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Text style={styles.statValue}>{stats?.currentStreak ?? 0} days</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Time</Text>
          <Text style={styles.statValue}>{stats?.totalMinutes ?? 0} min</Text>
        </View>
      </View>

      <Button title="Logout" onPress={handleLogout} variant="outline" style={styles.logoutBtn} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  name: { color: COLORS.text, fontSize: 22, fontWeight: '700', marginTop: 12 },
  email: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4, marginBottom: 28 },
  statsCard: { width: '100%', backgroundColor: COLORS.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 24 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  statLabel: { color: COLORS.textSecondary, fontSize: 14 },
  statValue: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  logoutBtn: { width: '100%' },
});
