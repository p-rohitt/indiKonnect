interface Variant {
    _id: T;
    price: number;
    netWeight: number;
    unit: 'g' | 'kg';
}

interface Review {
    rating?: number;
    comment?: string;
}

export interface Product {
    _id: any;
    itemName: string;
    description: string;
    variants: Variant[];
    category: 'Groceries' | 'Fruits' | 'Vegetables' | 'Dairy' | 'Bakery' | 'Meat' | 'Seafood' | 'Beverages' | 'Snacks' | 'Household' | 'Personal Care' | 'Others';
    imageUrl?: string;
    reviews?: Review[];
}