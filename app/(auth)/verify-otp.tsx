import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import ComLogo from '@/assets/images/com-logo.svg';

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

      verifySchema.parse({ mobile, email, otp, mpin });
      const response = await fetch('https://new.bgmgameresult.in/club/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, email, otp, mpin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      router.replace('/Login');
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
      const response = await fetch('https://new.bgmgameresult.in/club/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, email }),
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
            <Text style={styles.title}>Welcome To BGM Game!</Text>
      
            <View style={[styles.logoContainer, { marginTop: 30 }]}>
                  <ComLogo width={150} height={150} />
                </View>
      
            <Text style={[styles.signupText,{ marginBottom: 30 }]}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to your mobile</Text>

      {/* Input Fields */}
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
          style={[styles.button, loading && styles.buttonDisabled]}
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

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>About Us | Privacy Policy | Refund Policy</Text>
        <Text style={styles.footerText}>Help | Cancellation Policy | Referral Policy | Withdraw Policy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e6f2e6',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#04240c',
    width: '100%',
    textAlign: 'center',
    paddingVertical: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  header: {
    width: '100%',
    backgroundColor: '#004d00',
    paddingVertical: 12,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoContainer: {
    marginVertical: 20,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#04240c',
    borderRadius: 40,
  },
  signupText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#04240c',
    marginBottom: 10,
  },
  // title: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   color: '#1a1a1a',
  //   marginTop: 20,
  // },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#004d00',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    height: 50,
    width: '90%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#05791e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#ff3b30',
    fontSize: 14,
    marginBottom: 8,
  },
  resendButton: {
    padding: 12,
    marginTop: 10,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: '#004d00',
    fontSize: 14,
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: '#999',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#004d00',
    marginVertical: 2,
  },
});
