import { create } from 'zustand';

export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity:number;
  variantWeight:number;
  variantUnit:string;
  variantId:string;
}

interface AddedProduct{
_id:string,
name:string,
variantId:string,
price:string,
quantity:string,
}

export interface BasketState {
  cartId:string
  products: Array<Product & { quantity: number }>;
  addProduct: (product: Product) => void;
  reduceProduct: (product: Product) => void;
  clearCart: () => void;
  num: number;
  total: number;
  location:{
    latitude: number,
    longitude:number
}
  setDeliveryLocation:(latitude: number,longitude:number)=> void;
  setCardId:(id: string)=> void;
}

const useBasketStore = create<BasketState>()((set) => ({
  location:{
    latitude:null,
    longitude:null
  },
  setDeliveryLocation: (latitude, longitude) => {
    set((state) => ({
      location: {
        ...state.location,
        latitude: latitude,
        longitude: longitude
      }
    }));
  },
  cartId:null,
  products: [],
  num: 0,
  total: 0,
  addProduct: (product) => {
    set((state) => {
      state.num += product.quantity;
      state.total += product.price * product.quantity;
      const hasProduct = state.products.find((p) => p._id === product._id && p.variantId === product.variantId);

      if (hasProduct) {
        hasProduct.quantity += product.quantity;
        return { products: [...state.products] };
      } else {
        return { products: [...state.products, { ...product }] };
      }
    });
  },
  reduceProduct: (product) => {
    set((state) => {
      state.total -= product.price;
      state.num -= 1;
      return {
        products: state.products
          .map((p) => {
            if (p._id === product._id) {
              p.quantity -= 1;
            }
            return p;
          })
          .filter((p) => p.quantity > 0),
      };
    });
  },
  clearCart: () => set({ products: [], num: 0, total: 0 }),
  setCardId:(id)=> set({cartId:id})
}));

export default useBasketStore;
