import React, { createContext, useContext, useState, ReactNode } from "react";

// 1. Definición de tipos necesarios
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Table {
  id: string;
  number: number;
  status: 'libre' | 'ocupada' | 'cerrando';
  total: number;
  items: OrderItem[];
}

interface POSContextType {
  tables: Table[];
  updateTable: (tableId: string, items: OrderItem[]) => void;
  closeTable: (tableId: string) => void;
  setTableStatus: (tableId: string, status: "libre" | "ocupada" | "cerrando") => void;
  getTodayStats: () => {
    totalSales: number;
    tableSales: number;
    counterSales: number;
    cashSales: number;
    cardSales: number;
  };
  counterSales: number;
  addCounterSale: (amount: number) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: ReactNode }) {
  // 2. Mesas que arrancan SIEMPRE en cero
  const [tables, setTables] = useState<Table[]>(
    Array.from({ length: 12 }, (_, i) => ({
      id: (i + 1).toString(),
      number: i + 1,
      status: 'libre',
      total: 0,
      items: []
    }))
  );

  const [counterSales, setCounterSales] = useState(0);

  // 3. Funciones de gestión
  const updateTable = (tableId: string, items: OrderItem[]) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        const total = items.reduce((sum, item) => sum + item.subtotal, 0);
        return { ...table, items, total, status: items.length > 0 ? "ocupada" : "libre" };
      }
      return table;
    }));
  };

  const closeTable = (tableId: string) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, items: [], total: 0, status: "libre" } : table
    ));
  };

  const setTableStatus = (tableId: string, status: "libre" | "ocupada" | "cerrando") => {
    setTables(prev => prev.map(table => table.id === tableId ? { ...table, status } : table));
  };

  const addCounterSale = (amount: number) => setCounterSales(prev => prev + amount);

  const getTodayStats = () => {
    const tableSales = tables.reduce((sum, table) => table.status === "cerrando" ? sum + table.total : sum, 0);
    const totalSales = tableSales + counterSales;
    return {
      totalSales,
      tableSales,
      counterSales,
      cashSales: totalSales * 0.6,
      cardSales: totalSales * 0.4
    };
  };

  return (
    <POSContext.Provider value={{ tables, updateTable, closeTable, setTableStatus, getTodayStats, counterSales, addCounterSale }}>
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (!context) throw new Error("usePOS must be used within POSProvider");
  return context;
}