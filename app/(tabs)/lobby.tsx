import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useState } from 'react';

type GameRoom = {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
};

export default function LobbyScreen() {
  const [rooms, setRooms] = useState<GameRoom[]>([
    { id: '1', name: 'Room 1', players: 2, maxPlayers: 4 },
    { id: '2', name: 'Room 2', players: 1, maxPlayers: 4 },
    { id: '3', name: 'Room 3', players: 3, maxPlayers: 4 },
  ]);

  const renderRoom = ({ item }: { item: GameRoom }) => (
    <Pressable style={styles.roomCard}>
      <Text style={styles.roomName}>{item.name}</Text>
      <Text style={styles.playerCount}>
        Players: {item.players}/{item.maxPlayers}
      </Text>
      <Pressable style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Join</Text>
      </Pressable>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Lobby</Text>
      <Pressable style={styles.createButton}>
        <Text style={styles.createButtonText}>Create Room</Text>
      </Pressable>
      <FlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id}
        style={styles.roomList}
        contentContainerStyle={styles.roomListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#18181b',
  },
  createButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roomList: {
    flex: 1,
  },
  roomListContent: {
    gap: 12,
  },
  roomCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#18181b',
  },
  playerCount: {
    fontSize: 14,
    color: '#52525b',
    marginBottom: 12,
  },
  joinButton: {
    backgroundColor: '#e11d48',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});