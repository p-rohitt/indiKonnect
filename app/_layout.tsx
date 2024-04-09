import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {StripeProvider} from "@stripe/stripe-react-native"
const StackLayout = () => {
  const navigation = useNavigation()
  return (
    <StripeProvider publishableKey="pk_test_51NghWISEnJyY7Nsx5e9ixesaxVRnBkOlXe4p4UzZ3aIiXL5TZfzdT9nS7BRuGC7ylHXn3g3MvXP93imZFE4RZKE100M8jogzy4">
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
      <Stack.Screen name="shop" options={{headerShown:false}} />
      <Stack.Screen name="inventory" options={{headerShown:false}} />
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
          name="(modal)/showProduct"
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
          name="(modal)/viewOrder"
          options={{
            presentation: 'modal',
            headerTitle: '',
            headerTransparent: true,
          }}
          />
          <Stack.Screen
          name="(modal)/addProduct"
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
   </StripeProvider>
  );
};

export default StackLayout;
