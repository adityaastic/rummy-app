import { View, Text, StyleSheet, Pressable, Linking  } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { Redirect } from "expo-router";
export default function Home() {

    const [userMobile, setUserMobile] = useState<string>('');
  
    useEffect(() => {
      const mobile = localStorage.getItem('mobile');
      if (mobile) {
        setUserMobile(mobile);
      }
    }, []);

    if (!userMobile) {
      return <Redirect href="/login" />;
    }



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to BGM GAME</Text>
      
      <Link href="/RummyGame" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Play Rummy</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#e11d48',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 12,
  },
  numberGameButton: {
    backgroundColor: '#2563eb', // Blue color for differentiation
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

