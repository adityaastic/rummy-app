// import { createContext, useContext, useEffect, useState } from 'react';
// import { Platform } from 'react-native';
// import * as SecureStore from 'expo-secure-store';
// import { router } from 'expo-router';

// type AuthContextType = {
//   signIn: (token: string) => Promise<void>;
//   signOut: () => Promise<void>;
//   isLoading: boolean;
//   token: string | null;
// };

// // Web-compatible storage implementation
// const storage = {
//   async getItem(key: string): Promise<string | null> {
//     if (Platform.OS === 'web') {
//       return localStorage.getItem(key);
//     }
//     return SecureStore.getItemAsync(key);
//   },
//   async setItem(key: string, value: string): Promise<void> {
//     if (Platform.OS === 'web') {
//       localStorage.setItem(key, value);
//       return;
//     }
//     return SecureStore.setItemAsync(key, value);
//   },
//   async removeItem(key: string): Promise<void> {
//     if (Platform.OS === 'web') {
//       localStorage.removeItem(key);
//       return;
//     }
//     return SecureStore.deleteItemAsync(key);
//   },
// };

// const AuthContext = createContext<AuthContextType>({
//   signIn: async () => {},
//   signOut: async () => {},
//   isLoading: true,
//   token: null,
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [token, setToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     storage.getItem('authToken').then((token) => {
//       setToken(token);
//       setIsLoading(false);
//     });
//   }, []);

//   const signIn = async (token: string) => {
//     await storage.setItem('authToken', token);
//     setToken(token);
//   };

//   const signOut = async () => {
//     await storage.removeItem('authToken');
//     setToken(null);
//     router.replace('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ signIn, signOut, isLoading, token }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

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

// Web-compatible storage implementation
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        // Check if localStorage is available (web environment)
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        throw new Error('localStorage is not available');
      }
      // Use SecureStore for native platforms
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error retrieving item from storage:', error);
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Check if localStorage is available (web environment)
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
          return;
        }
        throw new Error('localStorage is not available');
      }
      // Use SecureStore for native platforms
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error saving item to storage:', error);
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Check if localStorage is available (web environment)
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
          return;
        }
        throw new Error('localStorage is not available');
      }
      // Use SecureStore for native platforms
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  },
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: async () => {},
  isLoading: true,
  token: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await storage.getItem('authToken');
        setToken(storedToken);
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const signIn = async (token: string) => {
    try {
      await storage.setItem('authToken', token);
      setToken(token);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      await storage.removeItem('authToken');
      setToken(null);
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, isLoading, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);