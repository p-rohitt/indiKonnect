import { View, Text, Modal } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="signup"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
};

export default StackLayout;
