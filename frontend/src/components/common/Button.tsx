import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../utils/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title, onPress, loading, disabled, variant = 'primary', style
}) => {
  const buttonStyle = [
    styles.base,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'outline' && styles.outline,
    (disabled || loading) && styles.disabled,
    style,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled || loading}>
      {loading
        ? <ActivityIndicator color={variant === 'outline' ? COLORS.primary : '#fff'} />
        : <Text style={[styles.text, variant === 'outline' && styles.outlineText]}>{title}</Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.card },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
  disabled: { opacity: 0.6 },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
  outlineText: { color: COLORS.primary },
});
