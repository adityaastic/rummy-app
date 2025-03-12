import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Link } from 'expo-router';
import { Redirect } from "expo-router";
export default function HomeScreen() {
  return <Redirect href="/login" />;

  // return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>Welcome to BGM GAME</Text>
      
    //   <Link href="/lobby" asChild>
    //     <Pressable style={styles.button}>
    //       <Text style={styles.buttonText}>Play Rummy</Text>
    //     </Pressable>
    //   </Link>

    //   <Pressable 
    //     style={[styles.button, styles.numberGameButton]} 
    //     onPress={() => Linking.openURL('https://thebgmgame.com/')}
    //   >
    //     <Text style={styles.buttonText}>Play Number Game</Text>
    //   </Pressable>
    // </View>
  // );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f4f4f5',
//   },
//   title: {
//     fontSize: 23,
//     fontWeight: 'bold',
//     marginBottom: 24,
//     color: '#18181b',
//   },
//   button: {
//     backgroundColor: '#e11d48',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     marginTop: 12,
//   },
//   numberGameButton: {
//     backgroundColor: '#2563eb', // Blue color for differentiation
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
