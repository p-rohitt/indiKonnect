import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const StackLayout = () => {
  const navigation = useNavigation()
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="signup"
        options={{ presentation: "modal", headerShown: false }}
        /> 
      <Stack.Screen name ="register-shop" options={{headerShown:false}} />
      <Stack.Screen name="shopKeeperHome" options={{headerShown:false}} />
      <Stack.Screen name="ManageOrder" options={{headerShown:false}} />
      <Stack.Screen name="home" options={{headerShown:false}} />
      <Stack.Screen name="profile" options={{headerShown:false}} />
      <Stack.Screen
          name="(modal)/product"
          options={{
            presentation: 'modal',
            headerTitle: '',
            headerTransparent: true,
            
            headerLeft: () => (
              <TouchableOpacity
              style={{ backgroundColor: '#fff', borderRadius: 20, padding: 6 }}
              onPress={() => {
                navigation.goBack();
              }}>
                <Ionicons name="close-outline" size={28} color={Colors.primary} />
              </TouchableOpacity>
            ),
          }}
          />
          <Stack.Screen
          name="cart"
          options={{
            presentation:'modal',
            headerTitle: '',
            headerTransparent: true,
            
            headerLeft: () => (
              <TouchableOpacity
              style={{ backgroundColor: '#fff', borderRadius: 20, padding:6,marginLeft:-10}}
              onPress={() => {
                navigation.goBack();
              }}>
                <Ionicons name="close-outline" size={28} color={Colors.primary} />
              </TouchableOpacity>
            ),
          }}
          />
    </Stack>
  );
};

export default StackLayout;
