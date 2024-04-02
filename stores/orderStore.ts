import axios from "axios";
import { Alert } from "react-native";
import {create} from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Double } from "react-native/Libraries/Types/CodegenTypes";

interface Order{
    order_id:string,
    total:Double,

    
}
interface OrderState{
    
    pendingOrders:[],

}