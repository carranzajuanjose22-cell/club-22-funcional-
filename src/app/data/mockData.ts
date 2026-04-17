export interface Product {
  id: string;
  name: string;
  category: string;
  priceTable: number;
  priceCounter: number;
  stock: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Table {
  id: string;
  number: number;
  status: "libre" | "ocupada" | "cerrando";
  items: OrderItem[];
  total: number;
}

// ESTO TIENE QUE ESTAR VACÍO
export const products: Product[] = [];

export const initialTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: (i + 1).toString(),
  number: i + 1,
  status: "libre",
  items: [],
  total: 0,
}));