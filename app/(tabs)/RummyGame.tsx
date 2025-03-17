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


import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ImageBackground, Dimensions } from 'react-native';
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

  const suits = ['♥', '♦', '♣', '♠'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

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
  };

  const drawCard = (fromDiscard: boolean = false) => {
    if (hasDrawnCard) {
      Alert.alert("You've already drawn a card this turn");
      return;
    }

    let drawnCard: Card;

    if (fromDiscard) {
      if (discardPile.length <= 1) {
        Alert.alert("Cannot draw from an empty discard pile");
        return;
      }
      drawnCard = discardPile.pop()!;
      setDiscardPile([...discardPile]);
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
      } else {
        drawnCard = deck.pop()!;
        setDeck([...deck]);
      }
    }

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayer].hand.push(drawnCard);
    setPlayers(updatedPlayers);
    setHasDrawnCard(true);
  };

  const discardCard = (card: Card) => {
    if (!hasDrawnCard) {
      Alert.alert("You must draw a card before discarding");
      return;
    }

    const playerHand = players[currentPlayer].hand;
    const cardIndex = playerHand.findIndex(c => c.id === card.id);
   
    if (cardIndex !== -1) {
      const updatedPlayers = [...players];
      const removedCard = updatedPlayers[currentPlayer].hand.splice(cardIndex, 1)[0];
      setPlayers(updatedPlayers);
      setDiscardPile([...discardPile, removedCard]);
      setCurrentPlayer((currentPlayer + 1) % 2);
      setSelectedCards([]);
      setHasDrawnCard(false);

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
      Alert.alert("You must draw a card before creating a meld");
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

      // Check for winner
      if (updatedPlayers[currentPlayer].hand.length === 0) {
        setWinner(currentPlayer);
      }
    } else {
      Alert.alert("Invalid meld. Check the rules and try again.");
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

    return (
      <TouchableOpacity
        key={card.id}
        onPress={() => selectable ? toggleCardSelection(card) : null}
        style={[
          styles.card,
          isSelected && styles.selectedCard,
        ]}
      >
        <LinearGradient
         colors={isSelected ? ['#4cff96', '#134024'] : ['#f8f8f8', '#e8e8e8']}
          style={styles.cardGradient}
        >
          <Text style={[
            styles.cardText,
            { color: isRed ? '#e32636' : '#1e3a8a' }
          ]}>
            {card.value}{card.suit}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Royal Rummy', 
        headerStyle: { backgroundColor: '#064e3b' },  // Changed from '#0f172a' (dark blue)
        headerTitleStyle: { color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white'
      }} />
      
      {!gameStarted ? (
        <ImageBackground
          source={{ uri: 'https://i.ibb.co/Y8SQZ3T/poker-table-background.jpg' }}
          style={styles.backgroundImage}
        >
         <LinearGradient
  colors={['#104818', 'rgb(10, 11, 10)']}  // Changed from blue to dark green
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
            </View>
          </LinearGradient>
        </ImageBackground>
      ) : (
        <LinearGradient
        colors={['#0f2a14', '#071611']}  
          style={styles.container}
        >
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
              <View style={styles.statusBar}>
                <LinearGradient
                    colors={['#16a34a', '#15803d']}
                  style={styles.playerTurnBadge}
                >
                  <Text style={styles.playerTurn}>Player {currentPlayer + 1}'s Turn</Text>
                </LinearGradient>
                <Text style={styles.turnStatus}>
                  {hasDrawnCard ? "Choose your move" : "Draw a card to start your turn"}
                </Text>
              </View>
              
              {/* Opponent's hand (face down) */}
              <View style={styles.opponentContainer}>
                <Text style={styles.sectionTitle}>Player 2's Hand:</Text>
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

                  {discardPile.length > 0 && (
                    <TouchableOpacity
                      style={[styles.card, styles.discardPile]}
                      onPress={() => drawCard(true)}
                      activeOpacity={0.8}
                    >
                      {renderCard(discardPile[discardPile.length - 1], false)}
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Player's Melds */}
              <View style={styles.meldsContainer}>
                <Text style={styles.sectionTitle}>Your Melds:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {players[currentPlayer]?.melds.map((meld, index) => (
                  <View key={index} style={styles.meld}>
                  {meld.map(card => renderCard(card, false))}
                </View>
              ))}
              {players[currentPlayer]?.melds.length === 0 && (
                <View style={styles.emptyMeldsContainer}>
                  
                  <Text style={styles.emptyMeldsText}>No melds yet - select 3+ cards to create a meld  </Text>

                </View>
              )}
            </ScrollView>
          </View>

          {/* Player's Hand */}
          <View style={styles.playerContainer}>
            <Text style={styles.sectionTitle}>Your Hand:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.handContainer}>
              {players[currentPlayer]?.hand.map(card => renderCard(card))}
            </ScrollView>

            <View style={styles.actionButtons}>
              {selectedCards.length >= 3 && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={createMeld}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                   colors={['#10b981', '#0a2318']} 
                    style={styles.actionButtonGradient}
                  >
                    <Text style={styles.actionButtonText}>Create Meld</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              {selectedCards.length === 1 && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => discardCard(selectedCards[0])}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#10b981', '#059669']} 
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
startButton: {
width: 220,
height: 60,
borderRadius: 30,
overflow: 'hidden',
elevation: 5,
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.3,
shadowRadius: 4,
marginTop: 40,
},
gradientButton: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
paddingHorizontal: 20,
paddingVertical: 15,
},
startButtonText: {
color: 'white',
fontSize: 20,
fontWeight: 'bold',
letterSpacing: 1,
},
statusBar: {
alignItems: 'center',
marginBottom: 20,
},
playerTurnBadge: {
paddingHorizontal: 20,
paddingVertical: 8,
borderRadius: 20,
marginBottom: 8,
},
playerTurn: {
color: 'white',
fontSize: 18,
fontWeight: 'bold',
},
turnStatus: {
fontSize: 16,
color: 'white',
opacity: 0.8,
},
sectionTitle: {
fontSize: 18,
fontWeight: 'bold',
color: 'white',
marginBottom: 8,
letterSpacing: 0.5,
},
opponentContainer: {
marginBottom: 15,
},
gameArea: {
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
marginVertical: 15,
backgroundColor: 'rgba(6,78,59,0.2)', 
},
deckArea: {
flexDirection: 'row',
gap: 25,
},
playerContainer: {
marginTop: 'auto',
marginBottom: 10,
},
handContainer: {
flexGrow: 0,
marginBottom: 15,
paddingVertical: 5,
},
meldsContainer: {
marginBottom: 15,
},
emptyMeldsContainer: {
height: 100,
// backgroundColor: 'rgba(255, 255, 255, 0.1)',
backgroundColor: 'rgba(6,78,59,0.4)',
borderRadius: 8,
justifyContent: 'center',
alignItems: 'center',
paddingHorizontal: 20,
width: width - 40,
},
emptyMeldsText: {
color: 'white',
opacity: 0.6,
textAlign: 'center',
},
meld: {
flexDirection: 'row',
marginRight: 15,
backgroundColor: 'rgba(3, 70, 52, 0.94)',
borderRadius: 8,
padding: 8,
},
card: {
width: 65,
height: 100,
borderRadius: 8,
marginHorizontal: 4,
overflow: 'hidden',
elevation: 3,
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.2,
shadowRadius: 1.5,
},
cardGradient: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
},
selectedCard: {
elevation: 8,
shadowColor: '#ffd700',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.5,
shadowRadius: 5,
transform: [{ translateY: -5 }],
},
cardBack: {
backgroundColor: '#1e3a8a',
},
cardBackText: {
fontSize: 40,
color: 'white',
},
cardText: {
fontSize: 24,
fontWeight: 'bold',
},
deck: {
backgroundColor: '#1e3a8a',
},
discardPile: {
borderWidth: 2,
borderColor: '#ffd700',
},
deckCountBadge: {
position: 'absolute',
bottom: 5,
right: 5,
backgroundColor: 'rgba(255, 255, 255, 0.8)',
borderRadius: 10,
paddingHorizontal: 6,
paddingVertical: 2,
},
remainingCards: {
fontSize: 12,
color: '#1e3a8a',
fontWeight: 'bold',
},
actionButtons: {
flexDirection: 'row',
justifyContent: 'center',
gap: 15,
},
actionButton: {
width: 140,
borderRadius: 25,
overflow: 'hidden',
elevation: 4,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.3,
shadowRadius: 2,
},
actionButtonGradient: {
paddingVertical: 12,
paddingHorizontal: 15,
alignItems: 'center',
},
actionButtonText: {
color: 'white',
fontWeight: 'bold',
fontSize: 16,
letterSpacing: 0.5,
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
marginBottom: 30,
elevation: 5,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.3,
shadowRadius: 3,
},
winnerText: {
fontSize: 32,
fontWeight: 'bold',
color: 'white',
textShadowColor: 'rgba(0, 0, 0, 0.4)',
textShadowOffset: { width: 1, height: 1 },
textShadowRadius: 2,
},
playAgainButton: {
width: 200,
height: 60,
borderRadius: 30,
overflow: 'hidden',
elevation: 5,
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.3,
shadowRadius: 4,
},
});