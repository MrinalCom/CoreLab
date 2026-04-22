import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { register } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';
import { COLORS, FITNESS_GOALS, FITNESS_LEVELS } from '../../utils/constants';

export const RegisterScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((s: RootState) => s.auth);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    fitnessGoal: 'GENERAL_FITNESS', fitnessLevel: 'BEGINNER',
  });

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error', 'Name, email and password are required'); return;
    }
    const result = await dispatch(register(form));
    if (register.rejected.match(result)) {
      Alert.alert('Registration Failed', result.error.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Start your fitness journey</Text>

      <Input label="Full Name" value={form.name} onChangeText={set('name')} placeholder="John Doe" />
      <Input label="Email" value={form.email} onChangeText={set('email')}
        keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" />
      <Input label="Password" value={form.password} onChangeText={set('password')}
        secureTextEntry placeholder="Min 6 characters" />

      <Text style={styles.sectionLabel}>Fitness Goal</Text>
      <View style={styles.chips}>
        {FITNESS_GOALS.map(g => (
          <Button key={g.value} title={g.label}
            variant={form.fitnessGoal === g.value ? 'primary' : 'outline'}
            onPress={() => set('fitnessGoal')(g.value)}
            style={styles.chip} />
        ))}
      </View>

      <Text style={styles.sectionLabel}>Fitness Level</Text>
      <View style={styles.chips}>
        {FITNESS_LEVELS.map(l => (
          <Button key={l.value} title={l.label}
            variant={form.fitnessLevel === l.value ? 'primary' : 'outline'}
            onPress={() => set('fitnessLevel')(l.value)}
            style={styles.chip} />
        ))}
      </View>

      <Button title="Create Account" onPress={handleRegister} loading={loading} style={styles.btn} />
      <Button title="Already have an account? Login"
        onPress={() => navigation.goBack()} variant="outline" style={styles.btn} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, paddingBottom: 48 },
  title: { color: COLORS.primary, fontSize: 30, fontWeight: '800', textAlign: 'center', marginBottom: 8, marginTop: 40 },
  subtitle: { color: COLORS.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 32 },
  sectionLabel: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { flex: 0, paddingVertical: 8, paddingHorizontal: 12, minHeight: 38 },
  btn: { marginTop: 8 },
});
