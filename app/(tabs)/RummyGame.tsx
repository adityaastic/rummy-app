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
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Animated, Easing } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  isBot: boolean;
};


type GameAction = {
  player: number;
  action: string;
  cards?: Card[];
  message: string;
};


export default function EnhancedRummyGame() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [hasDrawnCard, setHasDrawnCard] = useState(false);
  const [gameLog, setGameLog] = useState<GameAction[]>([]);
  const [thinking, setThinking] = useState(false);
  const [showRules, setShowRules] = useState(false);


  // Animation values
  const cardMoveAnim = useRef(new Animated.Value(0)).current;
  const botThinkingAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;


  const suits = ['♥', '♦', '♣', '♠'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];


  useEffect(() => {
    // Handle bot's turn
    if (gameStarted && !winner && players[currentPlayer]?.isBot) {
      handleBotTurn();
    }
  }, [currentPlayer, gameStarted, hasDrawnCard]);


  const addToGameLog = (action: GameAction) => {
    setGameLog(prev => [...prev, action]);
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
    // Reset animations
    fadeAnim.setValue(0);
    cardMoveAnim.setValue(0);
   
    const newDeck = initializeDeck();
    const newPlayers: Player[] = [
      { id: 0, hand: [], melds: [], isBot: false },
      { id: 1, hand: [], melds: [], isBot: true }
    ];


    // Clear game log
    setGameLog([]);


    // Deal 10 cards to each player
    for (let i = 0; i < 13; i++) {
      newPlayers[0].hand.push(newDeck.pop()!);
      newPlayers[1].hand.push(newDeck.pop()!);
    }


    const firstDiscardCard = newDeck.pop()!;
    setDiscardPile([firstDiscardCard]);
   
    // Add deal action to game log
    addToGameLog({
      player: -1,
      action: "DEAL",
      message: "Cards dealt to players. Game starts."
    });
   
    addToGameLog({
      player: -1,
      action: "DISCARD",
      cards: [firstDiscardCard],
      message: `Initial card ${firstDiscardCard.value}${firstDiscardCard.suit} placed on discard pile.`
    });


    setDeck(newDeck);
    setPlayers(newPlayers);
    setGameStarted(true);
    setCurrentPlayer(0);
    setHasDrawnCard(false);
    setWinner(null);
    setSelectedCards([]);
   
    // Fade in animation for the game board
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  };


  const drawCard = (fromDiscard: boolean = false) => {
    if (hasDrawnCard) {
      Alert.alert("You've already drawn a card this turn");
      return;
    }


    let drawnCard: Card;
    const playerType = players[currentPlayer].isBot ? "Bot" : "You";


    if (fromDiscard) {
      if (discardPile.length <= 1) {
        Alert.alert("Cannot draw from an empty discard pile");
        return;
      }
      drawnCard = discardPile.pop()!;
      setDiscardPile([...discardPile]);
     
      addToGameLog({
        player: currentPlayer,
        action: "DRAW_DISCARD",
        cards: [drawnCard],
        message: `${playerType} drew ${drawnCard.value}${drawnCard.suit} from discard pile.`
      });
    } else {
      if (deck.length === 0) {
        if (discardPile.length <= 1) {
          Alert.alert("No cards left to draw");
          return;
        }
        const newDeck = shuffleDeck(discardPile.slice(0, -1));
        const lastDiscardCard = discardPile[discardPile.length - 1];
        setDeck(newDeck);
        setDiscardPile([lastDiscardCard]);
        drawnCard = newDeck.pop()!;
       
        addToGameLog({
          player: -1,
          action: "RESHUFFLE",
          message: "Discard pile reshuffled into deck."
        });
      } else {
        drawnCard = deck.pop()!;
        setDeck([...deck]);
      }
     
      addToGameLog({
        player: currentPlayer,
        action: "DRAW_DECK",
        message: `${playerType} drew a card from the deck.`
      });
    }


    const updatedPlayers = [...players];
    updatedPlayers[currentPlayer].hand.push(drawnCard);
    setPlayers(updatedPlayers);
    setHasDrawnCard(true);
   
    // Card drawing animation
    Animated.sequence([
      Animated.timing(cardMoveAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(cardMoveAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true
      })
    ]).start();
  };


  const discardCard = (card: Card) => {
    if (!hasDrawnCard) {
      Alert.alert("You must draw a card before discarding");
      return;
    }
  
    const playerHand = players[currentPlayer].hand;
    const cardIndex = playerHand.findIndex(c => c.id === card.id);
    const playerType = players[currentPlayer].isBot ? "Bot" : "You";
    
    if (cardIndex !== -1) {
      const updatedPlayers = [...players];
      const removedCard = updatedPlayers[currentPlayer].hand.splice(cardIndex, 1)[0];
      
      // Card discard animation
      Animated.timing(cardMoveAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }).start(() => {
        setPlayers(updatedPlayers);
        setDiscardPile([...discardPile, removedCard]);
        
        addToGameLog({
          player: currentPlayer,
          action: "DISCARD",
          cards: [removedCard],
          message: `${playerType} discarded ${removedCard.value}${removedCard.suit}.`
        });
        
        // Check for winner - if hand is empty after discarding
        if (updatedPlayers[currentPlayer].hand.length === 0) {
          setWinner(currentPlayer);
          addToGameLog({
            player: currentPlayer,
            action: "WIN",
            message: `${playerType} won the game!`
          });
        } else {
          // Move to next player
          setCurrentPlayer((currentPlayer + 1) % 2);
          setSelectedCards([]);
          setHasDrawnCard(false);
          cardMoveAnim.setValue(0);
        }
      });
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


  const createMeld = (cardsToMeld = selectedCards) => {
    if (!hasDrawnCard && !players[currentPlayer].isBot) {
      Alert.alert("You must draw a card before creating a meld");
      return;
    }
  
    if (isValidMeld(cardsToMeld)) {
      const updatedPlayers = [...players];
      const newMeld = [...cardsToMeld];
      updatedPlayers[currentPlayer].melds.push(newMeld);
      const playerType = players[currentPlayer].isBot ? "Bot" : "You";
  
      // Remove melded cards from hand
      cardsToMeld.forEach(card => {
        const index = updatedPlayers[currentPlayer].hand.findIndex(c => c.id === card.id);
        if (index !== -1) {
          updatedPlayers[currentPlayer].hand.splice(index, 1);
        }
      });
  
      addToGameLog({
        player: currentPlayer,
        action: "MELD",
        cards: newMeld,
        message: `${playerType} created a meld with ${newMeld.length} cards.`
      });
  
      // Meld creation animation
      Animated.timing(cardMoveAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }).start(() => {
        setPlayers(updatedPlayers);
        setSelectedCards([]);
        cardMoveAnim.setValue(0);
        
        // Check for winner - if hand is empty after creating meld
        if (updatedPlayers[currentPlayer].hand.length === 0) {
          setWinner(currentPlayer);
          addToGameLog({
            player: currentPlayer,
            action: "WIN",
            message: `${playerType} won the game!`
          });
        }
      });
    } else if (!players[currentPlayer].isBot) {
      Alert.alert("Invalid meld. Check the rules and try again.");
    }
  };

  const toggleCardSelection = (card: Card) => {
    if (players[currentPlayer].isBot) return;
   
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


  // Check if player can form any more melds
  const canFormMoreMelds = (hand: Card[]): boolean => {
    // If hand has less than 3 cards, can't form melds
    if (hand.length < 3) return false;
    
    // Check if any combination of 3+ cards can form a valid meld
    return findPotentialMelds(hand).length > 0;
  };


  // Bot AI
  const handleBotTurn = () => {
    if (thinking) return;
    
    setThinking(true);
    
    // Animate bot thinking
    Animated.loop(
      Animated.sequence([
        Animated.timing(botThinkingAnim.y, {
          toValue: -10,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(botThinkingAnim.y, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ])
    ).start();
    
    // Bot thinking delay
    setTimeout(() => {
      if (!hasDrawnCard) {
        // Bot decides whether to draw from deck or discard pile
        const shouldDrawFromDiscard = shouldBotDrawFromDiscard();
        drawCard(shouldDrawFromDiscard);
      } else {
        // Check if bot has only one card left - if so, discard it immediately to win
        if (players[currentPlayer].hand.length === 1) {
          console.log("Bot has one card left - discarding to win");
          const cardToDiscard = players[currentPlayer].hand[0];
          discardCard(cardToDiscard);
        } else {
          // Find possible melds
          const potentialMelds = findPotentialMelds(players[currentPlayer].hand);
          
          if (potentialMelds.length > 0) {
            // Create the best meld
            createMeld(potentialMelds[0]);
            
            // After creating meld, check if bot has only one card left
            setTimeout(() => {
              if (players[currentPlayer]?.hand.length === 1) {
                console.log("Bot has one card left after creating meld - discarding to win");
                const cardToDiscard = players[currentPlayer].hand[0];
                discardCard(cardToDiscard);
              } else if (players[currentPlayer]?.hand.length > 1) {
                // Discard worst card if bot still has multiple cards
                console
                const cardToDiscard = chooseBotDiscard();
                discardCard(cardToDiscard);
              }
            }, 1000);
          } else {
            // Just discard worst card if no melds possible
            const cardToDiscard = chooseBotDiscard();
            discardCard(cardToDiscard);
          }
        }
      }
      
      // Stop thinking animation
      botThinkingAnim.stopAnimation();
      botThinkingAnim.setValue({ x: 0, y: 0 });
      setThinking(false);
    }, 1500);
  };


  const shouldBotDrawFromDiscard = (): boolean => {
    if (discardPile.length <= 0) return false;
   
    const topDiscard = discardPile[discardPile.length - 1];
    const botHand = players[currentPlayer].hand;
   
    // Check if discard card would form a meld with existing cards
    for (let i = 0; i < botHand.length; i++) {
      for (let j = i + 1; j < botHand.length; j++) {
        const potentialMeld = [topDiscard, botHand[i], botHand[j]];
        if (isValidMeld(potentialMeld)) {
          return true;
        }
      }
    }
   
    // 30% chance to take discard even if no immediate meld
    return Math.random() < 0.3;
  };


  const findPotentialMelds = (hand: Card[]): Card[][] => {
    const potentialMelds: Card[][] = [];
   
    // Check all possible card combinations for valid melds
    for (let i = 0; i < hand.length; i++) {
      for (let j = i + 1; j < hand.length; j++) {
        for (let k = j + 1; k < hand.length; k++) {
          const potentialMeld = [hand[i], hand[j], hand[k]];
          if (isValidMeld(potentialMeld)) {
            potentialMelds.push(potentialMeld);
          }
         
          // Check for 4-card melds
          for (let l = k + 1; l < hand.length; l++) {
            const potentialLargeMeld = [...potentialMeld, hand[l]];
            if (isValidMeld(potentialLargeMeld)) {
              potentialMelds.push(potentialLargeMeld);
            }
          }
        }
      }
    }
   
    // Sort melds by length (prefer larger melds)
    potentialMelds.sort((a, b) => b.length - a.length);
    return potentialMelds;
  };


  const chooseBotDiscard = (): Card => {
    const hand = players[currentPlayer].hand;
   
    // If only one card left, discard it
    if (hand.length === 1) {
      return hand[0];
    }
    
    // Strategy: discard card that's least likely to form a meld
    let worstCard = hand[0];
    let worstScore = Number.MAX_SAFE_INTEGER;
   
    hand.forEach(card => {
      let score = 0;
     
      // Check how many potential melds this card could be part of
      hand.forEach(otherCard => {
        if (otherCard.id !== card.id) {
          // Same suit and sequential values
          if (otherCard.suit === card.suit &&
              Math.abs(getCardValue(otherCard.value) - getCardValue(card.value)) <= 2) {
            score += 10;
          }
         
          // Same value
          if (otherCard.value === card.value) {
            score += 15;
          }
        }
      });
     
      if (score < worstScore) {
        worstScore = score;
        worstCard = card;
      }
    });
   
    return worstCard;
  };


  const renderCard = (card: Card, selectable: boolean = true, faceDown: boolean = false) => {
    const isSelected = isCardSelected(card);
    const isRed = card.suit === '♥' || card.suit === '♦';


    return (
      <TouchableOpacity
        key={card.id}
        onPress={() => selectable ? toggleCardSelection(card) : null}
        style={[
          styles.card,
          isSelected && styles.selectedCard,
          { backgroundColor: isSelected ? '#e0e0e0' : 'white' }
        ]}
        disabled={faceDown || players[currentPlayer].isBot}
      >
        {faceDown ? (
            <LinearGradient
                        colors={['#064e3b', '#065f46']}
                        style={styles.cardBack}
                      >
          <View >
            <MaterialCommunityIcons name="cards" size={30} color="rgba(255, 255, 255, 0.5)" />
          </View>
            </LinearGradient>
        ) : (
          <Text style={[
            styles.cardText,
            { color: isRed ? 'red' : 'black' }
          ]}>
            {card.value}{card.suit}
          </Text>
        )}
      </TouchableOpacity>
    );
  };


  // const renderGameLog = () => {
  //   return (
  //     <View style={styles.logContainer}>
  //       <Text style={styles.logTitle}>Game Log</Text>
  //       <ScrollView style={styles.logScroll}>
  //         {gameLog.slice(-5).map((entry, index) => (
  //           <Text key={index} style={styles.logEntry}>
  //             {entry.message}
  //           </Text>
  //         ))}
  //       </ScrollView>
  //     </View>
  //   );
  // };


  const renderRules = () => {
    if (!showRules) return null;
   
    return (
      <View style={styles.rulesModal}>
        <View style={styles.rulesContent}>
          <Text style={styles.rulesTitle}>Rummy Rules</Text>
          <ScrollView style={styles.rulesScroll}>
            <Text style={styles.rulesText}>
              <Text style={styles.rulesBold}>Objective:</Text> Form melds and be the first to discard all your cards.
              {'\n\n'}
              <Text style={styles.rulesBold}>Valid Melds:</Text>
              {'\n'}- Sets: 3-4 cards of the same value but different suits
              {'\n'}- Runs: 3+ consecutive cards of the same suit
              {'\n\n'}
              <Text style={styles.rulesBold}>Turn Steps:</Text>
              {'\n'}1. Draw a card from the deck or discard pile
              {'\n'}2. Form melds (optional)
              {'\n'}3. Discard one card
              {'\n\n'}
              <Text style={styles.rulesBold}>Scoring:</Text>
              {'\n'}- Face cards (J, Q, K): 10 points
              {'\n'}- Ace: 1 point
              {'\n'}- Number cards: Face value
              {'\n\n'}
              <Text style={styles.rulesBold}>End Game:</Text>
              {'\n'}- The game ends when a player discards their last card
              {'\n'}- If you can't form any more melds, you can win by discarding your last card
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeRulesButton}
            onPress={() => setShowRules(false)}>
            <Text style={styles.closeRulesText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  return (
    <>
      <Stack.Screen options={{ title: 'Rummy Deluxe' }} />
      <LinearGradient
            colors={['#104818', 'rgb(10, 11, 10)']}
            style={styles.container}
          >
        {!gameStarted ? (
          <View style={styles.startContainer}>
            <Text style={styles.gameTitle}>Rummy Deluxe</Text>
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
              <TouchableOpacity onPress={dealCards}>
  <LinearGradient
    colors={['green', 'white']} // Gradient from Green to White
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.startButton} // Apply styles
  >
    <Text style={styles.startButtonText}>Start Game</Text>
  </LinearGradient>
</TouchableOpacity>
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => setShowRules(true)}>
              <Text style={styles.startButtonText}>Rules</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View style={[styles.gameContainer, { opacity: fadeAnim }]}>
            {winner !== null ? (
              <View style={styles.winnerContainer}>
                <Text style={styles.winnerText}>
                  {winner === 0 ? "You win!" : "Bot wins!"}
                </Text>
                <TouchableOpacity style={styles.startButton} onPress={dealCards}>
                  <Text style={styles.startButtonText}>Play Again</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.statusBar}>
                  <Text style={styles.playerTurn}>
                    {currentPlayer === 0 ? "Your Turn" : "Bot's Turn"}
                  </Text>
                  <Text style={styles.turnStatus}>
                    {hasDrawnCard ? 
                      (players[currentPlayer].hand.length === 1 ? 
                        "Discard your last card to win!" : 
                        "Choose your move") : 
                      "Draw a card to start your turn"}
                  </Text>
                  <TouchableOpacity
                    style={styles.rulesButton}
                    onPress={() => setShowRules(true)}>
                    <Text style={styles.rulesButtonText}>Rules</Text>
                  </TouchableOpacity>
                </View>
               
                {/* Bot's hand */}
                <View style={styles.opponentContainer}>
                  <View style={styles.opponentHeader}>
                    <Text style={styles.sectionTitle}>Bot's Hand:</Text>
                    {thinking && (
                      <Animated.View style={[{ transform: [{ translateY: botThinkingAnim.y }] }]}>
                        <Text style={styles.thinking}>Thinking...</Text>
                      </Animated.View>
                    )}
                  </View>
                  <ScrollView horizontal style={styles.handContainer}>
                    {players[1]?.hand.map((card, index) => (
                      <Animated.View
                        key={index}
                        style={currentPlayer === 1 && index === players[1].hand.length - 1 && hasDrawnCard ?
                          [{ transform: [{ translateY: cardMoveAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -10]
                          }) }] }] : {}
                        }
                      >
                        {renderCard(card, false, true)}
                      </Animated.View>
                    ))}
                  </ScrollView>
                </View>


                {/* Bot's Melds */}
                <View style={styles.meldsContainer}>
                  <Text style={styles.sectionTitle}>Bot's Melds:</Text>
                  <ScrollView horizontal>
                    {players[1]?.melds.map((meld, index) => (
                      <View key={index} style={styles.meld}>
                        {meld.map(card => renderCard(card, false))}
                      </View>
                    ))}
                  </ScrollView>
                </View>


                {/* Game Area */}
                <View style={styles.gameArea}>
                  <View style={styles.deckArea}>
                    <TouchableOpacity
                      style={[styles.card, styles.deck]}
                      onPress={() => currentPlayer === 0 ? drawCard(false) : null}
                      disabled={currentPlayer !== 0 || hasDrawnCard}
                    >
                       <LinearGradient
                        colors={['#064e3b', '#065f46']}
                        style={styles.cardBack}
                      >
                      <MaterialCommunityIcons name="cards" size={40} color="white" />
                      <Text style={styles.remainingCards}>
                        {deck.length}
                      </Text>
                      </LinearGradient>
                    </TouchableOpacity>


                    {discardPile.length > 0 && (
                      <TouchableOpacity
                        style={[styles.card, styles.discardPile]}
                        onPress={() => currentPlayer === 0 ? drawCard(true) : null}
                        disabled={currentPlayer !== 0 || hasDrawnCard}
                      >
                        {renderCard(discardPile[discardPile.length - 1], false)}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>


                {/* Game Log */}
                {/* {renderGameLog()} */}


                {/* Player's Melds */}
                <View style={styles.meldsContainer}>
                  <Text style={styles.sectionTitle}>Your Melds:</Text>
                  <ScrollView horizontal>
                    {players[0]?.melds.map((meld, index) => (
                      <View key={index} style={styles.meld}>
                        {meld.map(card => renderCard(card, false))}
                      </View>
                    ))}
                  </ScrollView>
                </View>


                {/* Player's Hand */}
                <View style={styles.playerContainer}>
                  <Text style={styles.sectionTitle}>Your Hand:</Text>
                  <ScrollView horizontal style={styles.handContainer}>
                    {players[0]?.hand.map((card, index) => (
                      <Animated.View
                        key={index}
                        style={currentPlayer === 0 && index === players[0].hand.length - 1 && hasDrawnCard ?
                          [{ transform: [{ translateY: cardMoveAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -10]
                          }) }] }] : {}
                        }
                      >
                        {renderCard(card, currentPlayer === 0)}
                      </Animated.View>
                    ))}
                  </ScrollView>


                  {currentPlayer === 0 && (
                    <View style={styles.actionButtons}>
                      {selectedCards.length >= 3 && (
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => createMeld()}
                        >
                          <Text style={styles.actionButtonText}>Create Meld</Text>
                        </TouchableOpacity>
                      )}
                      {selectedCards.length === 1 && (
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => discardCard(selectedCards[0])}
                        >
                          <Text style={styles.actionButtonText}>Discard</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </>
            )}
          </Animated.View>
        )}
        {renderRules()}
     
      </LinearGradient>
    </>
  );
}


