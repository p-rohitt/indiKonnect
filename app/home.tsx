import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  FlatList,
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
import { shops } from "@/lib/shops";
import ShopCard from "@/components/ShopCard";
import * as Location from "expo-location";

const HomeScreen = () => {
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState("");

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);

      /*
       const response =  fetch("/location-route",{
          method:'POST',
          body:JSON.stringify({
            'latitude' : location.latitude,
            'longitude' : location.longitude,
          }),
          headers:{
            'Content-Type':'application/json'
          }
        })
      */
    })();
  
  }, []);

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
        <UserIcon size={30} color={"#000"} />
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
            <Category
              name={category.name}
              src={category.src}
              key={category.name}
            />
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
        contentInset={{ bottom: 200}}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
