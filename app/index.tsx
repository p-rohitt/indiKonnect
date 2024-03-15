import { Link, useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  useLayoutEffect(() => {
    setEmailAddress("");
    setPassword("");
  }, []);

  const onSignInPress = async () => {
    if (emailAddress === "test" && password === "test") {
      router.push("/home");
    }

    // const response = fetch("", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     emailAddress: emailAddress,
    //     password: password,
    //   }),
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    // });

    //if response.statusCode === 200 {
    // router.push("/home")
    // else display error.
    }
  

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
          value={emailAddress}
          placeholder="Email..."
          className="bg-gray-200 w-60 p-2 text-center rounded-lg h-12"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
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