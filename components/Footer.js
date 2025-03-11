import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

export default function Footer() {
  const router = useRouter();
  const segments = useSegments();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/lobby')} style={styles.button}>
        <Text style={segments.includes('lobby') ? styles.activeText : styles.text}>Lobby</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/index')} style={styles.button}>
        <Text style={segments.includes('index') ? styles.activeText : styles.text}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/settings')} style={styles.button}>
        <Text style={segments.includes('settings') ? styles.activeText : styles.text}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  button: {
    padding: 10,
  },
  text: {
    color: '#888',
  },
  activeText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
