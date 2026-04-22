import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '../../utils/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => (
  <View style={styles.container}>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      style={[styles.input, error && styles.inputError, style]}
      placeholderTextColor={COLORS.textSecondary}
      {...props}
    />
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 6, fontWeight: '500' },
  input: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: { borderColor: COLORS.error },
  error: { color: COLORS.error, fontSize: 12, marginTop: 4 },
});
