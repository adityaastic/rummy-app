import { Tabs } from 'expo-router';
// import { Chrome as Home, Users, Settings, Wallet } from 'lucide-react-native';
import { Chrome as Home, Users, Settings, Wallet } from 'lucide-react-native';
import { Gamepad2 as RummyIcon } from 'lucide-react-native';
import RummyGame from './RummyGame';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: '#1a1b1e',
        },
        tabBarActiveTintColor: '#e11d48',
        tabBarInactiveTintColor: '#71717a',
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lobby"
        options={{
          title: 'Lobby',
          tabBarIcon: ({ size, color }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => <Settings size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ size, color }) => <Wallet size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="RummyGame"
        options={{
          title: 'Rummy',
          tabBarIcon: ({ size, color }) => <RummyIcon size={size} color={color} />,
        }}
      />


    </Tabs>
  );
}