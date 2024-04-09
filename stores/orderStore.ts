import axios from "axios";
import { Alert } from "react-native";
import {create} from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import useAuthStore from "./authStore";

interface Coordinates {
    coordinates: [number, number];
    type: string;
}

interface Item {
    itemId: string;
    quantity: number;
    price: number;
    variantId: number;
    _id: string;
}

interface Location {
    coordinates: Coordinates[];
    type: string;
}

export interface Order {
    location: Location;
    _id: string;
    shopId: string;
    customerId: string;
    items: Item[];
    total: number;
    status: string;
    __v: number;
}
interface OrderState{
    
    pendingOrders:Order[],
    processedOrders:Order[],
    completedOrders:Order[],
    setPendingOrders:(orders:Order[])=>void;
    setProcessedOrders:(orders:Order[])=>void;
    setCompletedOrders:(orders:Order[])=>void;
    acceptOrder:(order:Order)=>void;
    rejectOrder:(order:Order)=>void;

}

const {token} = useAuthStore();

const useOrderStore = create<OrderState> ((set) => ({
   pendingOrders:[],
   processedOrders:[],
   completedOrders:[],
   setPendingOrders:(orders:Order[]) => {
    set({pendingOrders:orders})
   },setProcessedOrders:(orders:Order[]) => {
    set({processedOrders:orders})
   },setCompletedOrders:(orders:Order[]) => {
    set({completedOrders:orders})
   },
   acceptOrder:async (order: Order) => {
  
    set((state) => {
        if (!state.pendingOrders || !Array.isArray(state.pendingOrders)) {
            console.error("pendingOrders is not an array or is undefined");
            return state;
        }

        // Update status of the order to "processing"
        const updatedOrder = { ...order, status: "processing" };

        // Filter out the accepted order from pendingOrders
        const updatedPendingOrders = state.pendingOrders.filter((o) => o._id !== order._id);

        // Add the updated order to processedOrders
        const updatedProcessedOrders = [...state.processedOrders, updatedOrder];

        

        return {
            ...state,
            pendingOrders: updatedPendingOrders,
            processedOrders: updatedProcessedOrders,
        };
    });
},
   rejectOrder:(order)=>{
    set((state) => {
        const updatedPendingOrders = state.pendingOrders.filter((o) => o._id !== order._id);
        return {
            ...state,
            pendingOrders: updatedPendingOrders,
        };
    });

   }
 }))
 


 export default useOrderStore
 