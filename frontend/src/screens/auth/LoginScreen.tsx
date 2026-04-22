import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { login, clearError } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';
import { COLORS } from '../../utils/constants';

export const LoginScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((s: RootState) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill all fields'); return; }
    const result = await dispatch(login({ email, password }));
    if (login.rejected.match(result)) {
      Alert.alert('Login Failed', result.error.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>GymApp</Text>
      <Text style={styles.subtitle}>Welcome back</Text>

      <Input label="Email" value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" />
      <Input label="Password" value={password} onChangeText={setPassword}
        secureTextEntry placeholder="••••••••" />

      <Button title="Login" onPress={handleLogin} loading={loading} style={styles.btn} />
      <Button title="Don't have an account? Register"
        onPress={() => navigation.navigate('Register')}
        variant="outline" style={styles.btn} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, justifyContent: 'center', minHeight: '100%' },
  title: { color: COLORS.primary, fontSize: 36, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: COLORS.textSecondary, fontSize: 16, textAlign: 'center', marginBottom: 40 },
  btn: { marginTop: 8 },
});
