import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { z } from 'zod';
import { Phone, Mail } from 'lucide-react-native';
import ComLogo from '@/assets/images/com-logo.svg';

const signupSchema = z.object({
  mobile: z.string().min(10).max(10),
  email: z.string().email(),
  referred_by: z.string().optional(),
});

export default function Signup() {
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setError('');
      setLoading(true);

      // Validate input
      signupSchema.parse({ mobile, email, referred_by: referralCode });

      const response = await fetch('http://127.0.0.1:3500/club/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, email, referred_by: referralCode || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Navigate to OTP verification
      router.push({ pathname: '/verify-otp', params: { mobile, email } });
    } catch (err) {
      if (err instanceof z.ZodError) {

        setError('Please check your mobile number and email');

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

      <Text style={[styles.signupText,{ marginBottom: 30 }]}>SIGN UP</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Phone size={20} color="#04240c" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={mobile}
            onChangeText={setMobile}
            maxLength={10}
          />
        </View>

        <View style={styles.inputContainer}>
          <Mail size={20} color="#04240c" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
  <TextInput
    style={[styles.input, { flex: 1 }]}
    placeholder="Referral Code (Optional)"
    autoCapitalize="none"
    value={referralCode}
    onChangeText={setReferralCode}
  />
</View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        <Link href="/login" style={styles.createAccount}>Already have an account? Login</Link>
      </View>

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
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderColor: '#04240c',
    borderWidth: 1,
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
    width: '100%',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createAccount: {
    color: '#04240c',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    color: '#ff3b30',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#04240c',
    fontSize: 12,
    textAlign: 'center',
  },
});
