import { Tabs } from 'expo-router/js-tabs';

import { BottomNav } from '@/components/ui/bottom-nav';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <BottomNav {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="giveaways" />
      <Tabs.Screen name="haazri" />
      <Tabs.Screen name="winners" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
