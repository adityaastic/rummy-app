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



import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { z } from 'zod';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/hooks/useAuth';
import { Phone, Lock , Eye, EyeOff} from 'lucide-react-native';
import { useLogin } from '@/hooks/api';
import ComLogo from '@/assets/images/com-logo.svg';  // Adjust the path if necessary
import AsyncStorage from '@react-native-async-storage/async-storage';



const loginSchema = z.object({
  mobile: z.string().min(10).max(10),
  mpin: z.string().min(6).max(6),
});

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [mpin, setMpin] = useState('');
  const [error, setError] = useState('');
  const [mpinVisible, setMpinVisible] = useState(false); // Add this state

  const { signIn,token } = useAuth();

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
      console.log("Token Value:", data.mobile);

      // Ensure the token is a valid string
      if (!data.jwt_token || typeof data.jwt_token !== 'string') {
        throw new Error('Invalid or missing token received from the server');
      }
      
      // await localStorage.setItem('mobile', data?.mobile);
      await AsyncStorage.setItem('mobile', data.mobile);

      if (await SecureStore.isAvailableAsync()) {
        await SecureStore.setItemAsync('authToken', data?.jwt_token);
      } else {
        console.warn("SecureStore is not available on this device.");
      }

      await signIn(data.jwt_token);

  
      // console.log("Navigating to /Home...");
      // router.replace("/Home")
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
      <Text style={styles.title}>Welcome To BGM Game!</Text>

      <View style={[styles.logoContainer, { marginTop: 30 }]}>
      <ComLogo width={150} height={150} />
    </View>

      <Text style={[styles.loginText ,{ marginBottom: 30 }]}>LOGIN</Text>

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
  <Lock size={20} color="#04240c" style={styles.inputIcon} />
  <TextInput
    style={styles.input}
    placeholder="MPIN"
    secureTextEntry={!mpinVisible} // Toggle visibility based on state
    value={mpin}
    onChangeText={setMpin}
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


        <TouchableOpacity style={styles.forgotButton} onPress={() => router.push('/forgot-password')}>
          <Text style={styles.forgotButtonText}>Forgotten account?</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loginMutation.isPending}>
          {loginMutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <Link href="/signup" style={styles.createAccount}>Create New Account</Link>
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
    backgroundColor: '#e6f2e6', // Light greenish background
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
  loginText: {
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
  forgotButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  forgotButtonText: {
    color: '#04240c',
    fontSize: 14,
    fontWeight: '500',
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
