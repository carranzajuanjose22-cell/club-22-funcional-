import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definición de tipos
interface Table {
  id: string;
  number: number;
  status: 'libre' | 'ocupada' | 'cerrando';
  total: number;
}

interface POSContextType {
  tables: Table[];
  getTodayStats: () => {
    totalSales: number;
    tableSales: number;
    counterSales: number;
  };
  // Aquí puedes agregar funciones para abrir/cerrar mesas luego
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: ReactNode }) {
  // 1. Creamos 12 mesas automáticas, todas LIBRES y en $0
  const [tables, setTables] = useState<Table[]>(
    Array.from({ length: 12 }, (_, i) => ({
      id: (i + 1).toString(),
      number: i + 1,
      status: 'libre',
      total: 0,
    }))
  );

  // 2. Ventas de mostrador (inician en 0)
  const [counterSales, setCounterSales] = useState(0);

  // 3. Función para calcular estadísticas en tiempo real
  const getTodayStats = () => {
    const tableSales = tables.reduce((sum, table) => sum + table.total, 0);
    return {
      tableSales: tableSales,
      counterSales: counterSales,
      totalSales: tableSales + counterSales,
    };
  };

  return (
    <POSContext.Provider value={{ tables, getTodayStats }}>
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}