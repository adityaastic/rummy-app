import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { z } from 'zod';
import * as Location from 'expo-location';
import { Lock, KeyRound } from 'lucide-react-native';
import ComLogo from '@/assets/images/com-logo.svg';
import { Eye, EyeOff } from 'lucide-react-native'; // Add this import


const resetPasswordSchema = z.object({
  mobile: z.string().min(10).max(10),
  otp: z.string().length(6),
  mpin: z.string().min(6).max(6),
});

export default function ResetPassword() {
  const { mobile } = useLocalSearchParams<{ mobile: string }>();
  const [otp, setOtp] = useState('');
  const [mpin, setMpin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [mpinVisible, setMpinVisible] = useState(false); // Add this state


  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendOTP = async () => {
    try {
      setError('');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const locationString = address[0] ? 
        `${address[0].street}, ${address[0].city}, ${address[0].region}, ${address[0].postalCode}, ${address[0].country}` :
        'Unknown location';

      const response = await fetch('https://new.bgmgameresult.in/club/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile,
          last_login_Location: locationString,
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

  const handleSubmit = async () => {
    try {
      setError('');
      setLoading(true);

      // Validate input
      resetPasswordSchema.parse({ mobile, otp, mpin });

      // Get location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const locationString = address[0] ? 
        `${address[0].street}, ${address[0].city}, ${address[0].region}, ${address[0].postalCode}, ${address[0].country}` :
        'Unknown location';

      const response = await fetch('https://new.bgmgameresult.in/club/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile,
          otp,
          mpin,
          last_login_Location: locationString,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset MPIN');
      }

      // Navigate back to login
      router.replace('/login');
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

  return (
    
    <View style={styles.container}>
                <Text style={styles.title}>Welcome To BGM Game!</Text>
          
                <View style={[styles.logoContainer, { marginTop: 30 }]}>
                      <ComLogo width={150} height={150} />
                    </View>
          
                <Text style={[styles.signupText,{ marginBottom: 30 }]}>Reset MPIN</Text>

      <Text style={styles.subtitle}>
        Enter the OTP sent to your mobile and set a new MPIN
      </Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <KeyRound size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
          />
            <TouchableOpacity onPress={() => setMpinVisible(!mpinVisible)}>
      {mpinVisible ? (
       <Eye size={20} color="#04240c" />
      ) : (
        <EyeOff size={20} color="#04240c" /> 
      )}
    </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Set New MPIN"
            secureTextEntry={!mpinVisible} 
            value={mpin}
            onChangeText={setMpin}
            maxLength={6}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Reset MPIN</Text>
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
    textAlign: 'center',
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
  form: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#004d00',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    width: '90%',
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1a1a1a',
  },
  button: {
    backgroundColor: '#05791e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    marginTop: 8,
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
  resendText: {
    color: '#004d00',
    fontSize: 14,
    fontWeight: '600',
  },
});
