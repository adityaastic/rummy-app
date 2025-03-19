// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
// import { Stack } from 'expo-router';

// type Card = {
//   suit: string;
//   value: string;
//   id: string;
// };

// type Player = {
//   id: number;
//   hand: Card[];
//   melds: Card[][];
// };

// export default function RummyGame() {
//   const [deck, setDeck] = useState<Card[]>([]);
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [discardPile, setDiscardPile] = useState<Card[]>([]);
//   const [currentPlayer, setCurrentPlayer] = useState(0);
//   const [selectedCards, setSelectedCards] = useState<Card[]>([]);
//   const [gameStarted, setGameStarted] = useState(false);
//   const [winner, setWinner] = useState<number | null>(null);
//   const [hasDrawnCard, setHasDrawnCard] = useState(false);

//   const suits = ['♥', '♦', '♣', '♠'];
//   const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

//   const initializeDeck = () => {
//     const newDeck: Card[] = [];
//     suits.forEach(suit => {
//       values.forEach(value => {
//         newDeck.push({
//           suit,
//           value,
//           id: `${suit}-${value}`
//         });
//       });
//     });
//     return shuffleDeck(newDeck);
//   };

//   const shuffleDeck = (cards: Card[]) => {
//     const shuffled = [...cards];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   };

//   const dealCards = () => {
//     const newDeck = initializeDeck();
//     const newPlayers: Player[] = [
//       { id: 0, hand: [], melds: [] },
//       { id: 1, hand: [], melds: [] }
//     ];

//     // Deal 10 cards to each player
//     for (let i = 0; i < 10; i++) {
//       newPlayers[0].hand.push(newDeck.pop()!);
//       newPlayers[1].hand.push(newDeck.pop()!);
//     }

//     setDiscardPile([newDeck.pop()!]);
//     setDeck(newDeck);
//     setPlayers(newPlayers);
//     setGameStarted(true);
//     setCurrentPlayer(0);
//     setHasDrawnCard(false);
//     setWinner(null);
//     setSelectedCards([]);
//   };

//   const drawCard = (fromDiscard: boolean = false) => {
//     if (hasDrawnCard) {
//       Alert.alert("You've already drawn a card this turn");
//       return;
//     }

//     let drawnCard: Card;

//     if (fromDiscard) {
//       if (discardPile.length <= 1) {
//         Alert.alert("Cannot draw from an empty discard pile");
//         return;
//       }
//       drawnCard = discardPile.pop()!;
//       setDiscardPile([...discardPile]);
//     } else {
//       if (deck.length === 0) {
//         if (discardPile.length <= 1) {
//           Alert.alert("No cards left to draw");
//           return;
//         }
//         const newDeck = shuffleDeck(discardPile.slice(0, -1));
//         const lastDiscardCard = discardPile[discardPile.length - 1];
//         setDeck(newDeck);
//         setDiscardPile([lastDiscardCard]);
//         drawnCard = newDeck.pop()!;
//       } else {
//         drawnCard = deck.pop()!;
//         setDeck([...deck]);
//       }
//     }

//     const updatedPlayers = [...players];
//     updatedPlayers[currentPlayer].hand.push(drawnCard);
//     setPlayers(updatedPlayers);
//     setHasDrawnCard(true);
//   };

//   const discardCard = (card: Card) => {
//     if (!hasDrawnCard) {
//       Alert.alert("You must draw a card before discarding");
//       return;
//     }

//     const playerHand = players[currentPlayer].hand;
//     const cardIndex = playerHand.findIndex(c => c.id === card.id);
   
//     if (cardIndex !== -1) {
//       const updatedPlayers = [...players];
//       const removedCard = updatedPlayers[currentPlayer].hand.splice(cardIndex, 1)[0];
//       setPlayers(updatedPlayers);
//       setDiscardPile([...discardPile, removedCard]);
//       setCurrentPlayer((currentPlayer + 1) % 2);
//       setSelectedCards([]);
//       setHasDrawnCard(false);

//       // Check for winner
//       if (updatedPlayers[currentPlayer].hand.length === 0) {
//         setWinner(currentPlayer);
//       }
//     }
//   };

//   const getCardValue = (value: string): number => {
//     if (value === 'A') return 1;
//     if (value === 'J') return 11;
//     if (value === 'Q') return 12;
//     if (value === 'K') return 13;
//     return parseInt(value);
//   };

//   const isValidMeld = (cards: Card[]): boolean => {
//     if (cards.length < 3) return false;

//     // Sort cards by value
//     const sortedCards = [...cards].sort((a, b) =>
//       getCardValue(a.value) - getCardValue(b.value)
//     );

//     // Check for same value (set)
//     const allSameValue = sortedCards.every(card => card.value === sortedCards[0].value);
//     if (allSameValue && new Set(sortedCards.map(card => card.suit)).size === sortedCards.length) {
//       return true;
//     }

