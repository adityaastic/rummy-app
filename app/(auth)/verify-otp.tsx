import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { z } from 'zod';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/hooks/useAuth';

const verifySchema = z.object({
  mobile: z.string().min(10).max(10),
  email: z.string().email(),
  otp: z.string().length(6),
  mpin: z.string().min(6).max(6),
});

export default function VerifyOTP() {
  const { mobile, email } = useLocalSearchParams<{ mobile: string; email: string }>();
  const [otp, setOtp] = useState('');
  const [mpin, setMpin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { signIn } = useAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    try {
      setError('');
      setLoading(true);

      verifySchema.parse({ mobile, email, otp, mpin })
      const response = await fetch('http://127.0.0.1:3500/club/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile,
          email,
          otp,
          mpin
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      router.replace('/Home');
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError('Please check your OTP and MPIN');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };



  const handleResendOTP = async () => {
    try {
      setError('');
      const response = await fetch('http://127.0.0.1:3500/club/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend OTP');
      }

      setCountdown(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to your mobile</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />

        <TextInput
          style={styles.input}
          placeholder="Set 6-digit MPIN"
          secureTextEntry
          value={mpin}
          onChangeText={setMpin}
          maxLength={6}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify & Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resendButton, countdown > 0 && styles.resendButtonDisabled]}
          onPress={handleResendOTP}
          disabled={countdown > 0}
        >
          <Text style={[styles.resendText, countdown > 0 && styles.resendTextDisabled]}>
            {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#ff3b30',
    fontSize: 14,
  },
  resendButton: {
    alignItems: 'center',
    padding: 12,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: '#999',
  },
});