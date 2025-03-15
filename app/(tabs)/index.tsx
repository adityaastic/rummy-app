import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'expo-router';
import { Redirect } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [userMobile, setUserMobile] = useState('');
  const [sparkles, setSparkles] = useState([]);
  
  // Animation values
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.5)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;
  const buttonGlow = useRef(new Animated.Value(0)).current;
  const dice1Rotation = useRef(new Animated.Value(0)).current;
  const dice2Rotation = useRef(new Animated.Value(0)).current;
  const chipRotation = useRef(new Animated.Value(0)).current;
  const chipScale = useRef(new Animated.Value(0.2)).current;
  
  // Card animations
  const cardPositions = Array(7).fill().map(() => useRef(new Animated.Value(-400)).current);
  const cardRotations = Array(7).fill().map(() => useRef(new Animated.Value(0)).current);
  const cardScales = Array(7).fill().map(() => useRef(new Animated.Value(0.5)).current);
  const shine = useRef(new Animated.Value(0)).current;
  
  // Background flashing lights
  const bgLight1 = useRef(new Animated.Value(0)).current;
  const bgLight2 = useRef(new Animated.Value(0)).current;

  // Generate random sparkles
  const generateSparkles = () => {
    const newSparkles = [];
    for (let i = 0; i < 15; i++) {
      newSparkles.push({
        id: i,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        size: Math.random() * 6 + 2,
        animDuration: Math.random() * 2 + 1,
        delay: Math.random() * 5,
      });
    }
    setSparkles(newSparkles);
  };
  
  useEffect(() => {
    const getMobile = async () => {
      const mobile = await AsyncStorage.getItem('mobile');
      console.log("Retrieved mobile from AsyncStorage:", mobile); // Debugging log
      if (mobile) {
        setUserMobile(mobile);
      }
    };
    getMobile();
    
    generateSparkles();
    
    // Start animations
    Animated.sequence([
      // Title fade in and scale up
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(titleScale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        })
      ]),
      
      // Card animations
      Animated.stagger(100, 
        cardPositions.map((position, index) => 
          Animated.parallel([
            Animated.spring(position, {
              toValue: 0,
              friction: 4,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.spring(cardScales[index], {
              toValue: 1,
              friction: 3,
              tension: 40,
              useNativeDriver: true,
            })
          ])
        )
      )
    ]).start();
    
    // Continuous animations
    
    // Button pulse with glow
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(buttonScale, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(buttonScale, {
            toValue: 0.98,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ]),
        Animated.sequence([
          Animated.timing(buttonGlow, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(buttonGlow, {
            toValue: 0.3,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          })
        ])
      ])
    ).start();
    
    // Dice rotation
    Animated.loop(
      Animated.sequence([
        Animated.timing(dice1Rotation, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(dice1Rotation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ])
    ).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(dice2Rotation, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(dice2Rotation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ])
    ).start();
    
    // Chip animations
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(chipRotation, {
            toValue: 1,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(chipRotation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          })
        ]),
        Animated.sequence([
          Animated.timing(chipScale, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.back),
            useNativeDriver: true,
          }),
          Animated.timing(chipScale, {
            toValue: 0.8,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ])
    ).start();
    
    // Card rotation
    cardRotations.forEach((rotation, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotation, {
            toValue: 0.1,
            duration: 1500 + index * 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: -0.1,
            duration: 1500 + index * 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ).start();
    });
    
    // Shine animation
    Animated.loop(
      Animated.timing(shine, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
    
    // Background light animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgLight1, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(bgLight1, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        })
      ])
    ).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgLight2, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(bgLight2, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        })
      ])
    ).start();
    
  }, []);

  if (!userMobile) {
    return <Redirect href="/login" />;
  }

  const shineTranslate = shine.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 250]
  });

  const dice1Spin = dice1Rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const dice2Spin = dice2Rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg']
  });

  const chipSpin = chipRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Card colors and values
  const cardInfo = [
    { color: '#d32f2f', value: 'A', suit: '♥' },
    { color: '#388e3c', value: 'K', suit: '♣' },
    { color: '#1976d2', value: 'Q', suit: '♠' },
    { color: '#f57c00', value: 'J', suit: '♦' },
    { color: '#7b1fa2', value: '10', suit: '♥' },
    { color: '#c2185b', value: '9', suit: '♠' },
    { color: '#0097a7', value: '8', suit: '♦' }
  ];

  return (
    <View style={styles.container}>
      {/* Dynamic background */}
      <Animated.View style={[
        styles.bgLight,
        { 
          backgroundColor: bgLight1.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(255, 0, 0, 0)', 'rgba(255, 0, 0, 0.15)']
          }),
          right: 0,
          top: 0
        }
      ]} />
      
      <Animated.View style={[
        styles.bgLight,
        { 
          backgroundColor: bgLight2.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0, 0, 255, 0)', 'rgba(0, 0, 255, 0.15)']
          }),
          left: 0,
          bottom: 0
        }
      ]} />
      
      {/* Animated sparkles */}
      {sparkles.map(sparkle => (
        <View
          key={sparkle.id}
          style={[
            styles.sparkle,
            {
              left: sparkle.left,
              top: sparkle.top,
              width: sparkle.size,
              height: sparkle.size,
              animationDuration: `${sparkle.animDuration}s`,
              animationDelay: `${sparkle.delay}s`
            }
          ]}
        />
      ))}
      
      {/* Casino chips */}
      <Animated.View 
        style={[
          styles.chip,
          {
            transform: [
              { rotate: chipSpin },
              { scale: chipScale }
            ],
            top: '10%',
            right: '15%'
          }
        ]}
      >
        <View style={[styles.chipInner, { backgroundColor: '#e91e63' }]} />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.chip,
          {
            transform: [
              { rotate: chipSpin },
              { scale: chipScale }
            ],
            bottom: '15%',
            left: '10%'
          }
        ]}
      >
        <View style={[styles.chipInner, { backgroundColor: '#4caf50' }]} />
      </Animated.View>
      
      {/* Dice */}
      <Animated.View 
        style={[
          styles.dice,
          {
            transform: [{ rotate: dice1Spin }],
            top: '20%',
            left: '10%'
          }
        ]}
      >
        <View style={styles.diceDot} />
        <View style={[styles.diceDot, styles.diceTopRight]} />
        <View style={[styles.diceDot, styles.diceMiddleCenter]} />
        <View style={[styles.diceDot, styles.diceBottomLeft]} />
        <View style={[styles.diceDot, styles.diceBottomRight]} />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.dice,
          {
            transform: [{ rotate: dice2Spin }],
            bottom: '20%',
            right: '10%'
          }
        ]}
      >
        <View style={[styles.diceDot, styles.diceTopLeft]} />
        <View style={[styles.diceDot, styles.diceTopRight]} />
        <View style={[styles.diceDot, styles.diceBottomLeft]} />
        <View style={[styles.diceDot, styles.diceBottomRight]} />
      </Animated.View>
      
      {/* Animated playing cards */}
      <View style={styles.cardsContainer}>
        {cardPositions.map((position, index) => (
          <Animated.View
            key={index}
            style={[
              styles.card,
              {
                transform: [
                  { translateY: position },
                  { rotateZ: cardRotations[index].interpolate({
                      inputRange: [-0.1, 0.1],
                      outputRange: ['-10deg', '10deg']
                    })
                  },
                  { scale: cardScales[index] },
                  { translateX: -150 + index * 50 }
                ],
                zIndex: index
              }
            ]}
          >
            <View style={[
              styles.cardInner, 
              { backgroundColor: '#fff', borderColor: cardInfo[index].color }
            ]}>
              <Text style={[styles.cardValue, { color: cardInfo[index].color }]}>
                {cardInfo[index].value}
              </Text>
              <Text style={[styles.cardSuit, { color: cardInfo[index].color }]}>
                {cardInfo[index].suit}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Title with animation */}
      <Animated.Text 
        style={[
          styles.title, 
          { 
            opacity: titleOpacity,
            transform: [{ scale: titleScale }],
            textShadowColor: 'rgba(255, 215, 0, 0.75)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10
          }
        ]}
      >
        Welcome to BGM GAME
      </Animated.Text>

      <View style={styles.buttonsContainer}>
        <Link href="/RummyGame" asChild>
          <Pressable>
            <Animated.View 
              style={[
                styles.button, 
                styles.rummyButton,
                { 
                  transform: [{ scale: buttonScale }],
                  shadowOpacity: buttonGlow,
                  shadowColor: '#FF0000',
                  shadowRadius: 15
                }
              ]}
            >
              <LinearGradient
                colors={['#FF416C', '#FF4B2B']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Animated.View style={[
                  styles.shine,
                  {
                    transform: [{ translateX: shineTranslate }]
                  }
                ]} />
                <Text style={styles.buttonText}>PLAY RUMMY</Text>
                <View style={styles.buttonIcon}>
                  <Text style={styles.buttonIconText}>♦</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </Link>

        <Link href="/Wallet" asChild>
          <Pressable>
            <Animated.View 
              style={[
                styles.button, 
                styles.casinoButton,
                { 
                  transform: [{ scale: buttonScale }],
                  shadowOpacity: buttonGlow,
                  shadowColor: '#00BFFF',
                  shadowRadius: 15
                }
              ]}
            >
              <LinearGradient
                colors={['#4776E6', '#8E54E9']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Animated.View style={[
                  styles.shine,
                  {
                    transform: [{ translateX: shineTranslate }]
                  }
                ]} />
                <Text style={styles.buttonText}>Instant Pay</Text>
                <View style={styles.buttonIcon}>
                  <Text style={styles.buttonIconText}>♠</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </Link>
      </View>
      
      <View style={styles.jackpotContainer}>
        <Text style={styles.jackpotLabel}>JACKPOT</Text>
        <Text style={styles.jackpotAmount}>₹100,000</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Big Wins Await! Play Now</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  bgLight: {
    position: 'absolute',
    width: '60%',
    height: '60%',
    borderRadius: 300,
    opacity: 0.8,
  },
  sparkle: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    borderRadius: 50,
    opacity: 0.8,
    animation: 'sparkle-animation 2s infinite',
  },
  cardsContainer: {
    position: 'absolute',
    top: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: '100%',
  },
  card: {
    position: 'absolute',
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  cardInner: {
    width: 56,
    height: 86,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    top: 5,
    left: 5,
  },
  cardSuit: {
    fontSize: 30,
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  dice: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  diceDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#000',
    borderRadius: 3,
    top: 8,
    left: 8,
  },
  diceTopLeft: {
    top: 8,
    left: 8,
  },
  diceTopRight: {
    top: 8,
    right: 8,
  },
  diceMiddleCenter: {
    top: 17,
    left: 17,
  },
  diceBottomLeft: {
    bottom: 8,
    left: 8,
  },
  diceBottomRight: {
    bottom: 8,
    right: 8,
  },
  chip: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  chipInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#fff',
    borderStyle: 'dashed',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#ffffff',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '80%',
    marginTop: 20,
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginVertical: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  rummyButton: {
    backgroundColor: '#e11d48',
  },
  casinoButton: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  buttonIcon: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shine: {
    position: 'absolute',
    width: 30,
    height: '200%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ skewX: '-20deg' }],
  },
  jackpotContainer: {
    marginTop: 30,
    padding: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jackpotLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  jackpotAmount: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  footerText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  }
});