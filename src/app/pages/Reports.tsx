import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { DollarSign, CreditCard, Wallet, TrendingUp, ShoppingBag } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ClosureTicket } from "../components/ClosureTicket";

export function Reports() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaySales();
  }, []);

  const fetchTodaySales = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error("Error cargando reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos de métricas (Efectivo y Transferencia)
  const totalDay = sales.reduce((acc, sale) => acc + (Number(sale.total) || 0), 0);
  
  const cashTotal = sales.reduce((acc, sale) => {
    let sum = acc;
    if (sale.payment_method === 'efectivo') sum += (Number(sale.amount_1) || Number(sale.total));
    if (sale.payment_method_2 === 'efectivo') sum += (Number(sale.amount_2) || 0);
    return sum;
  }, 0);

  const transferTotal = sales.reduce((acc, sale) => {
    const isTransfer = (m: string) => ['transferencia', 'debito', 'qr'].includes(m?.toLowerCase());
    let sum = acc;
    if (isTransfer(sale.payment_method)) sum += (Number(sale.amount_1) || Number(sale.total));
    if (sale.payment_method_2 && isTransfer(sale.payment_method_2)) sum += (Number(sale.amount_2) || 0);
    return sum;
  }, 0);

  const handleCloseCash = async () => {
    if (sales.length === 0) {
      alert("No hay ventas registradas para cerrar hoy.");
      return;
    }

    const confirmClose = window.confirm(
      `¿Deseas confirmar el CIERRE DE CAJA?\n\n` +
      `Total del día: $${totalDay.toLocaleString()}\n` +
      `Efectivo: $${cashTotal.toLocaleString()}\n` +
      `Transferencia: $${transferTotal.toLocaleString()}\n\n` +
      `Esta acción archivará los datos y limpiará la pantalla actual.`
    );
    
    if (!confirmClose) return;

    try {
      // 1. Guardar el registro histórico en Supabase
      const { error } = await supabase.from('daily_cash_closures').insert([{
        total_amount: totalDay,
        cash_amount: cashTotal,
        transfer_amount: transferTotal,
        sales_count: sales.length
      }]);

      if (error) throw error;

      // 2. Disparar impresión del ticket de cierre
      window.print();

      // 3. LIMPIEZA: Reiniciamos el estado local para que todo vuelva a cero
      setSales([]); 

      alert("¡Caja cerrada! El registro histórico se guardó correctamente y la vista se reinició.");
      
    } catch (err: any) {
      alert("Error al cerrar caja: " + err.message);
    }
  };

  const chartData = [
    { name: 'Efectivo', value: cashTotal, color: '#10b981' },
    { name: 'Transferencia', value: transferTotal, color: '#3b82f6' },
  ];

  if (loading) return <div className="p-8 text-white text-center font-mono">Generando reporte...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Reporte Diario</h1>
          <p className="text-gray-500 font-mono text-sm uppercase">Club 22 - Dashboard de Control</p>
        </div>
        <Button 
          onClick={handleCloseCash} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-8 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
        >
          <DollarSign className="w-5 h-5 mr-2" />
          Cerrar Caja del Día
        </Button>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
        <Card className="bg-[#1A1A1A] border-white/5 p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Total Ventas</p>
              <p className="text-3xl font-bold font-mono">${totalDay.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/5 p-6 shadow-xl border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Efectivo</p>
              <p className="text-3xl font-bold text-emerald-500 font-mono">${cashTotal.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/5 p-6 shadow-xl border-l-4 border-l-blue-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Digital / Transf.</p>
              <p className="text-3xl font-bold text-blue-500 font-mono">${transferTotal.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-[#1A1A1A] border-white/5 p-6 h-80 shadow-2xl">
          <h3 className="text-white text-sm font-bold mb-6 uppercase tracking-wider">Distribución</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} 
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/5 p-6 shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Movimientos
            </h3>
            <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded">{sales.length} ventas</span>
          </div>
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {sales.length === 0 ? (
              <p className="text-center text-gray-600 py-10 italic">Caja cerrada o sin movimientos</p>
            ) : (
              sales.map((sale) => (
                <div key={sale.id} className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{sale.payment_method}</p>
                    <p className="text-xs text-gray-300">
                      {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white font-mono text-lg">${Number(sale.total).toLocaleString()}</p>
                    <p className="text-[9px] text-gray-600 uppercase tracking-tighter">
                      {sale.type === 'mesa' ? `Mesa ${sale.table_id || ''}` : 'Mostrador'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="print-only-section">
        <div id="printable-ticket">
          <ClosureTicket data={{
            total: totalDay,
            cash: cashTotal,
            transfer: transferTotal,
            count: sales.length
          }} />
        </div>
      </div>
    </div>
  );
}