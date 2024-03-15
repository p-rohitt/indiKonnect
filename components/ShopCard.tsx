import { View, Text, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

interface Props{
    name:string,
    categories:string[],
    src:string
}

const ShopCard = ({name,categories,src}: Props) => {
  return (
    <View className="p-3 flex justify-center bg-slate-50 mt-4">
      <View>
        <Image source={{
            uri:src
        }} className="h-[20vh] w-[90vw] rounded-xl"/>
        <View className="flex flex-row justify-between">

        <View className="flex justify-between items-start">

        <Text className="text-2xl font-bold mb-2 tracking-wider">{name}</Text>
        <View className="flex flex-row space-x-2 text-xs">
            {categories?.map((category,index) => {
                return <Text className="text-white bg-gray-500 p-1 tracking-wide text-xs" key={index}>{category}</Text>
            })} 
            </View>
            </View>
            <View className="flex flex-row items-center space-x-1 px-2">

            <Text className="text-xl">4.2</Text>
            <Ionicons name='star' size={25}/>
            </View>
            </View>
      </View>
    </View>
  )
}

export default ShopCard