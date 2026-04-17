import { Link } from "react-router";
import { Plus, ShoppingBag, Search, DollarSign, Utensils, ShoppingCart } from "lucide-react";
import { usePOS } from "../context/POSContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

export function Dashboard() {
  const { tables, getTodayStats } = usePOS();
  const stats = getTodayStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "libre":
        return "bg-green-600";
      case "ocupada":
        return "bg-[#C41E3A]";
      case "cerrando":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "libre":
        return "Libre";
      case "ocupada":
        return "Ocupada";
      case "cerrando":
        return "Cerrando";
      default:
        return status;
    }
  };

  // Obtener fecha y hora actual para el panel
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const dateStr = now.toLocaleDateString('es-AR', options);
  const timeStr = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl text-white mb-2 font-bold">Club 22</h1>
            <p className="text-gray-400">Panel de Control - Punto de Venta</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 capitalize">{dateStr}</p>
            <p className="text-sm text-gray-400">{timeStr}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/table/1">
          <Button className="w-full h-24 bg-[#C41E3A] hover:bg-[#A01830] text-white text-lg font-semibold">
            <Plus className="w-6 h-6 mr-2" strokeWidth={2} />
            Nueva Mesa
          </Button>
        </Link>
        <Link to="/counter">
          <Button className="w-full h-24 bg-[#C41E3A] hover:bg-[#A01830] text-white text-lg font-semibold">
            <ShoppingBag className="w-6 h-6 mr-2" strokeWidth={2} />
            Venta Mostrador
          </Button>
        </Link>
        <div className="relative">
          <Input
            placeholder="Buscar producto..."
            className="h-24 pl-12 bg-[#2A2A2A] border-white/10 text-white placeholder:text-gray-500 text-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" strokeWidth={1.5} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#1A1A1A] border-white/10 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 font-medium">Total Ventas Hoy</p>
            <DollarSign className="w-5 h-5 text-[#C41E3A]" strokeWidth={2} />
          </div>
          <p className="text-4xl text-white font-bold">${stats.totalSales.toLocaleString()}</p>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/10 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 font-medium">Ventas Mesa</p>
            <Utensils className="w-5 h-5 text-[#C41E3A]" strokeWidth={2} />
          </div>
          <p className="text-4xl text-white font-bold">${stats.tableSales.toLocaleString()}</p>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/10 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 font-medium">Ventas Mostrador</p>
            <ShoppingCart className="w-5 h-5 text-[#C41E3A]" strokeWidth={2} />
          </div>
          <p className="text-4xl text-white font-bold">${stats.counterSales.toLocaleString()}</p>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="mt-10">
        <h2 className="text-2xl text-white mb-6 font-semibold">Estado de Mesas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tables.map((table) => (
            <Link
              key={table.id}
              to={`/table/${table.id}`}
              className="block"
            >
              <Card className="bg-[#1A1A1A] border-white/10 p-6 hover:border-[#C41E3A] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[#C41E3A]/10 group">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(table.status)} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                  </div>
                  <p className="text-xl text-white mb-1 font-semibold group-hover:text-[#C41E3A] transition-colors">Mesa {table.number}</p>
                  <p className="text-sm text-gray-400 mb-3">{getStatusLabel(table.status)}</p>
                  {table.total > 0 && (
                    <p className="text-lg text-[#C41E3A] font-bold">${table.total.toLocaleString()}</p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-12 flex items-center justify-center space-x-8 py-4 border-t border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-600" />
          <span className="text-sm text-gray-400 font-medium">Libre</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#C41E3A]" />
          <span className="text-sm text-gray-400 font-medium">Ocupada</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-600" />
          <span className="text-sm text-gray-400 font-medium">Cerrando</span>
        </div>
      </div>
    </div>
  );
}