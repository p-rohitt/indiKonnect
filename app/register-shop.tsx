import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  Button,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import useAuthStore from "@/stores/authStore";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

const RegisterShop = () => {
  const router = useRouter();
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const { user, token } = useAuthStore();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permissions denied!");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      console.log(result.assets[0]);
      setImage(result.assets[0]);
    }
  };

  const handleRegisterShop = async () => {
   const updatedImage = image.uri.replace("file://","");
    console.log("updated", updatedImage)
    const formData = new FormData();
    formData.append("shopName", shopName);
    formData.append("address", address);
    formData.append("latitude", location.coords.latitude);
    formData.append("longitude", location.coords.longitude);
    formData.append("path",updatedImage);
    formData.append("originalname",image.fileName)
  

    // Convert FormData to JSON
    try {
      console.log("Sending post req");
      console.log(token);
      const response = await fetch(
        "http://localhost:8000/create-shop", {
          method:"POST",
          body:formData,
          headers:{
            authorization: `JWT ${token}`
          }
        }

        // {
        //   shopName,
        //   address,
        //   latitude: location.coords.latitude,
        //   longitude: location.coords.longitude,
        //   file:updatedImage,
        // },
      );

      console.log(response)

      if (response.status === 201) {
        Alert.alert("Congratulations");
        router.replace("/shopKeeperHome");
      } else {
        Alert.alert("Warning");
      }
    } catch (error) {
      console.log("Error registering shop: ", error);
    }
  };

  return (
    <SafeAreaView className="items-center justify-start min-h-screen">
      <ScrollView className=" p-3 mt-10">
        {!image && (
          <Image
            width={300}
            height={300}
            className=""
            source={{
              uri: "https://imgs.search.brave.com/MjpK3YXCDOpApdASsYXDiZIPAjGydnpAjFxM6Dt_ynY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni84NjkvODY5NjM2/LnBuZw",
            }}
          />
        )}

        {image && (
          <Image
            width={300}
            height={300}
            className="rounded-full"
            source={{
              uri: image.uri,
            }}
          />
        )}

        <Text className="font-bold text-3xl tracking-wide mt-2">
          Register your shop.
        </Text>
        <View className="mt-10">
          <Text className="text-xl font-semibold">Shop Name: </Text>
          <TextInput
            placeholder="..."
            className="bg-gray-200 rounded-md h-10 text-xl text-left pl-3"
            onChangeText={(shopName) => setShopName(shopName)}
          />
          <Text className="text-xl font-semibold">Address: </Text>
          <TextInput
            placeholder="..."
            className="bg-gray-200 rounded-md h-10 text-xl text-left pl-3"
            onChangeText={(address) => setAddress(address)}
          />
          <Button title="Pick an image from camera roll" onPress={pickImage} />
        </View>
        <Pressable
          onPress={handleRegisterShop}
          className="bg-green-400 items-center h-10 rounded-lg justify-center"
        >
          <Text className="text-2xl font-bold text-slate-800">
            Register Shop
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterShop;
