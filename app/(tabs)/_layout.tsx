import AppHeader from "@/components/AppHeader";
import Auth from "@/components/Auth";
import { useAuth } from "@/components/AuthProvider";
import colors from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
  const { session } = useAuth();
  if (session === null) {
    return (
      <View style={{ flex: 1 }}>
        <AppHeader />
        <Auth />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AppHeader />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.tint,
          tabBarInactiveTintColor: colors.secondary,
          headerStyle: {
            backgroundColor: colors.primarylight,
          },
          headerShadowVisible: false,
          headerTintColor: "black",
          tabBarStyle: {
            backgroundColor: colors.primarylight,
          },
        }}
      >
        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: "Profile",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "person-circle" : "person-circle-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            headerTitle: "Map",
            tabBarIcon: ({ focused, color }) => (
              <FontAwesome
                name={focused ? "map" : "map-o"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="reviews"
          options={{
            headerTitle: "Reviews",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "list" : "list-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
