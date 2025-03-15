import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

type AuthContextType = {
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  token: string | null;
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: async () => {},
  isLoading: true,
  token: null,
});

// ✅ Secure storage utility
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error retrieving "${key}":`, error);
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error saving "${key}":`, error);
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing "${key}":`, error);
    }
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await storage.getItem('authToken');
      setToken(storedToken);
      setIsLoading(false);
    };

    loadToken();
    if(token){
      router.push("/(tabs)/RummyGame")
      // router.push('/(tabs)/index'); // Redirect to login page

    }
  }, [token]);

  const signIn = async (newToken: string) => {
    await storage.setItem('authToken', newToken);
    setToken(newToken);
    if(token){
      
    }
  };

  const signOut = async () => {
    await storage.removeItem('authToken');
    setToken(null);
    router.replace('/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, isLoading, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
