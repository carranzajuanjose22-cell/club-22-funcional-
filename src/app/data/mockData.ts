// Mock data for Club 22 POS System

export interface Product {
  id: string;
  name: string;
  category: "Vinos" | "Tapas" | "Cervezas" | "Promociones";
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

export const products: Product[] = [
  // Vinos
  { id: "v1", name: "Malbec Reserva", category: "Vinos", priceTable: 4500, priceCounter: 4200, stock: 24 },
  { id: "v2", name: "Cabernet Sauvignon", category: "Vinos", priceTable: 4800, priceCounter: 4500, stock: 18 },
  { id: "v3", name: "Chardonnay", category: "Vinos", priceTable: 4200, priceCounter: 3900, stock: 15 },
  { id: "v4", name: "Pinot Noir", category: "Vinos", priceTable: 5200, priceCounter: 4900, stock: 12 },
  { id: "v5", name: "Torrontés", category: "Vinos", priceTable: 3800, priceCounter: 3500, stock: 20 },
  { id: "v6", name: "Blend Premium", category: "Vinos", priceTable: 6500, priceCounter: 6200, stock: 8 },
  
  // Tapas
  { id: "t1", name: "Tabla de Quesos", category: "Tapas", priceTable: 2800, priceCounter: 2600, stock: 50 },
  { id: "t2", name: "Jamón Ibérico", category: "Tapas", priceTable: 3500, priceCounter: 3200, stock: 30 },
  { id: "t3", name: "Aceitunas Gourmet", category: "Tapas", priceTable: 1200, priceCounter: 1100, stock: 60 },
  { id: "t4", name: "Croquetas de Jamón", category: "Tapas", priceTable: 1800, priceCounter: 1600, stock: 40 },
  { id: "t5", name: "Patatas Bravas", category: "Tapas", priceTable: 1500, priceCounter: 1400, stock: 45 },
  { id: "t6", name: "Tabla Mixta", category: "Tapas", priceTable: 3200, priceCounter: 3000, stock: 35 },
  
  // Cervezas
  { id: "c1", name: "Cerveza Artesanal IPA", category: "Cervezas", priceTable: 1200, priceCounter: 1100, stock: 48 },
  { id: "c2", name: "Cerveza Rubia", category: "Cervezas", priceTable: 900, priceCounter: 850, stock: 60 },
  { id: "c3", name: "Cerveza Negra", category: "Cervezas", priceTable: 1100, priceCounter: 1000, stock: 36 },
  { id: "c4", name: "Cerveza Sin Alcohol", category: "Cervezas", priceTable: 800, priceCounter: 750, stock: 24 },
  
  // Promociones
  { id: "p1", name: "Promo Vino + Tabla", category: "Promociones", priceTable: 6500, priceCounter: 6200, stock: 20 },
  { id: "p2", name: "Happy Hour 2x1 Cervezas", category: "Promociones", priceTable: 1200, priceCounter: 1100, stock: 100 },
  { id: "p3", name: "Pack Degustación", category: "Promociones", priceTable: 8900, priceCounter: 8500, stock: 15 },
];

export const initialTables: Table[] = [
  { id: "1", number: 1, status: "libre", items: [], total: 0 },
  { id: "2", number: 2, status: "libre", items: [], total: 0 },
  { id: "3", number: 3, status: "libre", items: [], total: 0 },
  { id: "4", number: 4, status: "ocupada", items: [
    { productId: "v1", productName: "Malbec Reserva", quantity: 2, unitPrice: 4500, subtotal: 9000 },
    { productId: "t1", productName: "Tabla de Quesos", quantity: 1, unitPrice: 2800, subtotal: 2800 },
  ], total: 11800 },
  { id: "5", number: 5, status: "libre", items: [], total: 0 },
  { id: "6", number: 6, status: "ocupada", items: [
    { productId: "c1", productName: "Cerveza Artesanal IPA", quantity: 3, unitPrice: 1200, subtotal: 3600 },
    { productId: "t5", productName: "Patatas Bravas", quantity: 2, unitPrice: 1500, subtotal: 3000 },
  ], total: 6600 },
  { id: "7", number: 7, status: "libre", items: [], total: 0 },
  { id: "8", number: 8, status: "cerrando", items: [
    { productId: "v6", productName: "Blend Premium", quantity: 1, unitPrice: 6500, subtotal: 6500 },
    { productId: "t2", productName: "Jamón Ibérico", quantity: 1, unitPrice: 3500, subtotal: 3500 },
    { productId: "t6", productName: "Tabla Mixta", quantity: 1, unitPrice: 3200, subtotal: 3200 },
  ], total: 13200 },
  { id: "9", number: 9, status: "libre", items: [], total: 0 },
  { id: "10", number: 10, status: "libre", items: [], total: 0 },
  { id: "11", number: 11, status: "ocupada", items: [
    { productId: "p1", productName: "Promo Vino + Tabla", quantity: 1, unitPrice: 6500, subtotal: 6500 },
  ], total: 6500 },
  { id: "12", number: 12, status: "libre", items: [], total: 0 },
];
