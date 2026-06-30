import colors from "@/styles/colors";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePathname } from "expo-router";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function getTitleFromPath(pathname: string) {
  if (pathname.includes("profile")) return "Profile";
  if (pathname.includes("map")) return "Map";
  if (pathname.includes("reviews")) return "Reviews";
  return "App";
}

export default function AppHeader() {
  const pathname = usePathname();
  const title = getTitleFromPath(pathname);

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        Alert.alert("Logout failed", error.message);
      }
    } catch (err: any) {
      Alert.alert("Logout failed", err?.message ?? String(err));
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/images/adaptive-icon.png")}
        />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right side: name image + logout button */}
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          //onPress={handleLogout}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Ionicons
            name="log-out-outline"
            size={32}
            color={colors.background}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 140,
    flexDirection: "row",
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 40,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: colors.background,
    fontSize: 40,
    paddingLeft: 10,
    fontWeight: "400",
    fontFamily: "Caprasimo_400Regular",
  },
  logoutButton: {
    padding: 6,
    borderRadius: 6,
    color: colors.background,
  },
  logo: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});
