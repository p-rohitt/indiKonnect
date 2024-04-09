import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInLeft,
} from "react-native-reanimated";
import useOrderStore from "@/stores/orderStore";
import axios from "axios";
import useAuthStore from "@/stores/authStore";
const Dish = () => {
  const { id } = useLocalSearchParams();
  console.log(id);
  const router = useRouter();
  const { pendingOrders } = useOrderStore();
  const acceptOrder = useOrderStore((state) => state.acceptOrder);

  const [order, setOrder] = useState(null);
  const {token} = useAuthStore();

  useEffect(() => {
    const searchByID = (pendingOrders, id) => {
      return pendingOrders.find((item) => item._id === id);
    };

    const searchedItem = searchByID(pendingOrders, id);

    console.log(searchedItem);
    setOrder(searchedItem);
  }, []);

  console.log(pendingOrders)

  const renderProduct = ({ item, key }) => (
    <View
      key={key}
      className="p-4 border w-[80vw] mx-auto rounded-lg z-3 h-[10vh] mb-2"
    >
      <View className="flex-row justify-between">
        <View>
          <Text className="text-lg font-semibold">{`${item.quantity} X Milk`}</Text>
          <View>
            <Text>{`Variant: ${item.variantId}`}</Text>
          </View>
        </View>
        <View className="h-[4vh] items-center justify-center">
          <Text className="text-lg">{`₹${(item.price * item.quantity).toFixed(2)}`}</Text>
        </View>
      </View>
    </View>
  );

  const acceptOrderRequest = async () => {
    if (order != null) {
      console.log("accepting order");

      try{
        const response = await axios.post("http://localhost:8000/processOrder",{
            status:"accept",
            orderId:order._id
        },{
            headers:{
                authorization:`JWT ${token}`
            }
        })

        if(response.status!==200){
            console.log("Cannot accept order")
            Alert.alert("Cannot accept order!","Server refused!");
            return;
        }
    }
    catch(err){
        console.log("Error accepting order 1",err);
    }

      try {
        acceptOrder(order);
      } catch (err) {
        console.log("Error accepting order", err);
      }

      router.back();
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#ddd" }}
      edges={["bottom"]}
    >
      <View
        style={styles.container}
        className="mt-10 border w-[90vw] mx-auto rounded-lg"
      >
        <View style={{ padding: 10 }}>
          <Animated.Text
            entering={FadeInLeft.duration(400).delay(200)}
            style={styles.dishInfo}
          >
            {`ID : ${order?._id}`}
          </Animated.Text>
          <Animated.Text
            entering={FadeInLeft.duration(400).delay(400)}
            style={styles.dishInfo}
          >
            {`Username: ${order?.customerName}`}
          </Animated.Text>
          <View className="mt-10">
            <Text className="font-bold text-lg">Location</Text>
          </View>
          <Animated.Text
            entering={FadeInLeft.duration(400).delay(400)}
            style={styles.dishInfo}
          >
            {`${order?.address.county}, ${order?.address.state_district}`}
          </Animated.Text>
          <Animated.Text
            entering={FadeInLeft.duration(400).delay(400)}
            style={styles.dishInfo}
          >
            {`${order?.address.state}, ${order?.address.country}`}
          </Animated.Text>
          <View className="mt-1">
            <Text className="text-blue-400 font-semibold">View on map</Text>
          </View>

          <View className="mt-5">
            <Text className="font-bold text-lg">Contents</Text>
          </View>
        </View>

        <View>
          {order?.items.map((item) =>
            renderProduct({ item, key: item._id }) // Render individual product item with unique key
          )}
        </View>
        <View className=" w-[80vw] mx-auto p-4 mt-1 justify-between items-center flex-row">
          <Text className="font-semibold text-lg">Service Fee</Text>
          <Text className="text-lg ">₹3</Text>
        </View>
        <View className=" w-[80vw] mx-auto px-4 py-2 justify-between items-center flex-row border-b-2">
          <Text className="font-semibold text-lg">Delivery Fee</Text>
          <Text className="text-lg ">₹10</Text>
        </View>
        <View className=" w-[80vw] mx-auto px-4 py-2 justify-between items-center flex-row">
          <Text className="font-semibold text-lg">Total</Text>
          <Text className="text-lg ">{order?.total + 13}</Text>
        </View>
        <View className="flex-row justify-between p-1 items-center"></View>
        <Animated.Text
          entering={FadeInLeft.duration(400).delay(400)}
          className={"text-lg ml-4"}
          style={{ color: Colors.mediumDark }}
        >
          {/* Net Weight: {`${item?.variants[selectedVariantId].netWeight * count} ${item?.variants[selectedVariantId].unit}`} */}
        </Animated.Text>

        <View style={styles.footer}>
          <TouchableOpacity
            className="w-[45%] bg-green-400 p-4 items-center rounded-lg"
            onPress={acceptOrderRequest}
          >
            <Text style={styles.footerText}>
              {/* {count === 0 ? `Add to cart `:`Add for ₹${item?.variants[selectedVariantId].price * count}`} */}
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 w-[45%] p-4 items-center rounded-lg"
            onPress={acceptOrderRequest}
          >
            <Text style={styles.footerText}>
              {/* {count === 0 ? `Add to cart `:`Add for ₹${item?.variants[selectedVariantId].price * count}`} */}
              Deny
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fullButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    width: 150,
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Dish;