//     // Check for sequence (run)
//     const sameSuit = sortedCards.every(card => card.suit === sortedCards[0].suit);
//     if (sameSuit) {
//       for (let i = 1; i < sortedCards.length; i++) {
//         const prevValue = getCardValue(sortedCards[i - 1].value);
//         const currValue = getCardValue(sortedCards[i].value);
//         if (currValue !== prevValue + 1) return false;
//       }
//       return true;
//     }

//     return false;
//   };

//   const createMeld = () => {
//     if (!hasDrawnCard) {
//       Alert.alert("You must draw a card before creating a meld");
//       return;
//     }

//     if (isValidMeld(selectedCards)) {
//       const updatedPlayers = [...players];
//       const newMeld = [...selectedCards];
//       updatedPlayers[currentPlayer].melds.push(newMeld);

//       // Remove melded cards from hand
//       selectedCards.forEach(card => {
//         const index = updatedPlayers[currentPlayer].hand.findIndex(c => c.id === card.id);
//         if (index !== -1) {
//           updatedPlayers[currentPlayer].hand.splice(index, 1);
//         }
//       });

//       setPlayers(updatedPlayers);
//       setSelectedCards([]);

//       // Check for winner
//       if (updatedPlayers[currentPlayer].hand.length === 0) {
//         setWinner(currentPlayer);
//       }
//     } else {
//       Alert.alert("Invalid meld. Check the rules and try again.");
//     }
//   };

//   const toggleCardSelection = (card: Card) => {
//     const index = selectedCards.findIndex(c => c.id === card.id);
//     if (index === -1) {
//       setSelectedCards([...selectedCards, card]);
//     } else {
//       setSelectedCards(selectedCards.filter(c => c.id !== card.id));
//     }
//   };

//   const isCardSelected = (card: Card) => {
//     return selectedCards.some(c => c.id === card.id);
//   };

//   const renderCard = (card: Card, selectable: boolean = true) => {
//     const isSelected = isCardSelected(card);
//     const isRed = card.suit === '♥' || card.suit === '♦';

//     return (
//       <TouchableOpacity
//         key={card.id}
//         onPress={() => selectable ? toggleCardSelection(card) : null}
//         style={[
//           styles.card,
//           isSelected && styles.selectedCard,
//           { backgroundColor: isSelected ? '#e0e0e0' : 'white' }
//         ]}
//       >
//         <Text style={[
//           styles.cardText,
//           { color: isRed ? 'red' : 'black' }
//         ]}>
//           {card.value}{card.suit}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <>
//       <Stack.Screen options={{ title: 'Rummy Games' }}  />
//       <View style={styles.container}>
//         {!gameStarted ? (
//           <View style={styles.startContainer}>
//             {/* <Text style={styles.gameTitle}>Rummy</Text> */}
//             <TouchableOpacity style={styles.startButton} onPress={dealCards}>
//               <Text style={styles.startButtonText}>Start Game</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <>
//             {winner !== null ? (
//               <View style={styles.winnerContainer}>
//                 <Text style={styles.winnerText}>Player {winner + 1} wins!</Text>
//                 <TouchableOpacity style={styles.startButton} onPress={dealCards}>
//                   <Text style={styles.startButtonText}>Play Again</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <>
//                 <Text style={styles.playerTurn}>Player {currentPlayer + 1}'s Turn</Text>
//                 <Text style={styles.turnStatus}>
//                   {hasDrawnCard ? "Choose your move" : "Draw a card to start your turn"}
//                 </Text>
               
//                 {/* Opponent's hand (face down) */}
//                 <View style={styles.opponentContainer}>
//                   <Text style={styles.sectionTitle}>Player 2's Hand:</Text>
//                   <ScrollView horizontal style={styles.handContainer}>
//                     {players[1]?.hand.map((_, index) => (
//                       <View key={index} style={[styles.card, styles.cardBack]}>
//                         <Text style={styles.cardBackText}>🂠</Text>
//                       </View>
//                     ))}
//                   </ScrollView>
//                 </View>

//                 {/* Game Area */}
//                 <View style={styles.gameArea}>
//                   <View style={styles.deckArea}>
//                     <TouchableOpacity
//                       style={[styles.card, styles.deck]}
//                       onPress={() => drawCard(false)}
//                     >
//                       <Text style={styles.cardBackText}>🂠</Text>
//                       <Text style={styles.remainingCards}>
//                         {deck.length}
//                       </Text>
//                     </TouchableOpacity>

//                     {discardPile.length > 0 && (
//                       <TouchableOpacity
//                         style={[styles.card, styles.discardPile]}
//                         onPress={() => drawCard(true)}
//                       >
//                         {renderCard(discardPile[discardPile.length - 1], false)}
//                       </TouchableOpacity>
//                     )}
//                   </View>
//                 </View>

//                 {/* Player's Melds */}
//                 <View style={styles.meldsContainer}>
//                   <Text style={styles.sectionTitle}>Your Melds:</Text>
//                   <ScrollView horizontal>
//                     {players[currentPlayer]?.melds.map((meld, index) => (
//                       <View key={index} style={styles.meld}>
//                         {meld.map(card => renderCard(card, false))}
//                       </View>
//                     ))}
//                   </ScrollView>
//                 </View>

