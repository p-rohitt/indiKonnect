import { View, Text } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <>
                <Ionicons name="home" size={24} color="black" />
              </>
            ) : (
              <>
                <Ionicons name="home-outline" size={24} color="black" />
              </>
            ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <>
                <Ionicons name="cart-sharp" size={24} color="black" />
              </>
            ) : (
              <>
                <Ionicons name="cart-outline" size={24} color="black" />
              </>
            ),
          tabBarLabel: "Cart",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: () => <AntDesign name="user" size={24} color="black" />,
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
