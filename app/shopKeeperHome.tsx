import { View, Text, SafeAreaView, Image, Pressable, Button, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

import {useRouter} from "expo-router"
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { ScrollView } from "react-native";

const ANGLE = 3;
const TIME = 100;
const EASING = Easing.elastic(1.5);
const shopKeeperHome = () => {


  const router = useRouter()
  const [shopName, setShopName] = useState("Rohit Shop");
  const [address, setAddress] = useState("Bongora, Kamrup");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([
    "Grocery",
    "Household",
    "Beverages",
  ]);

  const handleSignout = async ()=>{
    await AsyncStorage.removeItem("authToken");
    router.replace('/');
    

  }

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      triggerAnimation();
    }, 7000); // Trigger animation every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const triggerAnimation = () => {
    rotation.value = withSequence(
      withTiming(-ANGLE, { duration: TIME / 2, easing: EASING }),
      withRepeat(
        withTiming(ANGLE, {
          duration: TIME,
          easing: EASING,
        }),
        7,
        true
      ),
      withTiming(0, { duration: TIME / 2, easing: EASING })
    );
  };

  
    const handleLogout = async () => {
      await AsyncStorage.removeItem("authToken");
      router.replace("/")

    
  }

  return (
    <SafeAreaView className="items-center text-black">
      <View className="items-center  text-black">
        <View className=" flex-row w-[100vw] p-1 rounded-lg space-x-4 items-center justify-between">
          <View className="flex-row space-x-3">

          <Image
            width={70}
            height={70}
            source={{
              uri: "https://imgs.search.brave.com/MjpK3YXCDOpApdASsYXDiZIPAjGydnpAjFxM6Dt_ynY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni84NjkvODY5NjM2/LnBuZw",
            }}
            />

          <View className=" justify-center">
            <Text className="text-3xl font-bold text-black">{shopName}</Text>
            <View className="flex-row space-x-2 items-center">
              <FontAwesome name="map-marker" size={18} />
              <Text className="text-md text-black">{address}</Text>
            </View>
            </View>
          </View>
          <View>
          <Pressable onPress={handleLogout}>
          <Ionicons name="exit-outline" size={38} color="black" />
        </Pressable>
          </View>
        </View>
        {/* <Pressable className="flex-row items-center bg-yellow-300  w-[60vw] rounded-lg justify-center">
          <Text className="p-2 font-bold text-lg">3 Orders Pending!</Text>
          <Feather name="arrow-right" size={24} color="black" />
        </Pressable> */}
      </View>

      <View className="flex flex-row py-2 mx-4 items-center space-x-2 border-b-2">
        <View className="flex-1 flex-row space-x-2 p-2 bg-gray-200">
          <MagnifyingGlassIcon size={20} />
          <TextInput
            placeholder="Search for products..."
            keyboardType="default"
          />
        </View>
        <AdjustmentsHorizontalIcon size={25} />
      </View>
      {/* <View className="bg-slate-100 w-full">

      <View className=" w-full flex-row   justify-around   px-4 py-8 ">
        <View className="bg-slate-400 p-6 rounded-lg w-[40vw] items-center justify-center">
          <Text className="text-black text-3xl font-bold">40</Text>
          <Text className="text-white text-s">Orders</Text>
        </View>
        <View className="bg-green-800 p-6 rounded-lg w-[40vw] items-center justify-center">
          <Text className="text-yellow-500 text-3xl font-bold">129</Text>
          <Text className="text-white text-s">Products</Text>
        </View>
      </View>
      <View className="mt-2 w-full flex-row   justify-around   px-4 py-8 ">
        <View className="bg-yellow-500 p-6 rounded-lg w-[40vw] items-center justify-center">
          <Text className="text-green-800 text-3xl font-bold">₹4.5K</Text>
          <Text className="text-white text-s">Revenue</Text>
        </View>
        <View className="bg-black p-6 rounded-lg w-[40vw] items-center justify-center">
          <Text className="text-slate-400 text-3xl font-bold">27</Text>
          <Text className="text-white text-s">Customers</Text>
        </View>
      </View> */}
      {/* </View> */}

      

      <Animated.View className=" h-[14vh] items-center justify-center" style={animatedStyle}>
          <View className="w-[90vw] items-center  bg-orange-200 p-4 rounded-lg">
            <Text className="text-lg p-1 font-semibold">
              You have <Text className="text-2xl font-bold mx-1">6</Text> pending orders!
            </Text>
          </View>
      </Animated.View>


      <View className="flex-row h-[20vh] space-x-4">
        <Pressable onPress= {() => router.push('/ManageOrder')}className="w-[40vw] h-[20vh] bg-gray-200 items-center justify-center rounded-lg">
        <Ionicons name="basket-sharp" size={74} color="black" />
          <Text className="text-md font-bold">
            Manage Orders
          </Text>
        </Pressable>
        <View className="w-[40vw] h-[20vh] bg-gray-200 items-center justify-center rounded-lg">
        <MaterialIcons name="inventory" size={74} color="black" />
          <Text className="text-md font-bold">
            Update Inventory
          </Text>
        </View>
      </View>


      <View className="flex-row h-[20vh] space-x-4 mt-10">
        <View className="w-[40vw] h-[20vh] bg-gray-200 items-center justify-center rounded-lg space-y-3">
        <Fontisto name="shopping-basket-add" size={74} color="black" />
          <Text className="text-md font-bold">
            Add Product
          </Text>
        </View>
        <View className="w-[40vw] h-[20vh] bg-gray-200 items-center justify-center rounded-lg">
        <MaterialCommunityIcons name="account-details" size={74} color="black" />
          <Text className="text-md font-bold">
            Update Details
          </Text>
        </View>
      </View>

      




    </SafeAreaView>

  );
};

export default shopKeeperHome;