//                 {/* Player's Hand */}
//                 <View style={styles.playerContainer}>
//                   <Text style={styles.sectionTitle}>Your Hand:</Text>
//                   <ScrollView horizontal style={styles.handContainer}>
//                     {players[currentPlayer]?.hand.map(card => renderCard(card))}
//                   </ScrollView>

//                   <View style={styles.actionButtons}>
//                     {selectedCards.length >= 3 && (
//                       <TouchableOpacity
//                         style={styles.actionButton}
//                         onPress={createMeld}
//                       >
//                         <Text style={styles.actionButtonText}>Create Meld</Text>
//                       </TouchableOpacity>
//                     )}
//                     {selectedCards.length === 1 && (
//                       <TouchableOpacity
//                         style={styles.actionButton}
//                         onPress={() => discardCard(selectedCards[0])}
//                       >
//                         <Text style={styles.actionButtonText}>Discard</Text>
//                       </TouchableOpacity>
//                     )}
//                   </View>
//                 </View>
//               </>
//             )}
//           </>
//         )}
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0f172a',
//     padding: 10,
//   },
//   startContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   gameTitle: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 30,
//   },
//   startButton: {
//     backgroundColor: '#1e88e5',
//     padding: 15,
//     borderRadius: 8,
//     alignSelf: 'center',
//     marginTop: 20,
//     minWidth: 200,
//   },
//   startButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   playerTurn: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     marginVertical: 5,
//   },
//   turnStatus: {
//     fontSize: 16,
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: 10,
//     opacity: 0.8,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 5,
//   },
//   opponentContainer: {
//     marginBottom: 20,
//   },
//   gameArea: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   deckArea: {
//     flexDirection: 'row',
//     gap: 20,
//   },
//   playerContainer: {
//     marginTop: 'auto',
//   },
//   handContainer: {
//     flexGrow: 0,
//     marginBottom: 10,
//   },
//   meldsContainer: {
//     marginVertical: 10,
//   },
//   meld: {
//     flexDirection: 'row',
//     marginRight: 15,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: 8,
//     padding: 5,
//   },
//   card: {
//     width: 60,
//     height: 90,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 2,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     elevation: 2,
//   },
//   selectedCard: {
//     borderColor: '#ffd700',
//     borderWidth: 2,
//     elevation: 5,
//   },
//   cardBack: {
//     backgroundColor: '#1e88e5',
//   },
//   cardBackText: {
//     fontSize: 40,
//     color: 'white',
//   },
//   cardText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   deck: {
//     backgroundColor: '#1e88e5',
//   },
//   discardPile: {
//     borderWidth: 2,
//     borderColor: '#ffd700',
//   },
//   remainingCards: {
//     position: 'absolute',
//     bottom: 5,
//     right: 5,
//     fontSize: 12,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 10,
//     marginTop: 10,
//   },
//   actionButton: {
//     backgroundColor: '#1e88e5',
//     padding: 10,
//     borderRadius: 8,
//     minWidth: 100,
//     alignItems: 'center',
//   },
//   actionButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   winnerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   winnerText: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 20,
//   },
// });


import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  ImageBackground, 
  Dimensions,
  Modal,
  Animated,
  Vibration
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type Card = {
  suit: string;
  value: string;
  id: string;
};

type Player = {
  id: number;
  hand: Card[];
  melds: Card[][];
};

