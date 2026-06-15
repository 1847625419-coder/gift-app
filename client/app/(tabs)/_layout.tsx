import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Wand2, FolderHeart } from 'lucide-react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFDF7',
          borderTopWidth: 1,
          borderTopColor: '#E5DED4',
          height: Platform.OS === 'web' ? 'auto' : 60 + insets.bottom,
          paddingBottom: Platform.OS === 'web' ? 8 : insets.bottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#B8860B',
        tabBarInactiveTintColor: '#6B5D4D',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => (
            <Home size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '创作',
          tabBarIcon: ({ color }) => (
            <Wand2 size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: '我的作品',
          tabBarIcon: ({ color }) => (
            <FolderHeart size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
