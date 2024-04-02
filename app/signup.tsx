import * as React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import { SelectList } from "react-native-dropdown-select-list";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "expo-router";
export default function SignUpScreen() {
  const router = useRouter();
  const [username,setUsername] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("");
  const [roleID, setRoleID] = React.useState("1");
  // const roles = [
  //   { key: "1", value: "Customer" },
  //   { key: "2", value: "Shopkeeper" },
  // ];

  const radioButtons: RadioButtonProps[] = React.useMemo(() => ([
    {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Customer',
        value: 'Customer'
    },
    {
        id: '2',
        label: 'Shopkeeper',
        value: 'Shopkeeper'
    }
]), []);
  const signup = useAuthStore((state) => state.signup);
  // start the sign up process.
  const onSignUpPress = async () => {
    const user = {
      username, emailAddress, password, role
    }

    console.log(user);

    signup(username,emailAddress,password,role, ()=> {
      if(role=== "Customer"){
        router.replace("/home")
      }
      else{
        router.replace('/register-shop');
      }
    })
  };

  React.useEffect(()=>{
      roleID ==="1" ? setRole("Customer") : setRole("Shopkeeper");
  },[roleID])
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
      <View className="mb-10">
        <Text className="text-4xl font-bold text-orange-400">Join today.</Text>
      </View>

      <View className="flex space-y-2">
        <View>
          <TextInput
            autoCapitalize="none"
            value={username}
            placeholder="Username"
            onChangeText={(email) => setUsername(email)}
            className="bg-gray-200 w-60 p-2 text-center rounded-lg h-12"
          />
        </View>
        <View>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(email) => setEmailAddress(email)}
            className="bg-gray-200 w-60 p-2 text-center rounded-lg h-12"
          />
        </View>

        <View>
          <TextInput
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            className="bg-gray-200 w-60 p-2 text-center rounded-lg h-12"
          />
        </View>
        <View className="mt-2 flex flex-row mb-2">
          {/* <SelectList
            data={roles}
            save="value"
            setSelected={(role: React.SetStateAction<string>) => setRole(role)}
            search={false}
            defaultOption={{ key: "1", value: "Customer" }}
            boxStyles={{
              backgroundColor: "#e5e7eb",
              borderColor: "#fff",
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
            inputStyles={{ textAlign: "center", textAlignVertical: "center" }}
          /> */}

            <RadioGroup 
            radioButtons={radioButtons} 
            onPress={setRoleID}
            selectedId={roleID}
            layout="row"
            
        />
        </View>

        <TouchableOpacity
          onPress={onSignUpPress}
          className="mt-4 w-60 p-2 text-center bg-orange-400 rounded-lg h-12 items-center justify-center"
        >
          <Text className="text-center font-bold text-xl">Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
