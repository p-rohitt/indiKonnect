import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDishById } from "@/assets/data/restaurant";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInUp,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import useBasketStore from "@/stores/basketStore";
import useShopStore from "@/stores/shopStore";
import { Product } from "@/constants/type";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
const Dish = () => {
  const { id } = useLocalSearchParams();
  console.log(id);
  const router = useRouter();
  const { addProduct } = useBasketStore();

  const { items } = useShopStore();

  const [temp, setTemp] = useState({
    _id: "",
    itemName: "",
    variants: [],
  });

  const [item, setItem] = useState<Product>(null);
  const [selectedVariantId, setSelectedVariantId] = useState(0);
  const [count,setCount] = useState(1);

  useEffect(() => {
    const searchByID = (items, id) => {
      return items.find((item) => item._id === id);
    };

    const searchedItem = searchByID(items, id);
    setItem(searchedItem);
    // setSelectedVariantId(searchedItem.variants[0])
  }, []);
  const addToCart = () => {
    if(count <=0){
      Alert.alert("Invalid quantity","Please choose a valid quantity!");
      return;
    }

    const temp = {
      _id:item._id,
      name:item.itemName,
      quantity:count,
      price:item.variants[selectedVariantId].price,
      variantId:item.variants[selectedVariantId]._id,
      variantWeight:item.variants[selectedVariantId].netWeight,
      variantUnit:item.variants[selectedVariantId].unit

    }

    console.log(temp)

    addProduct(temp);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["bottom"]}
    >
      <View style={styles.container}>
        <Animated.Image
          entering={FadeIn.duration(400).delay(200)}
          source={{ uri: item?.imageUrl }}
          style={styles.image}
        />
        <View style={{ padding: 10 }}>
          <Animated.Text
            entering={FadeInLeft.duration(400).delay(200)}
            style={styles.dishName}
          >
            {item?.itemName}
          </Animated.Text>
          <Animated.Text
            entering={FadeInLeft.duration(400).delay(400)}
            style={styles.dishInfo}
          >
            {item?.description}
          </Animated.Text>
        </View>

        <Animated.Text
            entering={FadeInLeft.duration(400).delay(400)}
            className={"text-lg p-2"}
            style={{color:Colors.mediumDark}}
          >
            Choose your variant:
          </Animated.Text>

        <View style={{ padding: 0 }} className="items-center">
          
          <Picker
            selectedValue={selectedVariantId}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedVariantId(itemValue)
            }
            style={{width:300, height:120}}
            itemStyle={{height:120}}
          >
            {item?.variants.map((variant, index) => {
              return (
                <Picker.Item 
                  key={variant.price}
                  label={`${variant.netWeight} ${variant.unit} ($${variant.price})`}
                  value={index}  
                />
              );
            })}
          </Picker>

         
         
        </View>

        <View className="flex-row justify-between p-1 items-center">
        <Animated.Text
            entering={FadeInLeft.duration(400).delay(400)}
            className={"text-2xl p-2"}
            style={{color:Colors.mediumDark}}
          >
            Quantity: {count}
          </Animated.Text>
          <View className="flex-row space-x-2 p-3">
          <Pressable onPress={()=>setCount((count)=>count-1)} className="bg-red-500">
            <Ionicons name="remove-outline" size={30} color="white" />
            </Pressable>
            <Pressable onPress={()=>setCount((count)=>count+1)} className="bg-green-400">
              <Ionicons name="add" size={30} color={"white"} />
            </Pressable>
            
          </View>

         
        </View>
        <Animated.Text
            entering={FadeInLeft.duration(400).delay(400)}
            className={"text-lg ml-4"}
            style={{color:Colors.mediumDark}}
          >
            Net Weight: {`${item?.variants[selectedVariantId].netWeight * count} ${item?.variants[selectedVariantId].unit}`}
          </Animated.Text>


        <View style={styles.footer}>
          <TouchableOpacity style={styles.fullButton} onPress={addToCart}>
            <Text style={styles.footerText}>
              {count === 0 ? `Add to cart `:`Add for $${item?.variants[selectedVariantId].price * count}`}
              
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
  },
  fullButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Dish;
