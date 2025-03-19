import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
 
const ChatWithUs = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://tawk.to/chat/67d93b539c068e190b664b7d/1imk8vg6s' }}
        style={{ flex: 1 }}
      />
      <View style={styles.footerview}>
        <Text style={styles.footerviewText}> The BGM Games</Text>
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footerview:{
    position:"absolute",
    bottom:55,
    width:"100%"
  },
  footerviewText:{
    backgroundColor:"green",
    color:"white",
    width:"100%",
    textAlign:"center",
    padding:12
  },
});
 
export default ChatWithUs;