export default function RummyGame() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [hasDrawnCard, setHasDrawnCard] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [turnCount, setTurnCount] = useState(0);
  
  // Animation values
  const discardAnimation = useRef(new Animated.Value(0)).current;
  const meldAnimation = useRef(new Animated.Value(0)).current;
  const hintOpacity = useRef(new Animated.Value(0)).current;
  
  const suits = ['♥', '♦', '♣', '♠'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  useEffect(() => {
    // Show hint at the beginning of the game
    if (gameStarted && turnCount === 0) {
      showHintMessage("Draw a card from the deck or discard pile to start your turn");
    }
  }, [gameStarted, turnCount]);

  useEffect(() => {
    if (selectedCards.length >= 3) {
      const valid = isValidMeld(selectedCards);
      if (valid) {
        showHintMessage("You can create a valid meld with selected cards!");
      }
    }
  }, [selectedCards]);

  const showHintMessage = (message: string) => {
    setShowHint(true);
    setLastAction(message);
    
    // Fade in the hint
    Animated.sequence([
      Animated.timing(hintOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.delay(3000),
      Animated.timing(hintOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      setShowHint(false);
    });
  };

  const initializeDeck = () => {
    const newDeck: Card[] = [];
    suits.forEach(suit => {
      values.forEach(value => {
        newDeck.push({
          suit,
          value,
          id: `${suit}-${value}`
        });
      });
    });
    return shuffleDeck(newDeck);
  };

  const shuffleDeck = (cards: Card[]) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const dealCards = () => {
    const newDeck = initializeDeck();
    const newPlayers: Player[] = [
      { id: 0, hand: [], melds: [] },
      { id: 1, hand: [], melds: [] }
    ];

    // Deal 10 cards to each player
    for (let i = 0; i < 10; i++) {
      newPlayers[0].hand.push(newDeck.pop()!);
      newPlayers[1].hand.push(newDeck.pop()!);
    }

    setDiscardPile([newDeck.pop()!]);
    setDeck(newDeck);
    setPlayers(newPlayers);
    setGameStarted(true);
    setCurrentPlayer(0);
    setHasDrawnCard(false);
    setWinner(null);
    setSelectedCards([]);
    setTurnCount(0);
  };

  const drawCard = (fromDiscard: boolean = false) => {
    if (hasDrawnCard) {
      showHintMessage("You've already drawn a card this turn");
      Vibration.vibrate(100);
      return;
    }

    let drawnCard: Card;

    if (fromDiscard) {
      if (discardPile.length <= 1) {
        showHintMessage("Cannot draw from an empty discard pile");
        Vibration.vibrate(100);
        return;
      }
      drawnCard = discardPile.pop()!;
      setDiscardPile([...discardPile]);
      showHintMessage("Card drawn from discard pile");
    } else {
      if (deck.length === 0) {
        if (discardPile.length <= 1) {
          showHintMessage("No cards left to draw");
          Vibration.vibrate(100);
          return;
        }
        const newDeck = shuffleDeck(discardPile.slice(0, -1));
        const lastDiscardCard = discardPile[discardPile.length - 1];
        setDeck(newDeck);
        setDiscardPile([lastDiscardCard]);
        drawnCard = newDeck.pop()!;
        showHintMessage("Reshuffled discard pile into deck");
      } else {
        drawnCard = deck.pop()!;
        setDeck([...deck]);
        showHintMessage("Card drawn from deck");
      }
    }

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayer].hand.push(drawnCard);
    setPlayers(updatedPlayers);
    setHasDrawnCard(true);
    
    // Highlight possible melds
    highlightPossibleMelds(updatedPlayers[currentPlayer].hand);
  };

  const highlightPossibleMelds = (hand: Card[]) => {

    if (hand.length >= 3) {
      const potentialMelds = findPotentialMelds(hand);
      if (potentialMelds.length > 0) {
        showHintMessage("You may have a valid meld! Select cards to check");
      }
    }
  };

  const findPotentialMelds = (hand: Card[]): Card[][] => {
    // This is a placeholder - in a real app, you'd implement smart meld detection
    // For now, we'll just return an empty array
    return [];
  };

  const discardCard = (card: Card) => {
    if (!hasDrawnCard) {
      showHintMessage("You must draw a card before discarding");
      Vibration.vibrate(100);
      return;
    }

    const playerHand = players[currentPlayer].hand;
    const cardIndex = playerHand.findIndex(c => c.id === card.id);
   
    if (cardIndex !== -1) {
      const updatedPlayers = [...players];
      const removedCard = updatedPlayers[currentPlayer].hand.splice(cardIndex, 1)[0];
      setPlayers(updatedPlayers);
      setDiscardPile([...discardPile, removedCard]);
      
      // Animate the discard pile
      Animated.sequence([
        Animated.timing(discardAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(discardAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
      
      // End turn
      setCurrentPlayer((currentPlayer + 1) % 2);
      setSelectedCards([]);
      setHasDrawnCard(false);
      setTurnCount(turnCount + 1);
      
      showHintMessage(`Card discarded. Player ${(currentPlayer + 1) % 2 + 1}'s turn`);

      // Check for winner
      if (updatedPlayers[currentPlayer].hand.length === 0) {
        setWinner(currentPlayer);
      }
    }
  };

  const getCardValue = (value: string): number => {
    if (value === 'A') return 1;
    if (value === 'J') return 11;
    if (value === 'Q') return 12;
    if (value === 'K') return 13;
    return parseInt(value);
  };

  const isValidMeld = (cards: Card[]): boolean => {
    if (cards.length < 3) return false;

    // Sort cards by value
    const sortedCards = [...cards].sort((a, b) =>
      getCardValue(a.value) - getCardValue(b.value)
    );

    // Check for same value (set)
    const allSameValue = sortedCards.every(card => card.value === sortedCards[0].value);
    if (allSameValue && new Set(sortedCards.map(card => card.suit)).size === sortedCards.length) {
      return true;
    }

    // Check for sequence (run)
    const sameSuit = sortedCards.every(card => card.suit === sortedCards[0].suit);
    if (sameSuit) {
      for (let i = 1; i < sortedCards.length; i++) {
        const prevValue = getCardValue(sortedCards[i - 1].value);
        const currValue = getCardValue(sortedCards[i].value);
        if (currValue !== prevValue + 1) return false;
      }
      return true;
    }

    return false;
  };

  const createMeld = () => {
    if (!hasDrawnCard) {
      showHintMessage("You must draw a card before creating a meld");
      Vibration.vibrate(100);
      return;
    }

    if (isValidMeld(selectedCards)) {
      const updatedPlayers = [...players];
      const newMeld = [...selectedCards];
      updatedPlayers[currentPlayer].melds.push(newMeld);

      // Remove melded cards from hand
      selectedCards.forEach(card => {
        const index = updatedPlayers[currentPlayer].hand.findIndex(c => c.id === card.id);
        if (index !== -1) {
          updatedPlayers[currentPlayer].hand.splice(index, 1);
        }
      });

      setPlayers(updatedPlayers);
      setSelectedCards([]);
      
      // Animate the meld creation
      Animated.sequence([
        Animated.timing(meldAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(meldAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
      
      showHintMessage("Meld created successfully!");

      // Check for winner
      if (updatedPlayers[currentPlayer].hand.length === 0) {
        setWinner(currentPlayer);
      }
    } else {
      showHintMessage("Invalid meld. Cards must form a sequence of same suit or same value with different suits.");
      Vibration.vibrate([0, 100, 50, 100]);
    }
  };

  const toggleCardSelection = (card: Card) => {
    const index = selectedCards.findIndex(c => c.id === card.id);
    if (index === -1) {
      setSelectedCards([...selectedCards, card]);
    } else {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    }
  };

  const isCardSelected = (card: Card) => {
    return selectedCards.some(c => c.id === card.id);
  };

  const renderCard = (card: Card, selectable: boolean = true) => {
    const isSelected = isCardSelected(card);
    const isRed = card.suit === '♥' || card.suit === '♦';
    
    // Determine if card could be part of a valid meld
    const couldBeMeld = selectable && hasDrawnCard && selectedCards.length > 0 && 
      selectedCards.length < 3 && !isSelected && 
      isValidMeld([...selectedCards, card]);

    return (
      <TouchableOpacity
        key={card.id}
        onPress={() => selectable ? toggleCardSelection(card) : null}
        style={[
          styles.card,
          isSelected && styles.selectedCard,
          couldBeMeld && styles.potentialMeldCard,
        ]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isSelected ? ['#4cff96', '#134024'] : ['#f8f8f8', '#e8e8e8']}
          style={styles.cardGradient}
        >
          <Text style={[
            styles.cardCorner,
            { color: isRed ? '#e32636' : '#1e3a8a' }
          ]}>
            {card.value}
          </Text>
          <Text style={[
            styles.cardSuit,
            { color: isRed ? '#e32636' : '#1e3a8a' }
          ]}>
            {card.suit}
          </Text>
          <Text style={[
            styles.cardCornerBottom,
            { color: isRed ? '#e32636' : '#1e3a8a' }
          ]}>
            {card.value}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  const TutorialModal = () => (
    <Modal
      visible={showTutorial}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowTutorial(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#064e3b', '#022c22']}
            style={styles.modalGradient}
          >
            <Text style={styles.modalTitle}>How to Play Royal Rummy</Text>
            
            <ScrollView style={styles.tutorialScroll}>
              <Text style={styles.tutorialSection}>Game Objective:</Text>
              <Text style={styles.tutorialText}>
                Create melds and get rid of all cards in your hand before your opponent does.
              </Text>
              
              <Text style={styles.tutorialSection}>On Your Turn:</Text>
              <Text style={styles.tutorialText}>
                1. Draw a card from the deck or the top of the discard pile.{'\n'}
                2. Create melds if possible (select 3+ cards and tap "Create Meld").{'\n'}
                3. Discard one card to end your turn.
              </Text>
              
              <Text style={styles.tutorialSection}>Valid Melds:</Text>
              <Text style={styles.tutorialText}>
                • A set of 3 or more cards of the same value, but different suits.{'\n'}
                • A run of 3 or more consecutive cards of the same suit.
              </Text>
              
              <Text style={styles.tutorialSection}>Card Values:</Text>
              <Text style={styles.tutorialText}>
                • Ace (A) = 1{'\n'}
                • Number cards = face value{'\n'}
                • Jack (J) = 11{'\n'}
                • Queen (Q) = 12{'\n'}
                • King (K) = 13
              </Text>
              
              <Text style={styles.tutorialSection}>How to Win:</Text>
              <Text style={styles.tutorialText}>
                The first player to get rid of all their cards wins the game!
              </Text>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowTutorial(false)}
            >
              <Text style={styles.closeButtonText}>Got It!</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Royal Rummy', 
        headerStyle: { backgroundColor: '#064e3b' },
        headerTitleStyle: { color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white'
      }} />
      
      <TutorialModal />
      
      {!gameStarted ? (
        <ImageBackground
          source={{ uri: 'https://i.ibb.co/Y8SQZ3T/poker-table-background.jpg' }}
          style={styles.backgroundImage}
        >
          <LinearGradient
            colors={['#104818', 'rgb(10, 11, 10)']}
            style={styles.gradientOverlay}
          >
            <View style={styles.startContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.gameTitle}>ROYAL</Text>
                <Text style={styles.gameTitleSecondary}>RUMMY</Text>
                <Text style={styles.gameTagline}>The Classic Card Game</Text>
              </View>
              
              <View style={styles.cardFan}>
                {suits.map((suit, index) => (
                  <View 
                    key={suit} 
                    style={[
                      styles.fanCard, 
                      {transform: [{rotate: `${(index - 1.5) * 15}deg`}]}
                    ]}
                  >
                    <Text style={[
                      styles.fanCardText, 
                      {color: (suit === '♥' || suit === '♦') ? '#e32636' : '#064e3b'}
                    ]}>
                      {suit}
                    </Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.startButtonContainer}>
                <TouchableOpacity 
                  style={styles.startButton} 
                  onPress={dealCards}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#7aba92', '#0c2209d4']}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.startButtonText}>START GAME</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.rulesButton} 
                  onPress={() => setShowTutorial(true)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#60a5fa', '#2563eb']}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.startButtonText}>HOW TO PLAY</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={['#0f2a14', '#071611']}  
          style={styles.container}
        >
          {/* Animated hint panel */}
          {showHint && (
            <Animated.View 
              style={[
                styles.hintContainer,
                { opacity: hintOpacity }
              ]}
            >
              <Text style={styles.hintText}>{lastAction}</Text>
            </Animated.View>
          )}
          
          {winner !== null ? (
            <View style={styles.winnerContainer}>
              <LinearGradient
                colors={['#f59e0b', '#d97706']}
                style={styles.winnerBadge}
              >
                <Text style={styles.winnerText}>Player {winner + 1} wins!</Text>
              </LinearGradient>
              
              <TouchableOpacity 
                style={styles.playAgainButton} 
                onPress={dealCards}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#3b82f6', '#1d4ed8']}
                  style={styles.gradientButton}
                >
                  <Text style={styles.startButtonText}>PLAY AGAIN</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.gameHeader}>
                <LinearGradient
                  colors={['#16a34a', '#15803d']}
                  style={styles.playerTurnBadge}
                >
                  <Text style={styles.playerTurn}>Player {currentPlayer + 1}'s Turn</Text>
                </LinearGradient>
                
                <View style={styles.gameStats}>
                  <Text style={styles.statsText}>Cards in Deck: {deck.length}</Text>
                  <Text style={styles.statsText}>Turn: {turnCount + 1}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.helpButton}
                  onPress={() => setShowTutorial(true)}
                >
                  <Text style={styles.helpButtonText}>?</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.turnStatus}>
                <Text style={styles.turnStatusText}>
                  {hasDrawnCard ? "Create a meld or discard a card" : "Draw a card to start your turn"}
                </Text>
              </View>
              
              {/* Opponent's hand (face down) */}
              <View style={styles.opponentContainer}>
                <Text style={styles.sectionTitle}>Player 2's Hand: {players[1]?.hand.length} cards</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.handContainer}>
                  {players[1]?.hand.map((_, index) => (
                    <View key={index} style={[styles.card, styles.cardBack]}>
                      <LinearGradient
                        colors={['#064e3b', '#065f46']}
                        style={styles.cardGradient}
                      >
                        <Text style={styles.cardBackText}>🂠</Text>
                      </LinearGradient>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* Game Area */}
              <View style={styles.gameArea}>
                <View style={styles.deckArea}>
                  <TouchableOpacity
                    style={[styles.card, styles.deck]}
                    onPress={() => drawCard(false)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#064e3b', '#065f46']}
                      style={styles.cardGradient}
                    >
                      <Text style={styles.cardBackText}>🂠</Text>
                      <View style={styles.deckCountBadge}>
                        <Text style={styles.remainingCards}>
                          {deck.length}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  <Animated.View
                    style={[
                      styles.discardPileContainer,
                      { transform: [{ scale: discardAnimation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 1.1, 1]
                      }) }] }
                    ]}
                  >
                    {discardPile.length > 0 && (
                      <TouchableOpacity
                        style={[styles.card, styles.discardPile]}
                        onPress={() => drawCard(true)}
                        activeOpacity={0.8}
                      >
                        {renderCard(discardPile[discardPile.length - 1], false)}
                      </TouchableOpacity>
                    )}
                    <Text style={styles.discardLabel}>Discard Pile</Text>
                  </Animated.View>
                </View>
              </View>

              {/* Player's Melds */}
              <Animated.View 
                style={[
                  styles.meldsContainer,
                  { transform: [{ scale: meldAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.1, 1]
                  }) }] }
                ]}
              >
                <Text style={styles.sectionTitle}>Your Melds:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {players[currentPlayer]?.melds.map((meld, index) => (
                    <View key={index} style={styles.meld}>
                      {meld.map(card => renderCard(card, false))}
                    </View>
                  ))}
                  {players[currentPlayer]?.melds.length === 0 && (
                    <View style={styles.emptyMeldsContainer}>
                      <Text style={styles.emptyMeldsText}>
                        No melds yet - select 3 or more cards to create a meld
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </Animated.View>

              {/* Player's Hand */}
              <View style={styles.playerContainer}>
                <Text style={styles.sectionTitle}>Your Hand: {players[currentPlayer]?.hand.length} cards</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.handContainer}>
                  {players[currentPlayer]?.hand.map(card => renderCard(card))}
                </ScrollView>

                <View style={styles.actionButtons}>
                  {selectedCards.length >= 3 && (
                    <TouchableOpacity
                      style={[styles.actionButton, isValidMeld(selectedCards) ? styles.validActionButton : styles.invalidActionButton]}
                      onPress={createMeld}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={isValidMeld(selectedCards) ? ['#10b981', '#0a2318'] : ['#ef4444', '#7f1d1d']}
                        style={styles.actionButtonGradient}
                      >
                        <Text style={styles.actionButtonText}>Create Meld</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                  {selectedCards.length === 1 && (
                    <TouchableOpacity
                      style={[styles.actionButton, hasDrawnCard ? styles.validActionButton : styles.invalidActionButton]}
                      onPress={() => discardCard(selectedCards[0])}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={hasDrawnCard ? ['#10b981', '#059669'] : ['#9ca3af', '#4b5563']}
                        style={styles.actionButtonGradient}
                      >
                        <Text style={styles.actionButtonText}>Discard</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </>
          )}
        </LinearGradient>
      )}
    </>
  );
}

const { width, height } = Dimensions.get('window');

// Card animation values
const cardScale = new Animated.Value(1);
const cardRotate = new Animated.Value(0);

// Function to animate cards when selected
const animateCardSelection = (selected) => {
  Animated.parallel([
    Animated.timing(cardScale, {
      toValue: selected ? 1.1 : 1,
      duration: 200,
      useNativeDriver: true
    }),
    Animated.timing(cardRotate, {
      toValue: selected ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    })
  ]).start();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startContainer: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  gameTitle: {
    fontSize: 60,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  gameTitleSecondary: {
    fontSize: 72,
    fontWeight: '900',
    color: '#f59e0b',
    letterSpacing: 4,
    marginTop: -15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  gameTagline: {
    fontSize: 18,
    color: 'white',
    opacity: 0.8,
    marginTop: 10,
    fontStyle: 'italic',
  },
  cardFan: {
    height: 150,
    position: 'relative',
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  fanCard: {
    width: 70,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 8,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  fanCardText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  startButtonContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
  },
  startButton: {
    width: '80%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  rulesButton: {
    width: '80%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  playerTurnBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  playerTurn: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gameStats: {
    alignItems: 'flex-end',
  },
  statsText: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 2,
  },
  helpButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  helpButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  turnStatus: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  turnStatusText: {
    color: 'white',
    fontSize: 16,
  },
  opponentContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    color: '#d1d5db',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  handContainer: {
    flexDirection: 'row',
    height: 110,
    marginBottom: 5,
  },
  cardBack: {
    backgroundColor: '#064e3b',
    marginRight: 5,
    borderColor: '#022c22',
    borderWidth: 1,
  },
  cardBackText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 24,
  },
  gameArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    height: 130,
  },
  deckArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginHorizontal: 5,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  cardGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  cardCorner: {
    position: 'absolute',
    top: 5,
    left: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardCornerBottom: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    fontSize: 16,
    fontWeight: 'bold',
    transform: [{ rotate: '180deg' }],
  },
  cardSuit: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4cff96',
    transform: [
      { scale: 1.05 },
      { translateY: -5 }
    ],
  },
  potentialMeldCard: {
    borderWidth: 2,
    borderColor: '#60a5fa',
    transform: [
      { scale: 1.03 },
      { translateY: -3 }
    ],
  },
  deck: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  discardPileContainer: {
    alignItems: 'center',
  },
  discardPile: {
    borderWidth: 1,
    borderColor: '#2c5282',
  },
  discardLabel: {
    color: '#d1d5db',
    fontSize: 12,
    marginTop: 5,
  },
  deckCountBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  remainingCards: {
    color: '#064e3b',
    fontWeight: 'bold',
    fontSize: 12,
  },
  meldsContainer: {
    marginVertical: 10,
  },
  meld: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 5,
    marginRight: 10,
  },
  emptyMeldsContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: width * 0.8,
  },
  emptyMeldsText: {
    color: '#d1d5db',
    fontSize: 14,
    textAlign: 'center',
  },
  playerContainer: {
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  actionButton: {
    width: 120,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  actionButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  validActionButton: {
    transform: [{ scale: 1 }],
  },
  invalidActionButton: {
    opacity: 0.6,
  },
  hintContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '80%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '80%',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  modalGradient: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  tutorialScroll: {
    maxHeight: 400,
  },
  tutorialSection: {
    color: '#f59e0b',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  tutorialText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 22,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  winnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerBadge: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  winnerText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  playAgainButton: {
    width: 200,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  // New animation styles
  cardAnimated: {
    transform: [
      { scale: cardScale },
      { rotate: cardRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '5deg']
      })}
    ]
  },
  pulseAnimation: {
    opacity: new Animated.Value(1),
    transform: [
      { scale: new Animated.Value(1) }
    ]
  },
  cardFanAnimated: {
    transform: [
      { translateY: new Animated.Value(0) },
      { rotate: new Animated.Value(0).interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
      })}
    ]
  },
  dealAnimation: {
    position: 'absolute',
    opacity: new Animated.Value(0),
    transform: [
      { translateX: new Animated.Value(0) },
      { translateY: new Animated.Value(0) },
      { rotate: new Animated.Value(0).interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '720deg']
      })}
    ]
  },
  titlePulse: {
    transform: [
      { scale: new Animated.Value(1).interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.05, 1]
      })}
    ]
  },
  buttonPulse: {
    transform: [
      { scale: new Animated.Value(1).interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.1, 1]
      })}
    ]
  },
  gameAreaGlow: {
    shadowColor: '#4cff96',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  shimmerEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [
      { translateX: new Animated.Value(-width).interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width]
      })}
    ]
  },
  confirmButtonHighlight: {
    borderWidth: 2,
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.8,
  },
  floatingCard: {
    position: 'absolute',
    transform: [
      { translateX: new Animated.Value(0) },
      { translateY: new Animated.Value(0) },
      { rotate: new Animated.Value(0).interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
      })}
    ]
  },
  createMeldFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 255, 150, 0.3)',
    opacity: 0,
    zIndex: 5,
  },
  drawCardEffect: {
    position: 'absolute',
    width: 70,
    height: 100,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4cff96',
    borderRadius: 8,
    opacity: 0,
  },
  playerTurnIndicator: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#16a34a',
    borderRadius: 5,
    left: -15,
    top: '50%',
    transform: [{ translateY: -5 }],
  },
  // Responsive design adjustments
  landscapeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  landscapeLeftPanel: {
    width: '30%',
  },
  landscapeRightPanel: {
    width: '70%',
  },
  // Dark mode styles
  darkModeText: {
    color: '#f3f4f6',
  },
  darkModeBackground: {
    backgroundColor: '#1f2937',
  },
  darkModeCard: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  // Accessibility styles
  largeText: {
    fontSize: 18,
  },
  highContrastText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Card hover effect
  cardHoverEffect: {
    transform: [
      { scale: 1.1 },
      { translateY: -10 }
    ],
    shadowColor: '#4cff96',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  }
});

