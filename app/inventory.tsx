import { View, Text, SafeAreaView, Image, Pressable, Button, TextInput, StyleSheet, SectionList, ListRenderItem } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

import {Link, useRouter} from "expo-router"
import Colors from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import useShopStore from "@/stores/shopStore";
import { TouchableOpacity } from "react-native-gesture-handler";
const inventory = () => {
    const opacity = useSharedValue(0);

    const {shop,items} = useShopStore();
    const setItems = useShopStore((state)=>state.setItems);
    const onScroll = (event: any) => {
        const y = event.nativeEvent.contentOffset.y;
        if (y > 350) {
          opacity.value = withTiming(1);
        } else {
          opacity.value = withTiming(0);
        }
      };
const groupedProducts = groupProductsByCategory(items);

// Convert to desired format
const result = Object.keys(groupedProducts).map((category,index) => ({
    title: category,
    data: groupedProducts[category],
    index:index
}));

const DATA = result

  function groupProductsByCategory(products) {
    const groupedProducts = {};

    products.forEach(product => {
        const category = product.category;
        if (!groupedProducts[category]) {
            groupedProducts[category] = [];
        }
        groupedProducts[category].push(product);
    });

    return groupedProducts;
}


const renderItem: ListRenderItem<any> = ({ item, index }) => (
    <Link href={{ pathname: '(modal)/showProduct', params: { id: item._id } }} asChild>
      <Pressable style={styles.item} className="">
        <View style={{ flex: 1,alignItems:'center' }} className="border p-4">
          <Text style={styles.dish} className="">{item.itemName}</Text>
          <View className="ml-10">

          {item.variants.map((variant,index)=> (<View key={Math.random()} className="p-6 flex-row items-center space-x-2">
            
            <Text className="text-lg">
            {variant.netWeight}{variant.unit} - {variant.quantity}
            </Text>
            </View>
            ))}
            </View>
          {/* <Text  className='font-bold mt-1 text-lg'>${item.variants[0].price}</Text> */}
        </View>
        
      </Pressable>
    </Link>
   )
  return (
    <>
    <ParallaxScrollView
        scrollEvent={onScroll}
        backgroundColor={'#fff'}
        style={{ flex: 1 }}
        parallaxHeaderHeight={250}
        stickyHeaderHeight={100}
        renderBackground={() => <Image source={{uri:"https://imgs.search.brave.com/BMg1Vlt3UqmJrtkPmOqU75PbKMWj-cl_bpsOf1zmhxg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9nb29k/bW9ja3Vwcy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjEv/MDQvRnJlZS1TdG9y/ZWZyb250LVdpbmRv/dy1TaWduLUZhY2Fk/ZS1Nb2NrdXAtUFNE/LTIuanBn"}} style={{ height: 300, width: '100%' }} />}
        contentBackgroundColor={Colors.lightGrey}
        renderStickyHeader={() => (
          <View key="sticky-header" style={styles.stickySection}>
            <Text style={styles.stickySectionText}>{"Inventory"}</Text>
          </View>
        )}>

<View
          className=" h-[14vh] items-center justify-center"
          
        >
          <View className="w-[90vw] items-center  bg-orange-200 p-4 rounded-lg">
            <Text className="text-lg p-1 font-semibold">
              <Text className="text-2xl font-bold mx-1">{items?.length}</Text>{" "}
              items in the inventory!
            </Text>
          </View>
        </View>

            <SectionList
            contentContainerStyle={{ paddingBottom: 150 }}
            keyExtractor={(item, index) => `${Math.random().toString(36).substring(7)}`}
            scrollEnabled={false}
            sections={DATA}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ marginHorizontal: 16, height: 1, backgroundColor: Colors.grey }} />}
            SectionSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.grey }} />}
            renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
            />

      
        </ParallaxScrollView>
    
    
    </>
  )
}
const styles = StyleSheet.create({
    detailsContainer: {
      backgroundColor: Colors.lightGrey,
    },
    stickySection: {
      backgroundColor: '#fff',
      marginLeft: 70,
      height: 100,
      justifyContent: 'flex-end',
    },
    roundButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center'
    },
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    stickySectionText: {
      fontSize: 20,
      margin: 10,
    },
    restaurantName: {
      fontSize: 30,
      margin: 16,
    },
    restaurantDescription: {
      fontSize: 16,
      margin: 16,
      lineHeight: 22,
      color: Colors.medium,
    },
    sectionHeader: {
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 40,
      margin: 16,
      textTransform:"uppercase",
      letterSpacing:1,
      color:Colors.medium
    },
    item: {
      backgroundColor: '#fff',
      padding: 16,
      flexDirection: 'row',
    },
    dishImage: {
      height: 80,
      width: 80,
      borderRadius: 4,
    },
    dish: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    dishText: {
      fontSize: 12,
      color: Colors.mediumDark,
      paddingVertical: 4,
    },
    stickySegments: {
      position: 'absolute',
      height: 50,
      left: 0,
      right: 0,
      top: 100,
      backgroundColor: '#fff',
      overflow: 'hidden',
      paddingBottom: 4,
    },
    segmentsShadow: {
      backgroundColor: '#fff',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      width: '100%',
      height: '100%',
    },
    segmentButton: {
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderRadius: 50,
    },
    segmentText: {
      color: Colors.primary,
      fontSize: 16,
    },
    segmentButtonActive: {
      backgroundColor: Colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderRadius: 50,
    },
    segmentTextActive: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    segmentScrollview: {
      paddingHorizontal: 16,
      alignItems: 'center',
      gap: 20,
      paddingBottom: 4,
    },
    footer: {
      position: 'absolute',
      backgroundColor: '#fff',
      bottom: 0,
      left: 0,
      width: '100%',
      padding: 10,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -10 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      paddingTop: 20,
    },
    fullButton: {
      backgroundColor: Colors.primary,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
      height: 50,
    },
    footerText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    basket: {
      color: '#fff',
      backgroundColor: '#19AA86',
      fontWeight: 'bold',
      padding: 8,
      borderRadius: 2,
    },
    basketTotal: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
export default inventory