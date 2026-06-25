import { useAuth } from "@/components/AuthProvider";
import defaultStyles from "@/styles/defaultStyles";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Auth from "../components/Auth";

export default function Index() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (session?.user) {
      router.replace("/(tabs)/profile");
    }
  }, [router, session]);

  if (isLoading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  if (session?.user) {
    return null;
  }
  return (
    <SafeAreaView style={defaultStyles.pageContainer}>
      <Auth />
    </SafeAreaView>
  );
}
