import { View, Text, SafeAreaView} from 'react-native'
import React from 'react'
import useAuthStore from '@/stores/authStore'
const profile = () => {

  const {user} = useAuthStore();

  return (
    <SafeAreaView className="flex justify-center items-center h-screen">
      <Text>{user.username}</Text>
      <Text>{user.email}</Text>
      <Text>{user.role}</Text>
    </SafeAreaView>
  )
}

export default profile