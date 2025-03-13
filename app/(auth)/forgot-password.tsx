import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import {Link,router } from 'expo-router';
import { z } from 'zod';
import * as Location from 'expo-location';
import { Phone } from 'lucide-react-native';
import ComLogo from '@/assets/images/com-logo.svg';

const forgotPasswordSchema = z.object({
  mobile: z.string().min(10).max(10),
});

export default function ForgotPassword() {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setError('');
      setLoading(true);

      // Validate input
      forgotPasswordSchema.parse({ mobile });

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

      const locationString = address[0]
        ? `${address[0].street}, ${address[0].city}, ${address[0].region}, ${address[0].postalCode}, ${address[0].country}`
        : 'Unknown location';

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      // Navigate to reset password screen
      router.push({
        pathname: '/reset-password',
        params: { mobile },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError('Please enter a valid mobile number');
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome To BGM Game!</Text>
      </View>

      {/* Logo */}
      <View style={[styles.logoContainer, { marginTop: 30 }]}>
                  <ComLogo width={150} height={150} />
                </View>

      {/* Title */}
      <Text style={[styles.signupText,{ marginBottom: 30 }]}>SIGN UP</Text>

      {/* Input Fields */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Phone size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={mobile}
            onChangeText={setMobile}
            maxLength={10}
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
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          
          
        </TouchableOpacity>
        <Link href="/login" style={styles.createAccount}>Already have an account? Login</Link>
      </View>

      {/* Footer Links */}
      {/* <View style={styles.footer}>
        <Text style={styles.footerText}>About Us | Privacy Policy | Refund Policy</Text>
        <Text style={styles.footerText}>Help | Cancellation Policy | Referral Policy | Withdraw Policy</Text>
      </View> */}
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
  signupText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#04240c',
    marginBottom: 10,
  },
  header: {
    width: '100%',
    
    
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
  },

  form: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderWidth: 1,
    borderColor: '#04240c',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#04240c',
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
  backButton: {
    padding: 12,
  },
  backButtonText: {
    color: '#004d00',
    fontSize: 16,
    fontWeight: 'bold',
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
  createAccount: {
    color: '#04240c',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
});