// Additional animation functions
const animateCardDeal = (cardElements, delay = 0) => {
  const animations = cardElements.map((_, index) => {
    const cardAnim = new Animated.Value(0);
    return Animated.timing(cardAnim, {
      toValue: 1,
      duration: 300,
      delay: delay + index * 100,
      useNativeDriver: true
    });
  });
  
  return Animated.stagger(100, animations);
};

const animateWinnerConfetti = () => {
  const confetti = Array(20).fill(0).map(() => ({
    x: new Animated.Value(width / 2),
    y: new Animated.Value(height / 2),
    rotate: new Animated.Value(0),
    color: ['#f59e0b', '#16a34a', '#3b82f6', '#ec4899'][Math.floor(Math.random() * 4)]
  }));
  
  const animations = confetti.map(particle => {
    const xTarget = Math.random() * width;
    const yTarget = Math.random() * height * 0.6;
    
    return Animated.parallel([
      Animated.timing(particle.x, {
        toValue: xTarget,
        duration: 1000 + Math.random() * 1000,
        useNativeDriver: true
      }),
      Animated.timing(particle.y, {
        toValue: yTarget,
        duration: 1000 + Math.random() * 1000,
        useNativeDriver: true
      }),
      Animated.timing(particle.rotate, {
        toValue: 10 + Math.random() * 10,
        duration: 1000 + Math.random() * 1000,
        useNativeDriver: true
      })
    ]);
  });
  
  return Animated.parallel(animations);
};

const animateCardFlip = (frontOpacity, backOpacity, flipRotation) => {
  return Animated.sequence([
    Animated.timing(flipRotation, {
      toValue: 90,
      duration: 300,
      useNativeDriver: true
    }),
    Animated.parallel([
      Animated.timing(frontOpacity, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true
      }),
      Animated.timing(backOpacity, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true
      })
    ]),
    Animated.timing(flipRotation, {
      toValue: 180,
      duration: 300,
      useNativeDriver: true
    })
  ]);
};

const animateShimmer = (translateX) => {
  translateX.setValue(-width);
  Animated.timing(translateX, {
    toValue: width,
    duration: 1000,
    useNativeDriver: true
  }).start(() => animateShimmer(translateX));
};

// Export the styles and animation functions
export { styles, animateCardSelection, animateCardDeal, animateWinnerConfetti, animateCardFlip, animateShimmer };