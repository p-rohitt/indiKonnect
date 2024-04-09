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
import React, { useEffect} from "react";
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { categories } from "@/assets/data/home3";
import { Ionicons } from "@expo/vector-icons";
import ShopCard from "@/components/ShopCard";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "expo-router";
import useBasketStore from "@/stores/basketStore";
import useShopStore from "@/stores/shopStore";

interface Shop {
  __id: string;
  shopName: string;
  ownerName: string;
  address: string;
  location: {
    type: string;
    coordinates: number[];
  };
  image?: Buffer;
}
const HomeScreen = () => {
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [token, setToken] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [products, setProducts] = React.useState([]);
  const [shops, setShops] = React.useState([]);
  const router = useRouter();
  const setDeliveryLocation = useBasketStore(
    (state) => state.setDeliveryLocation
  );
  const logout = useAuthStore((state) => state.logout);
  const { isAuthenticated } = useAuthStore();
  const setShop = useShopStore((state) => state.setShop);
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }

    console.log(token);
    const getToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        console.log("Token found");
      } else {
        console.log("Token not found");
      }
      setToken(token);
    };

    getToken();
    console.log(token);
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);

      setDeliveryLocation(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  useEffect(() => {
    const getShops = async () => {
      console.log("SEnding post req");

      try {
        const response = await axios.post(
          "http://localhost:8000/shopsNearBy",
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `JWT ${token}`,
            },
          }
        );
        console.log(response.data.nearbyShops);

        setShops(response.data.nearbyShops);
        console.log(response.data.nearbyShops[0].itemList);
      } catch (err) {
        console.log("err:", err);
      }
    };

    getShops();
  }, [location]);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    try {
      console.log("Searching for ", text);
      const response = await fetch("http://localhost:8000/searchProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `JWT ${token}`,
        },
        body: JSON.stringify({ itemName: text }),
      });
      const data = await response.json();
      console.log(response);
      if (data.products) {
        setProducts(data.products);
      }
      console.log(products);
    } catch (error) {
      console.error("Error searching product:", error);
    }
  };

  const handleProductTap = (_id: string) => {
    const temp = shops.find((shop) => {
      return shop.itemList.find((item) => item._id === _id);
    });
    setShop(temp.shop);
    router.push("/shop");
    // console.log("shop detials: ",temp)
  };

  const renderItem = ({ item }) => (
    <Pressable
      className="flex-row items-center space-x-2"
      onPress={() => handleProductTap(item._id)}
    >
      <Image source={{ uri: item.imageUrl }} width={35} height={35} />
      <View>
        <Text className="font-bold text-lg">{item.itemName}</Text>
        <Text className="text-xs">{item.description}</Text>
      </View>
    </Pressable>
  );


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
          </Text>
        </View>
        <Pressable onPress={handleLogout}>
          <Ionicons name="exit-outline" size={34} color="black" />
        </Pressable>
      </View>

      <View className="flex flex-row py-4 mx-4 items-center space-x-2 border-b-1">
        <View className="flex-1 flex-row space-x-2 p-2 bg-gray-200">
          <MagnifyingGlassIcon size={20} />
          <TextInput
            placeholder="Search for products..."
            keyboardType="default"
            value={searchQuery}
            onChangeText={(text) => handleSearch(text)}
          />
        </View>
        <AdjustmentsHorizontalIcon size={25} />
      </View>
      {products.length > 0 && searchQuery.length > 0 && (
        <View className=" mt-[-15] bg-gray-50 py-4 mx-4 p-4 items-start space-x-2 w-[83.5vw]">
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item, index) => index + "a"} // Adjust this according to your product data structure
          />
        </View>
      )}

      <ScrollView horizontal={true} className="">
        {categories.map((category) => {
          return (
            <View
              className="flex items-center space-x-3 p-1 justify-center"
              key={category.text}
            >
              <Image source={category.img} style={{ height: 30, width: 30 }} />
              <Text className=" mt-2 text-xs tracking-widest ">
                {category.text}
              </Text>
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
              key={item.shop.owner}
              name={item.shop.shopName}
              src={item.shop.image}
              address={item.shop.address}
              categories={item.topCategories}
              distance={item.distance}
              shop={item.shop}
              itemList={item.itemList}
            />
          );
        }}
        keyExtractor={(item) => item.shop.owner}
        className="p-1"
        contentInset={{ bottom: 200 }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
