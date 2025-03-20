import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.9;
const CENTER = WHEEL_SIZE / 2;
const SLICES = [
  { label: '10', color: '#FF0000' },
  { label: '20', color: '#FF8000' },
  { label: '30', color: '#FFFF00' },
  { label: '40', color: '#80FF00' },
  { label: '50', color: '#00FF00' },
  { label: '60', color: '#00FF80' },
  { label: '70', color: '#00FFFF' },
  { label: '80', color: '#0080FF' },
  { label: '90', color: '#0000FF' },
  { label: '100', color: '#8000FF' },
];
 
const angleStep = 360 / SLICES.length;
 
const createWheelPath = (index) => {
  const startAngle = (index * angleStep * Math.PI) / 180;
  const endAngle = ((index + 1) * angleStep * Math.PI) / 180;
  const x1 = CENTER + CENTER * Math.cos(startAngle);
  const y1 = CENTER + CENTER * Math.sin(startAngle);
  const x2 = CENTER + CENTER * Math.cos(endAngle);
  const y2 = CENTER + CENTER * Math.sin(endAngle);
 
  return `M${CENTER},${CENTER} L${x1},${y1} A${CENTER},${CENTER} 0 0,1 ${x2},${y2} Z`;
};
 
const Wheels = () => {
  const rotation = useSharedValue(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
 
  useEffect(() => {
    const checkIfSpun = async () => {
      const storedValue = await AsyncStorage.getItem('spin_winner');
      if (storedValue) {
        setSelectedValue(storedValue);
        setHasSpun(true); // Disable spin if already used
      }
    };
    checkIfSpun();
  }, []);
 
  const getWinner = useCallback(() => {
    const normalizedRotation = (rotation.value % 360 + 360) % 360;
    const correctedRotation = (normalizedRotation + angleStep / 2 + 90) % 360;
    const winnerIndex = Math.floor(correctedRotation / angleStep) % SLICES.length;
    const winner = SLICES[winnerIndex].label;
 
    runOnJS(setSelectedValue)(winner);
    AsyncStorage.setItem('spin_winner', winner);
    runOnJS(setHasSpun)(true);
  }, []);
 
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      if (spinning || hasSpun) return;
      ctx.startRotation = rotation.value;
    },
    onActive: (event, ctx) => {
      if (spinning || hasSpun) return;
      rotation.value = ctx.startRotation + event.translationX / 2;
    },
    onEnd: () => {
      if (spinning || hasSpun) return;
      rotation.value = withSpring(rotation.value + Math.random() * 360 + 1000, {}, () => {
        runOnJS(getWinner)();
        runOnJS(setSpinning)(false);
      });
      runOnJS(setSpinning)(true);
    },
  });
 
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient colors={['#104818', '#0A0B0A']} style={styles.container}>
        <Text style={[
          styles.bgmtext,
          {
            textShadowColor: 'rgba(0, 200, 0, 0.75)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10
          }
        ]}>BGM Game</Text>
        
        {/* Wheel */}
        <PanGestureHandler onGestureEvent={gestureHandler} enabled={!hasSpun}>
          <Animated.View style={[{ width: WHEEL_SIZE, height: WHEEL_SIZE }, animatedStyle]}>
            <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
              <G>
                {SLICES.map((slice, index) => (
                  <Path key={index} d={createWheelPath(index)} fill={slice.color} />
                ))}
                {SLICES.map((slice, index) => {
                  const textAngle = (index + 0.5) * angleStep;
                  const x = CENTER + (CENTER * 0.6) * Math.cos((textAngle * Math.PI) / 180);
                  const y = CENTER + (CENTER * 0.6) * Math.sin((textAngle * Math.PI) / 180);
                  return (
                    <SvgText
                      key={index}
                      x={x}
                      y={y}
                      fill="black"
                      fontSize="16"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {slice.label}
                    </SvgText>
                  );
                })}
              </G>
            </Svg>
          </Animated.View>
        </PanGestureHandler>
 
        {/* Spin Button */}
        <TouchableOpacity
          style={[styles.spinButton, hasSpun && styles.disabledButton]}
          onPress={() => {
            if (!spinning && !hasSpun) {
              rotation.value = withSpring(rotation.value + Math.random() * 360 + 1000, {}, () => {
                runOnJS(getWinner)();
                runOnJS(setSpinning)(false);
              });
              setSpinning(true);
            }
          }}
          disabled={spinning || hasSpun}
        >
          <Text style={styles.buttonText}>{hasSpun ? "Already Spun" : "Spin"}</Text>
        </TouchableOpacity>
 
        {/* Display Winner */}
        {selectedValue && (
          <Text style={styles.wontext}>
            🎉 You won: {selectedValue} 🎉
          </Text>
        )}
      </LinearGradient>
    </GestureHandlerRootView>
  );
};
 
export default Wheels;
 
const styles = StyleSheet.create({
  bgmtext:{
    color:"white",
    fontSize:40,
    marginBottom:20
  },
  container: {
    // flex: 1,
    width: "100%",
    height: "100%",
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  spinButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: 'gray', // Disabled button color
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  wontext: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: "white",
  },
});