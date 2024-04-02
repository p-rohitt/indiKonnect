import {
  View,
  Text,
  Pressable,
  TextInput,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { pendingOrders } from "@/lib/pendingOrders";
import { FlatList } from "react-native";
import axios from "axios";

const ManageOrder = () => {
  const [shopName, setShopName] = useState("Rohit Shop");
  const [address, setAddress] = useState("Bongora, Kamrup");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([
    "Grocery",
    "Household",
    "Beverages",
  ]);
  const router = useRouter();

  const [selectedOrderCategory, setSelectedOrderCategory] =
    useState("completed");
  const [selectedPendingOrder, setSelectedPendingOrder] = useState(null);
  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    router.replace("/");
  };

  const handleAcceptOrder = async () => {
    const response = await axios.put("http://localhost:8000/orders/:orderID", {
      newStatus:"Accepted"
    });

    if(response.status !==200){
                
    }
  }

  const renderOrderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() =>
          selectedPendingOrder === item
            ? setSelectedPendingOrder(null)
            : setSelectedPendingOrder(item)
        }
        style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
        className="w-[100vw] space-y-1"
      >
        <View className="flex-row justify-between items-center">
          <View className="">
            <View className="flex-row space-x-2 items-center">
              <FontAwesome name="user" size={25} color="black" />
              <Text style={{ fontWeight: "bold" }} className="text-2xl">
                {item.cust_name}
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <FontAwesome6 name="location-dot" size={25} color="black" />
              <Text className="text-2xl">{item.cust_address}</Text>
            </View>
          </View>
          <View className="items-center">
            <Text className="text-3xl text-green-400 font-bold">
              ${item.total}
            </Text>
            {selectedPendingOrder !== item ? (
              <ChevronDownIcon size={25} color={"#000"} />
            ) : (
              <ChevronUpIcon size={25} color={"#000"} />
            )}
          </View>
        </View>
        <View
          className={`${
            selectedPendingOrder === item ? "" : "hidden"
          } w-[90vw]  items-center ml-2 `}
        >
          <View className="w-[90vw] rounded-lg items-center bg-amber-50 p-2">
            <Text className="text-lg font-bold">Contents</Text>
          </View>
          <FlatList
            data={item.items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View style={{}} className="bg-amber-50 w-[90vw]">
                <View className=" p-1  mb-1 pr-7 flex-row items-center justify-between">
                  <View className="flex-row space-x-2 items-center">
                    <Image
                      source={{ uri: item.imageUrl }}
                      width={60}
                      height={60}
                      className=""
                    />
                    <Text className="text-xl ">
                      {item.quantity} x {item.name}
                    </Text>
                  </View>
                  <Text className="font-bold text-lg">${item.price}</Text>
                </View>
                <Text></Text>
              </View>
            )}
            contentInsetAdjustmentBehavior="automatic"
          />
          <View className="bg-amber-50 w-[90vw] flex-row justify-between items-center p-1">
            <Text className="text-xl ml-10">Shipping Charges: </Text>
            <Text className="font-bold text-lg pr-7">$10</Text>
          </View>
          <View className="w-[90vw] border-t-2"></View>
          <View className="bg-amber-50 w-[90vw] flex-row justify-between items-center p-1">
            <Text className="text-xl ml-10">Total:</Text>
            <Text className="font-bold text-lg pr-7 border-b-2">
              ${item.total}
            </Text>
          </View>

          <View className="p-4 flex-row w-[90vw] justify-evenly bg-amber-50 rounded-lg">
            <Pressable className="p-2 px-3 bg-green-400 rounded-lg" onPress={handleAcceptOrder}>
              <Text className="font-bold text-lg text-white">Accept</Text>
            </Pressable>
            <Pressable className="p-2 px-4 bg-red-500 rounded-lg">
              <Text className="font-bold text-lg text-white">Deny</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };
  return (
    <SafeAreaView className="items-center text-black  ">
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

      <View className="flex-row w-[100vw] p-4">
        <Pressable
          className={`w-[30vw] h-[5vh] items-center p-2 rounded-lg ${
            selectedOrderCategory === "pending" ? "bg-gray-300" : ""
          }`}
          onPress={() => setSelectedOrderCategory("pending")}
        >
          <Text
            className={`text-lg ${
              selectedOrderCategory !== "pending"
                ? "text-slate-500"
                : "text-black"
            }`}
          >
            Pending
          </Text>
        </Pressable>

        <View className="h-[4vh] ml-1 mt-1 border-l-2 mr-1"></View>

        <Pressable
          className={`w-[30vw]  h-[5vh] items-center p-2 rounded-lg ${
            selectedOrderCategory === "processed" ? "bg-gray-300" : ""
          }`}
          onPress={() => setSelectedOrderCategory("processed")}
        >
          <Text
            className={`text-lg ${
              selectedOrderCategory !== "processed"
                ? "text-slate-500"
                : "text-black"
            }`}
          >
            Processed 
          </Text>
        </Pressable>
        <View className="h-[4vh] ml-1 mt-1 border-l-2 mr-1"></View>
        <Pressable
          className={`w-[30vw] h-[5vh] items-center p-2 rounded-lg ${
            selectedOrderCategory === "completed" ? "bg-gray-300" : ""
          }`}
          onPress={() => setSelectedOrderCategory("completed")}
        >
          <Text
            className={`text-lg ${
              selectedOrderCategory !== "completed"
                ? "text-slate-500"
                : "text-black"
            }`}
          >
            Completed
          </Text>
        </Pressable>
      </View>

      <FlatList style={{}} data={pendingOrders} renderItem={renderOrderItem} />
    </SafeAreaView>
  );
};

export default ManageOrder;
