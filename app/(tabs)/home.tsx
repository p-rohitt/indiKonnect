import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  Pressable,
} from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { categories } from "@/lib/categories";
import Category from "@/components/Category";
import { Ionicons } from "@expo/vector-icons";
import { shops } from "@/lib/shops";
import ShopCard from "@/components/ShopCard";
import * as Location from "expo-location";
import { loadAsync } from "expo-font";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "expo-router";
const HomeScreen = () => {
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [token, setToken] = React.useState(null);
  const router = useRouter();
  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setToken(token);
    };
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);

      /*
         const response =  fetch("/location-route",{
            method:'POST',
            body:JSON.stringify({
              'latitude' : location.coords.latitude,
              'longitude' : location.coords.longitude,
            }),
            headers:{
              'Content-Type':'application/json'
            }
          })
        */

      const response = await axios.post(
        "http://localhost:8000/home",
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
    })();
  }, []);

  const handleLogout = async () => {

    await AsyncStorage.removeItem("authToken");
    router.replace("/")
    
  }

  useEffect(() => {}, [location]);

  return (
    <SafeAreaView className="bg-white pt-5">
      <View className="p-2 flex flex-row space-x-2 items-center">
        <Image
          source={{
            uri: "https://links.papareact.com/wru",
          }}
          className="h-12 w-12 bg-gray-4  object-contain"
        />
        <View className="flex-1">
          <Text className="text-l font-bold text-gray-600">Deliver Now!</Text>

          <Text className="text-2xl font-bold tracking-wide">
            Current Location
            <ChevronDownIcon size={25} color={"#000"} />
          </Text>
        </View>
        <Pressable onPress={handleLogout}>
          <Ionicons name="exit-outline" size={34} color="black" />
        </Pressable>
      </View>

      <View className="flex flex-row py-4 mx-4 items-center space-x-2">
        <View className="flex-1 flex-row space-x-2 p-2 bg-gray-200">
          <MagnifyingGlassIcon size={20} />
          <TextInput
            placeholder="Search for products..."
            keyboardType="default"
          />
        </View>
        <AdjustmentsHorizontalIcon size={25} />
      </View>

      <ScrollView horizontal={true} className="pb-5">
        {categories.map((category) => {
          return (
            <View
              className="flex items-center space-x-3 p-1"
              key={category.name}
            >
              <Image
                source={require("@/assets/images/grocery.jpeg")}
                style={{ height: 60, width: 60 }}
              />
              <Text className=" text-xs">{category.name}</Text>
            </View>
          );
        })}
      </ScrollView>
      {/* 
        <ScrollView className="p-1 rounded-lg space-y-4 bg-slate-50">
          {shops.map((shop, index) => {
            return (
              <ShopCard
                name={shop.name}
                categories={shop.categories}
                key={index}
                src={shop.src}
              />
            );
          })}
        </ScrollView> */}

      <FlatList
        data={shops}
        renderItem={({ item }) => {
          return (
            <ShopCard
              name={item.name}
              src={item.src}
              categories={item.categories}
            />
          );
        }}
        keyExtractor={(item) => item.num}
        className="p-1"
        contentInset={{ bottom: 200 }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
