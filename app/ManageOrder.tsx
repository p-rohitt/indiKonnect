import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ViewBase,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Colors from "@/constants/Colors";
import { useSharedValue, withTiming } from "react-native-reanimated";
import useAuthStore from "@/stores/authStore";
import useOrderStore from "@/stores/orderStore";

const ManageOrder = () => {
  const router = useRouter();

  const [selectedOrderCategory, setSelectedOrderCategory] = useState("completed");

  const handleAcceptOrder = async () => {
    const response = await axios.put("http://localhost:8000/orders/:orderID", {
      newStatus: "Accepted",
    });

    if (response.status !== 200) {
    }
  };

 
  const { pendingOrders, processedOrders, completedOrders } = useOrderStore();
console.log("processed",processedOrders)
  

  const renderOrderItem = ({ item, key }) => {
    console.log(item)
    return (
      <Link
        href={{ pathname: "/(modal)/viewOrder", params: { id: item._id } }}
        key={key}
        style={{ padding: 0, borderBottomWidth: 1, borderBottomColor: "#ccc"}}
        className="w-[100vw] space-y-1"
      >
        <View>
          {/* Your order item content */}
          <View className="" >
            <View
            
             className="flex-row justify-between items-center border h-[15vh] w-[90vw] ml-4 rounded-lg overflow-hidden p-3 mb-3  " >
              <View className="space-y-2">
                <View className="flex-row space-x-2 items-center">
                  <FontAwesome name="user" size={25} color="black" />
                  <Text style={{ fontWeight: "bold" }} className="text-md">
                    {item.customerName}
                  </Text>
                </View>
                <View className="flex-row space-x-2 items-center">
                  <FontAwesome6 name="location-dot" size={25} color="black" />
                  <Text className="text-md">{`${item?.address.county},${item?.address.state}`}</Text>
                </View>
              </View>
              <View className="items-center">
                <Text className="text-xl text-green-400 font-bold">
                ₹{item.total.toFixed(2)}
                </Text>
              </View>
            </View>
           
          </View>
        </View>
      </Link>
    );
  };

  const opacity = useSharedValue(0);

  const onScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y > 350) {
      opacity.value = withTiming(1);
    } else {
      opacity.value = withTiming(0);
    }
  };
  return (
    <>
      <ParallaxScrollView
        scrollEvent={onScroll}
        backgroundColor={"#fff"}
        style={{ flex: 1 }}
        parallaxHeaderHeight={250}
        stickyHeaderHeight={100}
        renderBackground={() => (
          <Image
            source={{
              uri: "https://imgs.search.brave.com/BMg1Vlt3UqmJrtkPmOqU75PbKMWj-cl_bpsOf1zmhxg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9nb29k/bW9ja3Vwcy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjEv/MDQvRnJlZS1TdG9y/ZWZyb250LVdpbmRv/dy1TaWduLUZhY2Fk/ZS1Nb2NrdXAtUFNE/LTIuanBn",
            }}
            style={{ height: 300, width: "100%" }}
          />
        )}
        contentBackgroundColor={Colors.lightGrey}
        renderStickyHeader={() => (
          <View key="sticky-header" style={styles.stickySection}>
            <Text style={styles.stickySectionText}>{"Orders"}</Text>
          </View>
        )}
      >
        <View className="items-center text-black  ">
          <View className="flex-row w-[100vw] p-4">
            <Pressable
              className={`w-[30vw] h-[5vh] items-center p-2 rounded-lg ${
                selectedOrderCategory === "pending" ? "border-b-2" : ""
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
                selectedOrderCategory === "processed" ? "border-b-2" : ""
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
                selectedOrderCategory === "completed" ? "border-b-2" : ""
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
        </View>
        {selectedOrderCategory === "pending" && (
          <View className="">
            {pendingOrders.map((order) =>
              renderOrderItem({ item: order, key: order._id }) // Render individual order item with unique key
            )}
          </View>
        )}
        {selectedOrderCategory === "processed" ? (processedOrders.length >0 ? (
          <View>
            {processedOrders.map((order) =>
              renderOrderItem({ item: order, key: order._id }) // Render individual order item with unique key
            )}
          </View>
        ): (
          <View className="items-center justify-center h-[40vh]"><Text className="font-semibold text-3xl">No orders processed!</Text></View>)
        ): selectedOrderCategory === "completed" ? (completedOrders.length>0 ? (<View> {completedOrders.map((order) =>
          renderOrderItem({ item: order, key: order._id }) // Render individual order item with unique key
        )}</View>):(<View className="items-center justify-center h-[40vh]"><Text className="font-semibold text-3xl">No orders completed!</Text></View>)):(<View></View>) }

      </ParallaxScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: Colors.lightGrey,
  },
  stickySection: {
    backgroundColor: "#fff",
    marginLeft: 70,
    height: 100,
    justifyContent: "flex-end",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  stickySectionText: {
    fontSize: 20,
    margin: 10,
  },
  restaurantName: {
    fontSize: 30,
    margin: 16,
  },
  restaurantDescription: {
    fontSize: 16,
    margin: 16,
    lineHeight: 22,
    color: Colors.medium,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 40,
    margin: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: Colors.medium,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
  },
  dishImage: {
    height: 80,
    width: 80,
    borderRadius: 4,
  },
  dish: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dishText: {
    fontSize: 12,
    color: Colors.mediumDark,
    paddingVertical: 4,
  },
});

export default ManageOrder;
