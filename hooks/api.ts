import { useQuery, useMutation } from '@tanstack/react-query';
import * as Location from 'expo-location';

const API_URL = 'http://127.0.0.1:3500';

async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission is required');
  }

  const location = await Location.getCurrentPositionAsync({});
  const address = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  return address[0]
    ? `${address[0].street}, ${address[0].city}, ${address[0].region}, ${address[0].postalCode}, ${address[0].country}`
    : 'Unknown location';
}

// Auth API hooks
export function useLogin() {
  return useMutation({
    mutationFn: async ({ mobile, mpin }: { mobile: string; mpin: string }) => {
      const locationString = await getLocation();
      
      const response = await fetch(`${API_URL}/club/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile,
          mpin,
          last_login_Location: locationString,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return response.json();
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: async ({
      mobile,
      email,
      referralCode,
    }: {
      mobile: string;
      email: string;
      referralCode?: string;
    }) => {
      const response = await fetch(`${API_URL}/club/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile,
          email,
          referred_by: referralCode,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      return response.json();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async ({ mobile }: { mobile: string }) => {
      const locationString = await getLocation();

      const response = await fetch(`${API_URL}/club/forgot-password/`, {
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
        const error = await response.json();
        throw new Error(error.message || 'Failed to send OTP');
      }

      return response.json();
    },
  });
}

export function useVerifyOTP() {
  return useMutation({
    mutationFn: async ({
      mobile,
      email,
      otp,
      mpin,
    }: {
      mobile: string;
      email?: string;
      otp: string;
      mpin: string;
    }) => {
      const locationString = await getLocation();

      const response = await fetch(`${API_URL}/club/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile,
          ...(email && { email }),
          otp,
          mpin,
          last_login_Location: locationString,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'OTP verification failed');
      }

      return response.json();
    },
  });
}