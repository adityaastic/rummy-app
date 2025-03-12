// import { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import { Link, router } from 'expo-router';
// import { z } from 'zod';
// import * as SecureStore from 'expo-secure-store';
// import { useAuth } from '@/hooks/useAuth';
// import { Phone, Lock } from 'lucide-react-native';
// import { useLogin } from '@/hooks/api';

// const loginSchema = z.object({
//   mobile: z.string().min(10).max(10),
//   mpin: z.string().min(6).max(6),
// });

// export default function Login() {
//   const [mobile, setMobile] = useState('');
//   const [mpin, setMpin] = useState('');
//   const [error, setError] = useState('');
//   const { signIn } = useAuth();
//   const loginMutation = useLogin();

//   const handleLogin = async () => {
//     try {
//       setError('');
  
//       // Validate input
//       loginSchema.parse({ mobile, mpin });
  
//       const data = await loginMutation.mutateAsync({ mobile, mpin });
     
//       console.log("API Response:", data);
//       console.log("Token Type:", typeof data.jwt_token);
//       console.log("Token Value:", data.jwt_token);
  
//       // Ensure that the token is a valid string
//       if (!data.jwt_token || typeof data.jwt_token !== 'string') {
//         throw new Error('Invalid or missing token received from the server');
//       }

  
//       // Store the auth token
//       await SecureStore.setItemAsync('authToken', data.jwt_token);
//       await signIn(data.jwt_token);
      
//       // Navigate to home
//       router.replace('/(tabs)');
//     } catch (err) {
//       if (err instanceof z.ZodError) {
//         setError('Please check your mobile number and MPIN');
//       } else if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('An unexpected error occurred');
//       }
//     }
//   };



//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Welcome Back</Text>
//         <Text style={styles.subtitle}>Login to your account</Text>
//       </View>

//       <View style={styles.form}>
//         <View style={styles.inputContainer}>
//           <Phone size={20} color="#666" style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Mobile Number"
//             keyboardType="phone-pad"
//             value={mobile}
//             onChangeText={setMobile}
//             maxLength={10}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Lock size={20} color="#666" style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder="MPIN"
//             secureTextEntry
//             value={mpin}
//             onChangeText={setMpin}
//             maxLength={6}
//           />
//         </View>

//         <TouchableOpacity
//           style={styles.forgotButton}
//           onPress={() => router.push('/forgot-password')}
//         >
//           <Text style={styles.forgotButtonText}>Forgot MPIN?</Text>
//         </TouchableOpacity>

//         {error ? <Text style={styles.error}>{error}</Text> : null}

//         <TouchableOpacity
//           style={[styles.button, loginMutation.isPending && styles.buttonDisabled]}
//           onPress={handleLogin}
//           disabled={loginMutation.isPending}
//         >
//           {loginMutation.isPending ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Login</Text>
//           )}
//         </TouchableOpacity>

//         <View style={styles.footer}>
//           <Text style={styles.footerText}>Don't have an account? </Text>
//           <Link href="/signup" style={styles.link}>
//             Sign up
//           </Link>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     marginTop: 60,
//     marginBottom: 40,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#1a1a1a',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     lineHeight: 24,
//   },
//   form: {
//     gap: 20,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e1e1e1',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#f8f8f8',
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     height: 50,
//     fontSize: 16,
//     color: '#1a1a1a',
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   error: {
//     color: '#ff3b30',
//     fontSize: 14,
//     marginTop: -8,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 16,
//   },
//   footerText: {
//     color: '#666',
//   },
//   link: {
//     color: '#007AFF',
//     fontWeight: '600',
//   },
//   forgotButton: {
//     alignSelf: 'flex-end',
//     marginTop: -8,
//   },
//   forgotButtonText: {
//     color: '#007AFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });




import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { z } from 'zod';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/hooks/useAuth';
import { Phone, Lock } from 'lucide-react-native';
import { useLogin } from '@/hooks/api';

const loginSchema = z.object({
  mobile: z.string().min(10).max(10),
  mpin: z.string().min(6).max(6),
});

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [mpin, setMpin] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const loginMutation = useLogin();

  const handleLogin = async () => {
    try {
      setError('');

      // Validate input
      loginSchema.parse({ mobile, mpin });

      const data = await loginMutation.mutateAsync({ mobile, mpin });

      console.log("API Response:", data);
      console.log("Token Type:", typeof data.jwt_token);
      console.log("Token Value:", data.jwt_token);

      // Ensure the token is a valid string
      if (!data.jwt_token || typeof data.jwt_token !== 'string') {
        throw new Error('Invalid or missing token received from the server');
      }

      // Check if SecureStore is available before setting token
      if (await SecureStore.isAvailableAsync()) {
        await SecureStore.setItemAsync('authToken', data.jwt_token);
      } else {
        console.warn("SecureStore is not available on this device.");
      }

      await signIn(data.jwt_token);

      // Navigate to home
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError('Please check your mobile number and MPIN');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
      </View>

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

        <View style={styles.inputContainer}>
          <Lock size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="MPIN"
            secureTextEntry
            value={mpin}
            onChangeText={setMpin}
            maxLength={6}
          />
        </View>

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => router.push('/forgot-password')}
        >
          <Text style={styles.forgotButtonText}>Forgot MPIN?</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loginMutation.isPending && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/signup" style={styles.link}>
            Sign up
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
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
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
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
    marginTop: -8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#666',
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});










