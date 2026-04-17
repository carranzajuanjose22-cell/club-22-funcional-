import React, { createContext, useContext, useState, ReactNode } from "react";
import { Table, OrderItem } from "../data/mockData";

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

// Función auxiliar para generar 12 mesas limpias
const generateCleanTables = (): Table[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: (i + 1).toString(),
    number: i + 1,
    status: "libre",
    total: 0,
    items: []
  }));
};

export function POSProvider({ children }: { children: ReactNode }) {
  // CAMBIO CLAVE: Ya no usamos 'initialTables' del mockData, usamos nuestra función limpia
  const [tables, setTables] = useState<Table[]>(generateCleanTables());
  const [counterSales, setCounterSales] = useState(0);

  const updateTable = (tableId: string, items: OrderItem[]) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        const total = items.reduce((sum, item) => sum + item.subtotal, 0);
        return {
          ...table,
          items,
          total,
          status: items.length > 0 ? "ocupada" as const : "libre" as const
        };
      }
      return table;
    }));
  };

  const closeTable = (tableId: string) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          items: [],
          total: 0,
          status: "libre" as const
        };
      }
      return table;
    }));
  };

  const setTableStatus = (tableId: string, status: "libre" | "ocupada" | "cerrando") => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        return { ...table, status };
      }
      return table;
    }));
  };

  const addCounterSale = (amount: number) => {
    setCounterSales(prev => prev + amount);
  };

  const getTodayStats = () => {
    const tableSales = tables.reduce((sum, table) => {
      // Solo sumamos al total del día lo que está en proceso de cobro o ya cobrado
      if (table.status === "cerrando") {
        return sum + table.total;
      }
      return sum;
    }, 0);

    const totalSales = tableSales + counterSales;
    
    const cashSales = totalSales * 0.6;
    const cardSales = totalSales * 0.4;

    return {
      totalSales,
      tableSales,
      counterSales,
      cashSales,
      cardSales
    };
  };

  return (
    <POSContext.Provider value={{
      tables,
      updateTable,
      closeTable,
      setTableStatus,
      getTodayStats,
      counterSales,
      addCounterSale
    }}>
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error("usePOS must be used within POSProvider");
  }
  return context;
}