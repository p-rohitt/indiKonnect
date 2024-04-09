import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  Button,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

import { useRouter } from "expo-router";
import useAuthStore from "@/stores/authStore";
import Colors from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import axios from "axios";
import useShopStore from "@/stores/shopStore";
import useOrderStore from "@/stores/orderStore";

const ANGLE = 3;
const TIME = 100;
const EASING = Easing.elastic(1.5);
const shopKeeperHome = () => {
  const router = useRouter();
  const [shopName, setShopName] = useState("Rohit Shop");
  const [address, setAddress] = useState("Bongora, Kamrup");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([
    "Grocery",
    "Household",
    "Beverages",
  ]);
  const opacity = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const { token } = useAuthStore();
  const { shop } = useShopStore();
  const setShop = useShopStore((state) => state.setShop);
  const setToken = useAuthStore((state) => state.setToken);
  const setItems = useShopStore((state) => state.setItems);
  const logout = useAuthStore((state) => state.logout);
  const { isAuthenticated } = useAuthStore();
  const handleSignout = async () => {
    await AsyncStorage.removeItem("authToken");
    router.replace("/");
  };

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  const setPendingOrders = useOrderStore((state) => state.setPendingOrders);
  const setProcessedOrders = useOrderStore((state) => state.setProcessedOrders);
  const setCompletedOrders = useOrderStore((state) => state.setCompletedOrders);
  const {pendingOrders} = useOrderStore();

  useEffect(() => {
    const getPendingOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/allOrderShopkeeper",
          {
            headers: {
              authorization: `JWT ${token}`,
            },
          }
        );
        console.log(response.data);

        if (response.status === 200) {
          setPendingOrders(response.data.pending)
          setProcessedOrders(response.data.processing)
          setCompletedOrders(response.data.completed);
        }
      } catch (err) {
        console.log("ERror fetching pending orders : ", err);
      }
    };


    getPendingOrders();
  }, []);

  useEffect(() => {
    const getShopData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/fetchShopData",
          {
            headers: {
              authorization: `JWT ${token}`,
            },
          }
        );

        console.log(response.data);
        setItems(response.data.shopItems);
        setShop(response.data.shop);
      } catch (err) {
        console.log("Error fetching shop details: ", err);
        router.replace("/register-shop");
      }
    };

    getShopData();
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
    await logout();
    setShop(null);
    router.replace("/");
  };

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
            <Text style={styles.stickySectionText}>{shop?.shopName}</Text>
          </View>
        )}
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.restaurantName}>{shop?.shopName}</Text>
          <Text className="ml-4 text-gray-600">Address: {shop?.address}</Text>
          <Text></Text>
        </View>

        <Animated.View
          className=" h-[14vh] items-center justify-center"
          style={animatedStyle}
        >
          <View className="w-[90vw] items-center  bg-orange-200 p-4 rounded-lg">
            <Text className="text-lg p-1 font-semibold">
              You have <Text className="text-2xl font-bold mx-1">{pendingOrders?.length}</Text>{" "}
              pending orders!
            </Text>
          </View>
        </Animated.View>

        <View>
          <Pressable
            style={styles.item}
            onPress={() => router.push("/inventory")}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.dish}>{"Show Inventory"}</Text>
              <Text style={styles.dishText}>
                {"See, add and delete products"}
              </Text>
              <Text className="font-bold mt-1 text-lg"></Text>
            </View>
            <MaterialIcons name="inventory" size={60} color="black" />
          </Pressable>
        </View>

        <View>
          <Pressable style={styles.item} onPress={()=>router.push("/ManageOrder")}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dish}>{"Manage Orders"}</Text>
              <Text style={styles.dishText}>
                {"See, add and delete products"}
              </Text>
              <Text className="font-bold mt-1 text-lg"></Text>
            </View>
            <Ionicons name="basket-sharp" size={60} color="black" />
          </Pressable>
        </View>
        <View>
          <Pressable
            style={styles.item}
            onPress={() => router.push("/(modal)/addProduct")}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.dish}>{"Add Product"}</Text>
              <Text style={styles.dishText}>{"Add a new product"}</Text>
              <Text className="font-bold mt-1 text-lg"></Text>
            </View>
            <Fontisto name="shopping-basket-add" size={50} color="black" />
          </Pressable>
        </View>
        <View>
          <Pressable style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dish}>{"Update Details"}</Text>
              <Text style={styles.dishText}>{"Add a new product"}</Text>
              <Text className="font-bold mt-1 text-lg"></Text>
            </View>
            <MaterialCommunityIcons
              name="account-details"
              size={50}
              color="black"
            />
          </Pressable>
        </View>

        <Pressable
          className="items-center mt-10 p-4 bg-red-500 w-[50vw] mx-auto rounded-md"
          onPress={handleLogout}
        >
          <Text className="text-white font-bold">Logout</Text>
        </Pressable>
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
  stickySegments: {
    position: "absolute",
    height: 50,
    left: 0,
    right: 0,
    top: 100,
    backgroundColor: "#fff",
    overflow: "hidden",
    paddingBottom: 4,
  },
  segmentsShadow: {
    backgroundColor: "#fff",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: "100%",
  },
  segmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 50,
  },
  segmentText: {
    color: Colors.primary,
    fontSize: 16,
  },
  segmentButtonActive: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 50,
  },
  segmentTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  segmentScrollview: {
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 20,
    paddingBottom: 4,
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
  },
  fullButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    height: 50,
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  basket: {
    color: "#fff",
    backgroundColor: "#19AA86",
    fontWeight: "bold",
    padding: 8,
    borderRadius: 2,
  },
  basketTotal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
export default shopKeeperHome;
