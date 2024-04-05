import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, SectionList, ListRenderItem, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import axios from 'axios';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { Link, useNavigation } from 'expo-router';
import useShopStore from '@/stores/shopStore';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import useBasketStore from '@/stores/basketStore';

interface Shop {
    __id:string
    shopName: string;
    ownerName:string
    address: string;
    location: {
        type: string;
        coordinates: number[];
    };
    image: string;
}



interface Props{
  shopID:string
}

const Shop = () => {
  const navigation = useNavigation()
 const {shop,items} = useShopStore()
 const [activeIndex, setActiveIndex] = useState(0);

 const opacity = useSharedValue(0);
 const animatedStyles = useAnimatedStyle(() => ({
   opacity: opacity.value,
 }));

 const scrollRef = useRef<ScrollView>(null);
 const itemsRef = useRef<TouchableOpacity[]>([]);

 const food = [
  {
    category: 'Meal Deals',
    meals: [
      {
        id: 1,
        name: 'Pasta Power ✊',
        price: 17,
        info: 'Includes one garlic bread, one pasta and one soft drink.',
        img: require('@/assets/data/1.png'),
      },
      {
        id: 2,
        name: 'Vegetariano 💚',
        price: 17,
        info: 'Includes one garlic bread, one vegetarian pasta and one soft drink',
        img: require('@/assets/data/2.png'),
      },
      {
        id: 3,
        name: 'Vaps Date 💕',
        price: 40,
        info: 'Includes one garlic bread with or without cheese, choice of two pizzas, one bottle of wine or four bottles of Moretti',
        img: require('@/assets/data/3.png'),
      },
      {
        id: 4,
        name: "Livin' your best life 😎",
        price: 80,
        info: 'Includes two garlic breads with or without cheese, four pizzas, two bottles of wine or eight bottles of beer or a mix of both',
        img: require('@/assets/data/4.png'),
      },
    ],
  },
  {
    category: 'Pasta',
    meals: [
      {
        id: 5,
        name: 'Arrabbiata',
        price: 9.35,
        info: 'Tomato sauce, chilli, garlic, and onions',
        img: require('@/assets/data/5.png'),
      },
      {
        id: 6,
        name: 'Pomodoro e Mozzarella',
        price: 10.75,
        info: 'Tomato sauce, onions, mozzarella',
        img: require('@/assets/data/6.png'),
      },
    ],
  },
  {
    category: 'Pizza',
    meals: [
      {
        id: 7,
        name: 'Salame',
        price: 11.35,
        info: 'Spicy Italian sausage, tomato sauce, mozzarella',
        img: require('@/assets/data/7.png'),
      },
      {
        id: 8,
        name: 'Margherity',
        price: 9.75,
        info: 'Tomato sauce, mozzarella',
        img: require('@/assets/data/8.png'),
      },
    ],
  },
  {
    category: 'Salad',
    meals: [
      {
        id: 9,
        name: 'Insalata Mista Piccola',
        price: 5.99,
        info: 'Mixed leaf salad, cherry tomatoes and grated carrot. There can be no swaps, if you would like to add any extras please customise below.',
        img: require('@/assets/data/9.png'),
      },
      {
        id: 10,
        name: 'Insalata Mista della Casa',
        price: 8.95,
        info: 'Large mixed salad. There can be no swaps, if you would like to add any extras please customise below.',
        img: require('@/assets/data/10.png'),
      },
    ],
  },
  {
    category: 'Meal Deals',
    meals: [
      {
        id: 1,
        name: 'Pasta Power ✊',
        price: 17,
        info: 'Includes one garlic bread, one pasta and one soft drink.',
        img: require('@/assets/data/1.png'),
      },
      {
        id: 2,
        name: 'Vegetariano 💚',
        price: 17,
        info: 'Includes one garlic bread, one vegetarian pasta and one soft drink',
        img: require('@/assets/data/2.png'),
      },
      {
        id: 3,
        name: 'Vaps Date 💕',
        price: 40,
        info: 'Includes one garlic bread with or without cheese, choice of two pizzas, one bottle of wine or four bottles of Moretti',
        img: require('@/assets/data/3.png'),
      },
      {
        id: 4,
        name: "Livin' your best life 😎",
        price: 80,
        info: 'Includes two garlic breads with or without cheese, four pizzas, two bottles of wine or eight bottles of beer or a mix of both',
        img: require('@/assets/data/4.png'),
      },
    ],
  },
  {
    category: 'Pasta',
    meals: [
      {
        id: 5,
        name: 'Arrabbiata',
        price: 9.35,
        info: 'Tomato sauce, chilli, garlic, and onions',
        img: require('@/assets/data/5.png'),
      },
      {
        id: 6,
        name: 'Pomodoro e Mozzarella',
        price: 10.75,
        info: 'Tomato sauce, onions, mozzarella',
        img: require('@/assets/data/6.png'),
      },
    ],
  },
  {
    category: 'Pizza',
    meals: [
      {
        id: 7,
        name: 'Salame',
        price: 11.35,
        info: 'Spicy Italian sausage, tomato sauce, mozzarella',
        img: require('@/assets/data/7.png'),
      },
      {
        id: 8,
        name: 'Margherity',
        price: 9.75,
        info: 'Tomato sauce, mozzarella',
        img: require('@/assets/data/8.png'),
      },
    ],
  },
  {
    category: 'Salad',
    meals: [
      {
        id: 9,
        name: 'Insalata Mista Piccola',
        price: 5.99,
        info: 'Mixed leaf salad, cherry tomatoes and grated carrot. There can be no swaps, if you would like to add any extras please customise below.',
        img: require('@/assets/data/9.png'),
      },
      {
        id: 10,
        name: 'Insalata Mista della Casa',
        price: 8.95,
        info: 'Large mixed salad. There can be no swaps, if you would like to add any extras please customise below.',
        img: require('@/assets/data/10.png'),
      },
    ],
  }
  ]

  // Group products by category
const groupedProducts = groupProductsByCategory(items);

// Convert to desired format
const result = Object.keys(groupedProducts).map(category => ({
    title: category,
    data: groupedProducts[category]
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

  console.log(items)
 const renderItem: ListRenderItem<any> = ({ item, index }) => (
  <Link href={{ pathname: '(modal)/product', params: { id: item._id } }} asChild>
    <TouchableOpacity style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.dish}>{item.itemName}</Text>
        <Text style={styles.dishText}>{item.description}</Text>
        {/* <Text  className='font-bold mt-1 text-lg'>${item.variants[0].price}</Text> */}
      </View>
      <Image source={{uri:"https://imgs.search.brave.com/mf55zz_cIg4ea6vobp15uD6S0vcWGQw0oTM83LghSMk/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM2/NTA5OTg2OS9waG90/by9zaXgtYXBwbGVz/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1LeDlqTnZFRVQ1/RVJyN29ITkZNeHJv/VGM1NEsxTmdrN1Ix/Qlc5SUNYMlBVPQ"}} style={styles.dishImage} />
    </TouchableOpacity>
  </Link>
 )

 useLayoutEffect(() => {
  navigation.setOptions({
    headerTransparent: true,
    headerTitle: '',
    headerTintColor: Colors.primary,
    headerLeft: () => (
      <TouchableOpacity className="ml-2" onPress={() => navigation.goBack()} style={styles.roundButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <View style={styles.bar} className='p-2'>
        <TouchableOpacity style={styles.roundButton}>
          <Ionicons name="share-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.roundButton}>
          <Ionicons name="search-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    ),
  });
}, []);

const onScroll = (event: any) => {
  const y = event.nativeEvent.contentOffset.y;
  if (y > 350) {
    opacity.value = withTiming(1);
  } else {
    opacity.value = withTiming(0);
  }
};

const selectCategory = (index: number) => {
  const selected = itemsRef.current[index];
  setActiveIndex(index);

  selected.measure((x) => {
    scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
  });
};

const {num,total} = useBasketStore()
  return (
    <>
     <ParallaxScrollView
        scrollEvent={onScroll}
        backgroundColor={'#fff'}
        style={{ flex: 1 }}
        parallaxHeaderHeight={250}
        stickyHeaderHeight={100}
        renderBackground={() => <Image source={{uri:shop.image}} style={{ height: 300, width: '100%' }} />}
        contentBackgroundColor={Colors.lightGrey}
        renderStickyHeader={() => (
          <View key="sticky-header" style={styles.stickySection}>
            <Text style={styles.stickySectionText}>{shop.shopName}</Text>
          </View>
        )}>
      <View style={styles.detailsContainer}>
          <Text style={styles.restaurantName}>{shop.shopName}</Text>
          <Text className='ml-4 text-gray-600' >Thoda shop description here!</Text>
          <SectionList
            contentContainerStyle={{ paddingBottom: 150 }}
            keyExtractor={(item, index) => `${item.index + index}`}
            scrollEnabled={false}
            sections={DATA}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ marginHorizontal: 16, height: 1, backgroundColor: Colors.grey }} />}
            SectionSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.grey }} />}
            renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
            />
        </View>
            </ParallaxScrollView>

            <Animated.View style={[styles.stickySegments, animatedStyles]}>
        <View style={styles.segmentsShadow}>
          <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segmentScrollview}>
            {DATA.map((item, index) => (
              <TouchableOpacity
                ref={(ref) => (itemsRef.current[index] = ref!)}
                key={index}
                style={activeIndex === index ? styles.segmentButtonActive : styles.segmentButton}
                onPress={() => selectCategory(index)}>
                <Text style={activeIndex === index ? styles.segmentTextActive : styles.segmentText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      {num > 0 && (
        <View style={styles.footer}>
          <SafeAreaView style={{ backgroundColor: '#fff' }}>
            <Link href="/cart" asChild>
              <TouchableOpacity style={styles.fullButton}>
                <Text style={styles.basket}>{num}</Text>
                <Text style={styles.footerText}>View Basket</Text>
                <Text style={styles.basketTotal}>${total}</Text>
              </TouchableOpacity>
            </Link>
          </SafeAreaView>
        </View>
      )}
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

export default Shop