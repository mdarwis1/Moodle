import defaultStyles from "@/styles/defaultStyles";
import React, { useEffect, useState } from "react";
import { Alert, AppState, AppStateStatus, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../utils/supabase";
import Button from "./Button";
import TextField from "./TextField";

/*
  Auth component responsibilities:
  - Collect email + password
  - Call Supabase auth methods
  - NOT handle navigation
  - NOT store session state
*/
export default function Auth({ noHeader }: { noHeader?: boolean } = {}) {
  const [email, setEmail] = useState("@gmail.com");
  const [password, setPassword] = useState("123456");

  /*
    Supabase uses background token refresh.
    Start/stop based on app state.
  */
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        try {
          supabase.auth.stopAutoRefresh();
        } catch {}
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    if (AppState.currentState === "active") {
      supabase.auth.startAutoRefresh();
    }

    return () => {
      if (typeof subscription?.remove === "function") {
        subscription.remove();
      }
      try {
        supabase.auth.stopAutoRefresh();
      } catch {}
    };
  }, []);

  async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
    }
  }

  async function signUpWithEmail() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
    }
  }
  return (
    <SafeAreaView style={defaultStyles.pageContainer}>
      <Text style={defaultStyles.text}>Moodle</Text>
      <TextField placeholder="Email" value={email} onChangeText={setEmail} />

      <TextField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <Button title="Login" onPress={signInWithEmail} />
      <Button title="Signup" onPress={signUpWithEmail} />
    </SafeAreaView>
  );
}
