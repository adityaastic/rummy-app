import { Stack, useSegments } from 'expo-router';
import { View } from 'react-native';
import Footer from '@/components/Footer'; // Import Footer

export default function AuthLayout() {
  const segments = useSegments();
  const showFooter = ['lobby', 'index', 'settings'].includes(segments[0]);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="verify-otp" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
       
      </Stack>
      {showFooter && <Footer />}
    </View>
  );
}
