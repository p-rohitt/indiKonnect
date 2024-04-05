import axios from "axios";
import { Alert } from "react-native";
import {create} from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface Shop{
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
interface ShopState{
    shop:Shop,
    setShop:(shop: Shop | null) => void;
    items:Product[]
    setItems:(items:Product[] | null) => void;
    }

    interface Variant {
        price: number;
        netWeight: number;
        unit: 'g' | 'kg' | 'l' | 'ml';
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
    

    const useShopStore = create<ShopState> ((set) => ({
       shop:null,
       setShop:(shop)=>set({shop:shop}),
       items:null,
       setItems:(items)=>set({items:items})
    }))
    
    
    export default useShopStore