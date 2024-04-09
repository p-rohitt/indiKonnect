import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import React, {  useState } from "react";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeInLeft,
} from "react-native-reanimated";

import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import axios from "axios";
import useAuthStore from "@/stores/authStore";
import { router } from "expo-router";
const Dish = () => {

  const { token } = useAuthStore();

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [netWeight, setNetWeight] = useState("");
  const [unit, setUnit] = useState("g");
  const [category, setCategory] = useState("Groceries");
  const [quantity, setQuantity] = useState(1);


  const handleProductAdd = async () => {
    const netWeightInNumber = +netWeight;
    const prod = {
      itemName,
      description,
      price,
      netWeight: netWeightInNumber,
      unit,
      category,
      quantity,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/manualUpdate",
        prod,
        {
          headers: {
            authorization: `JWT ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Inventory Updated", "Added new product!");
        router.replace("/shopKeeperHome");
      }
    } catch (err) {
      console.log("Error while adding product: ", err);
    }
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["bottom"]}
    >
      <View style={styles.container} className="items-center mt-10">
        <Animated.Image
          entering={FadeIn.duration(400).delay(200)}
          source={require("@/assets/images/new-product.png")}
          className={"rounded-full"}
        />
        <Animated.Text
          entering={FadeInLeft.duration(400).delay(200)}
          className={"mt-4 text-blue-500 font-semibold text-md"}
        >
          Add product Image
        </Animated.Text>
        <View style={{ padding: 10 }}>
          <TextInput
            className="bg-gray-100 p-2 w-[70vw] h-[5vh] rounded-md"
            value={itemName}
            onChangeText={(text) => setItemName(text)}
            placeholder="Item Name"
          />
          <TextInput
            value={description}
            onChangeText={(text) => setDescription(text)}
            placeholder="Description"
            className="bg-gray-100 p-2 w-[70vw] h-[5vh] rounded-md mt-2"
          />
          <View className="flex-row justify-between">
            <TextInput
              value={netWeight}
              onChangeText={(text) => setNetWeight(text)}
              placeholder="Unit Weight"
              keyboardType="numeric"
              className="w-[40vw] bg-gray-100 p-2 rounded-md mt-2"
            />
            <Picker
              selectedValue={unit}
              onValueChange={(value) => setUnit(value)}
              style={{ height: 50, width: 100 }}
              itemStyle={{ height: 140, marginTop: -40 }}
            >
              <Picker.Item label="g" value="g" />
              <Picker.Item label="kg" value="kg" />
              <Picker.Item label="ml" value="ml" />
              <Picker.Item label="l" value="l" />
              <Picker.Item label="pc" value="pc" />
            </Picker>
          </View>
          <View className="mt-14">
            <Text className="text-lg font-semibold">Quantity: {quantity}</Text>
            <Slider
              value={quantity}
              minimumValue={1}
              maximumValue={100}
              step={1}
              onValueChange={(value) => setQuantity(value)}
            />
          </View>
        </View>

        <View style={{ padding: 0 }} className="items-center">
          <Picker
            selectedValue={category}
            className="bg-black"
            onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
            style={{ height: 50, width: 300 }}
            itemStyle={{ height: 140, marginTop: -30 }}
          >
            <Picker.Item label="Groceries" value="Groceries" />
            <Picker.Item label="Fruits" value="Fruits" />
            <Picker.Item label="Vegetables" value="Vegetables" />
            <Picker.Item label="Dairy" value="Dairy" />
            <Picker.Item label="Bakery" value="Bakery" />
            <Picker.Item label="Meat" value="Meat" />
            <Picker.Item label="Seafood" value="Seafood" />
            <Picker.Item label="Beverages" value="Beverages" />
            <Picker.Item label="Snacks" value="Snacks" />
            <Picker.Item label="Household" value="Household" />
            <Picker.Item label="Personal Care" value="Personal Care" />
            <Picker.Item label="Others" value="Others" />
          </Picker>
        </View>

        <View className="mt-14 w-[70vw]">
          <Text className="text-lg font-semibold">Price: ₹{price}</Text>
          <Slider
            value={price}
            minimumValue={1}
            maximumValue={1000}
            step={1}
            onValueChange={(value) => setPrice(value)}
          />
        </View>

        <TouchableOpacity style={styles.fullButton} onPress={handleProductAdd}>
          <Text className="text-lg tracking-widest">Add to Inventory</Text>
        </TouchableOpacity>

       
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
  },
  dishName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dishInfo: {
    fontSize: 16,
    color: Colors.mediumDark,
  },
  footer: {
    position: "absolute",
    backgroundColor: "#fff",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingTop: 0,
  },
  fullButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: 300,
    marginTop: 30,
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Dish;
