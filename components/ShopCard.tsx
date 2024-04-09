import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { EvilIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

import useShopStore from '@/stores/shopStore';
import Colors from '@/constants/Colors';
interface Props{
    name:string,
    categories:string[],
    src:string,
    distance:string,
    address:string,
    shop:Shop
    itemList:Product[]
}
interface Shop {
  _id:string
  shopName: string;
  ownerName:string
  address: string;
  location: {
      type: string;
      coordinates: number[];
  };
  image: string;
}

interface Variant {
  price: number;
  netWeight: number;
  unit: 'g' | 'kg' | 'l'| 'ml';
  _id:string
}

interface Review {
  rating?: number;
  comment?: string;
}

interface Product {
  _id:string;
  itemName: string;
  description: string;
  variants: Variant[];
  category: 'Groceries' | 'Fruits' | 'Vegetables' | 'Dairy' | 'Bakery' | 'Meat' | 'Seafood' | 'Beverages' | 'Snacks' | 'Household' | 'Personal Care' | 'Others';
  imageUrl?: string;
  reviews?: Review[];
}





const ShopCard = ({name,categories,src,distance,address,shop,itemList}: Props) => {
  
  const router = useRouter();
  const setShop = useShopStore((state) => state.setShop);
  const setItems = useShopStore((state)=>state.setItems);
  const handleShopTap = () => {
    setShop(shop);
    setItems(itemList);
    router.navigate("/shop")

  }
  
  return (
    <Pressable className="p-3 flex justify-center bg-slate-50 mt-4" onPress={handleShopTap} >
      <View>
        <Image source={{
            uri:src
        }} className="h-[20vh] w-[90vw] rounded-xl"/>
        <View className="flex flex-row justify-between">

        <View className="flex justify-between items-start">

        <Text className="text-2xl font-bold tracking-wider">{name}</Text>
        <View className='flex-row items-center justify-start ml-[-4]'>

        <EvilIcons name="location" size={20} color="black" />
        <Text className='font-semibold text-xs'>{address}</Text>
        </View>
        <View className="flex flex-row space-x-2 text-xs">
            {categories?.map((category,index) => {
                return <View className='rounded-3xl mt-1 p-1' key={index} style={{backgroundColor:Colors.primary}}>
                  <Text className=" p-1 px-3 tracking-wide font-semibold text-xs text-white rounded-full">{category}</Text>
                  </View>
            })} 
            </View>
            </View>
            <View className="flex  items-end space-x-1 px-2">
           
            <Text className="text-lg">{distance} m</Text>
            
            </View>
            </View>
      </View>
    </Pressable>
  )
}

export default ShopCard