const styles = StyleSheet.create({


  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(rgb(15, 42, 20), rgb(7, 22, 17))',
    padding: 10,
    marginTop:40,
  },
  gameContainer: {
    flex: 1,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  startButton: {
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,  
  },
  startButtonText: {
    color: 'black', // Change text color for better contrast
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  playerTurn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  turnStatus: {
    fontSize: 16,
    borderWidth: 2,       // Thickness of the border
    borderColor: 'green',  // Color of the border
    borderRadius: 10,
    padding: 5,
    color: 'white',
    opacity: 0.8,
  },
  rulesButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  rulesButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  opponentContainer: {
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
  },
  opponentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thinking: {
    color: '#FFD700',
    fontStyle: 'italic',
  },
  gameArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  deckArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  card: {
    width: 50,
    height: 70,
    borderRadius: 8,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#1e88e5',
    elevation: 8,
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardBack: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    // backgroundColor: 'linear-gradient(rgb(6, 78, 59), rgb(21, 187, 140))',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deck: {
    // backgroundColor: 'linear-gradient(rgb(6, 78, 59), rgb(8, 190, 139))',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discardPile: {
    marginLeft: 20,
  },
  remainingCards: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  handContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  playerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginTop: 'auto',
  },
  meldsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  meld: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginRight: 10,
    padding: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginHorizontal: 5,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  winnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 30,
  },
  logContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    maxHeight: 120,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  logScroll: {
    maxHeight: 80,
  },
  logEntry: {
    color: '#e0e0e0',
    fontSize: 14,
    paddingVertical: 2,
  },
  rulesModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  rulesContent: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  rulesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  rulesScroll: {
    maxHeight: 400,
  },
  rulesText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  rulesBold: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  closeRulesButton: {
    backgroundColor: '#1e88e5',
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
    alignSelf: 'center',
  },
  closeRulesText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
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
});





