import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import useBasketStore from "@/stores/basketStore";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import ConfettiCannon from "react-native-confetti-cannon";
import { Link } from "expo-router";
import SwipeableRow from "@/components/SwipeableRow";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";
import useAuthStore from "@/stores/authStore";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { Ionicons } from "@expo/vector-icons";
import {useStripe} from "@stripe/stripe-react-native"
const cart = () => {
  const {
    products,
    total,
    clearCart,
    reduceProduct,
    cartId,
    location,
    addProduct,
  } = useBasketStore();
  const [order, setOrder] = useState(false);
  const { token } = useAuthStore();

  const FEES = {
    service: 2.99,
    delivery: 10,
  };

  useEffect(() => {
    setOrder(false);
  }, []);

  const {initPaymentSheet,presentPaymentSheet} = useStripe()

  const startCheckout = async () => {


    try{
      const response = await axios.post("http://localhost:8000/payment/intents",{
       total:Math.floor(total*100)
      },{
        headers:{
          authorization:`JWT ${token}`
        }
      })

      if(response.status >=400){
        Alert.alert("Something went wrong!","Failed payment processing")
        return
      }

      const initResponse = await initPaymentSheet({
        merchantDisplayName:"indiKonnect",
        paymentIntentClientSecret:response.data.paymentIntent,
          returnURL:"http://localhost:8000/cart"
      })

      if(initResponse.error){
        console.log(initResponse.error)
        Alert.alert("Something went wrong")
        return
      }

      await presentPaymentSheet();




    }catch(err){
      Alert.alert("Something went wrong!",err.message)
      return
    }



    const items = products.map((product) => {
      return {
        itemId: product._id,
        price: product.price,
        quantity: product.quantity,
      };
    });
    const orderStruct = {
      shopId: cartId,
      items,
      location: {
        coordinates: [location.longitude, location.latitude],
      },
    };

    console.log(orderStruct);
    console.log(token);
    try {
      const response = await axios.post(
        "http://localhost:8000/createOrder",
        orderStruct,
        {
          headers: {
            authorization: `JWT ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status !== 201) {
        Alert.alert("Order failed", "Retry placing your order!");
      }
    } catch (err) {
      console.log("Error placing order", err);
      return;
    }

    setOrder(true);

    clearCart();
  };

  console.log(products);
  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        {order && (
          <ConfettiCannon
            count={200}
            origin={{ x: -10, y: 0 }}
            fallSpeed={2500}
            fadeOut={true}
            autoStart={true}
          />
        )}
        {order && (
          <View style={{ marginTop: "50%", padding: 20, alignItems: "center" }}>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}
            >
              Thank you for your order!
            </Text>
            <Link href={"/home"} asChild>
              <TouchableOpacity style={styles.orderBtn}>
                <Text style={styles.footerText}>New order</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
        {!order && (
          <>
            <FlatList
              style={{ height: 700 }}
              data={products}
              ListHeaderComponent={
                <View className="flex-row justify-between">
                  <Text style={styles.section}>Items</Text>
                  <TouchableOpacity
                    className="mt-5 px-5"
                    onPress={() => clearCart()}
                  >
                    <Text>Clear Cart</Text>
                  </TouchableOpacity>
                </View>
              }
              ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: Colors.grey }} />
              )}
              renderItem={({ item }) => (
                <View>
                  <View style={styles.row}>
                    <Text
                      style={{ color: Colors.primary, fontSize: 18 }}
                    >{`${item.quantity}x`}</Text>
                    <Text
                      style={{ flex: 1, fontSize: 18 }}
                    >{`${item.name} (${item.variantWeight}${item.variantUnit})`}</Text>
                    <View className="flex-row space-x-1 items-center">
                      <TouchableOpacity
                        onPress={() => {
                          reduceProduct(item);
                        }}
                      >
                        <Ionicons
                          name="remove-outline"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          addProduct({ ...item, quantity: 1 });
                        }}
                      >
                        <Ionicons name="add" size={24} color={"black"} />
                      </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 18 }}>
                      ₹{item.price * item.quantity}
                    </Text>
                  </View>
                  <View className="bg-white"></View>
                </View>
              )}
              ListFooterComponent={
                <View>
                  <View
                    style={{ height: 1, backgroundColor: Colors.grey }}
                  ></View>
                  <View style={styles.totalRow}>
                    <Text style={styles.total}>Subtotal</Text>
                    <Text style={{ fontSize: 18 }}>₹{total}</Text>
                  </View>

                  <View style={styles.totalRow}>
                    <Text style={styles.total}>Service fee</Text>
                    <Text style={{ fontSize: 18 }}>₹{FEES.service}</Text>
                  </View>

                  <View style={styles.totalRow}>
                    <Text style={styles.total}>Delivery fee</Text>
                    <Text style={{ fontSize: 18 }}>₹{FEES.delivery}</Text>
                  </View>

                  <View style={styles.totalRow}>
                    <Text style={styles.total}>Order Total</Text>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      ₹{(total + FEES.service + FEES.delivery).toFixed(2)}
                    </Text>
                  </View>
                </View>
              }
            />

            <View style={styles.footer}>
              <SafeAreaView
                edges={["bottom"]}
                style={{ backgroundColor: "#fff" }}
              >
                <TouchableOpacity
                  style={styles.fullButton}
                  onPress={startCheckout}
                >
                  <Text style={styles.footerText}>Order now</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </View>
          </>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    gap: 20,
    alignItems: "center",
  },
  section: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
  },
  total: {
    fontSize: 18,
    color: Colors.medium,
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
    justifyContent: "center",
    flex: 1,
    height: 50,
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  orderBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    width: 250,
    height: 50,
    justifyContent: "center",
    marginTop: 20,
  },
});

export default cart;
