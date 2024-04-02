import { View, Text, Image } from 'react-native'
import React from 'react'

interface Props{
    name:string,
    src:string
}
const Category = ({name, src}:Props) => {
  return (
    <View className="flex items-center space-x-3 bg-white p-1">
      <Image source = {{
        uri:src
      }} style={{height:50,width:60}}/>
      <Text className=" text-xs">{name}</Text>
    </View>
  )
}

export default Category