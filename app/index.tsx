import "core-js/stable/atob";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import useAuthStore from "@/stores/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  UserName: string;
  role: string; // Adjust the type according to your needs
}
export default function LoginScreen() {
  const router = useRouter();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const login = useAuthStore((state) => state.login);
  const setToken = useAuthStore((state) => state.setToken);
  const {user} = useAuthStore();
  // useLayoutEffect(() => {
  //   setUsername("");
  //   setPassword("");
  // }, []);

  useEffect(() => {
    const getTokenandRedirect = async () => {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Token from login page: ", token);
      if (token) {
        try {
          const decodedToken = await jwtDecode(token) as CustomJwtPayload;
          console.log("decodedToken : ", decodedToken);
          setToken(token);
          if (
            decodedToken &&
            decodedToken.role === "Customer"
          ) {
            router.push("/home");
          }
          if (
            decodedToken &&
            decodedToken.role === "Shopkeeper"
          ) {
            router.replace("/shopKeeperHome");
          }
        } catch (error) {
          console.log("err: ", error);
        }
      }
    };
    getTokenandRedirect();
  }, []);

  const onSignInPress = async () => {
    // if (username === "test" && password === "test") {
    //   router.replace("/(tabs)/home");
    // } // dummy auth
    try {
      await login(username, password,()=>{
        console.log(user);
        if(user.role === "Customer"){
          console.log("Redirecting to Home")
          router.replace("/home")
        }
        if(user.role === "Shopkeeper"){
          console.log("Redirecting to Shopkeeper")
          router.replace("/shopKeeperHome")
        }
      });
      
    } catch (error) {
      console.log("err: ", error);
    }
  };

  const onSignUpHerePress = () => {};
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <View className="mb-10">
        <Image
          source={{
            uri: "https://imgs.search.brave.com/XQHEoJk9UFJOBuZdDZpZu01gv383YzDGZfmnNe9WEvc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG40/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvcmVzdGF1cmFu/dC0xMDcvNjQvZGVs/aXZlcnktYmlrZS1z/Y29vdGVyLXJpZGVy/LTUxMi5wbmc",
          }}
          className="h-44 w-44 object-contain bg-transparent"
        />
      </View>
      <View className="mb-14">
        <Text className="text-5xl font-bold text-orange-400">IndiKonnect</Text>
        <Text className="flex justify-center items-center text-center">
          We connect the real India.
        </Text>
      </View>
      <View className="p-2">
        <TextInput
          autoCapitalize="none"
          value={username}
          placeholder="Username..."
          className="bg-gray-200 w-60 p-2 text-center rounded-lg h-12"
          onChangeText={(emailAddress) => setUsername(emailAddress)}
        />
      </View>

      <View>
        <TextInput
          value={password}
          placeholder="Password..."
          secureTextEntry={true}
          className="bg-gray-200 w-60 p-2 text-center rounded-lg h-12"
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <TouchableOpacity
        onPress={onSignInPress}
        className="mt-4 w-60 p-2 text-center bg-orange-400 rounded-lg h-12 items-center justify-center"
      >
        <Text className="text-center font-bold text-xl">Sign in</Text>
      </TouchableOpacity>

      <View className="flex-row space-x-1 mt-2">
        <Text>Not a member yet?</Text>
        <Link href={"/signup"}>
          <Text className="underline font-semibold">Sign up here.</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
