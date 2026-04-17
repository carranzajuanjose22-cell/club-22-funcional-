import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Printer, DollarSign, TrendingUp, CreditCard, Banknote, Utensils, ShoppingCart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { usePOS } from "../context/POSContext";

export function Reports() {
  const { getTodayStats, tables } = usePOS();
  const stats = getTodayStats();
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const handlePrintReport = () => {
    alert("Reporte enviado a impresora");
  };

  const handleCloseCaja = () => {
    setShowCloseDialog(true);
  };

  const confirmCloseCaja = () => {
    alert("Caja cerrada. Reporte final generado.");
    setShowCloseDialog(false);
  };

  const occupiedTables = tables.filter(t => t.status === "ocupada").length;
  const closingTables = tables.filter(t => t.status === "cerrando").length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-[#2A2A2A]">
              <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl text-white">Reportes y Cierre de Caja</h1>
            <p className="text-gray-400">Viernes, 17 de Abril 2026</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handlePrintReport}
            variant="outline"
            className="bg-transparent border-white/20 text-white hover:bg-[#2A2A2A]"
          >
            <Printer className="w-5 h-5 mr-2" strokeWidth={1.5} />
            Imprimir Reporte
          </Button>
          <Button
            onClick={handleCloseCaja}
            className="bg-[#C41E3A] hover:bg-[#A01830] text-white"
          >
            Cerrar Caja
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-[#C41E3A] to-[#A01830] border-0 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80">Total Ventas del Día</p>
            <DollarSign className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <p className="text-4xl text-white mb-1">${stats.totalSales.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-white/80 text-sm">
            <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
            <span>Jornada activa</span>
          </div>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400">Ventas Mesa</p>
            <Utensils className="w-6 h-6 text-[#C41E3A]" strokeWidth={1.5} />
          </div>
          <p className="text-3xl text-white mb-1">${stats.tableSales.toLocaleString()}</p>
          <p className="text-sm text-gray-400">
            {((stats.tableSales / stats.totalSales) * 100 || 0).toFixed(1)}% del total
          </p>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400">Ventas Mostrador</p>
            <ShoppingCart className="w-6 h-6 text-[#C41E3A]" strokeWidth={1.5} />
          </div>
          <p className="text-3xl text-white mb-1">${stats.counterSales.toLocaleString()}</p>
          <p className="text-sm text-gray-400">
            {((stats.counterSales / stats.totalSales) * 100 || 0).toFixed(1)}% del total
          </p>
        </Card>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-[#1A1A1A] border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-white">Desglose por Método de Pago</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-green-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-white">Efectivo</p>
                  <p className="text-sm text-gray-400">60% del total</p>
                </div>
              </div>
              <p className="text-xl text-white">${stats.cashSales.toLocaleString()}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-white">Tarjetas</p>
                  <p className="text-sm text-gray-400">40% del total</p>
                </div>
              </div>
              <p className="text-xl text-white">${stats.cardSales.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-white">Estado de Mesas</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <p className="text-white">Mesas Libres</p>
              </div>
              <p className="text-2xl text-white">{tables.filter(t => t.status === "libre").length}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#C41E3A]" />
                <p className="text-white">Mesas Ocupadas</p>
              </div>
              <p className="text-2xl text-white">{occupiedTables}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-600" />
                <p className="text-white">Mesas Cerrando</p>
              </div>
              <p className="text-2xl text-white">{closingTables}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="bg-[#1A1A1A] border-white/10 p-6">
        <h2 className="text-xl text-white mb-4">Resumen Detallado</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Ventas en Mesa:</span>
              <span className="text-white">${stats.tableSales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Ventas en Mostrador:</span>
              <span className="text-white">${stats.counterSales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Subtotal:</span>
              <span className="text-white">${stats.totalSales.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Efectivo:</span>
              <span className="text-white">${stats.cashSales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Tarjetas:</span>
              <span className="text-white">${stats.cardSales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Total Recaudado:</span>
              <span className="text-[#C41E3A] text-xl">${stats.totalSales.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Close Caja Dialog */}
      {showCloseDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="bg-[#1A1A1A] border-white/10 p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl text-white mb-4">Confirmar Cierre de Caja</h2>
            <p className="text-gray-400 mb-6">
              ¿Estás seguro de que deseas cerrar la caja? Se generará un reporte final con todas las ventas del día.
            </p>
            
            <div className="bg-[#2A2A2A] rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-2">Total a declarar:</p>
              <p className="text-3xl text-[#C41E3A]">${stats.totalSales.toLocaleString()}</p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowCloseDialog(false)}
                variant="outline"
                className="flex-1 bg-transparent border-white/20 text-white hover:bg-[#2A2A2A]"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmCloseCaja}
                className="flex-1 bg-[#C41E3A] hover:bg-[#A01830] text-white"
              >
                Confirmar Cierre
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
