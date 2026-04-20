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
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. LEER EL ÚLTIMO CIERRE: Obtenemos el timestamp guardado
      const lastClosureTime = localStorage.getItem("last_closure_timestamp");

      let query = supabase
        .from('sales')
        .select('*')
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      // 2. FILTRAR: Si hubo un cierre hoy, solo traer lo posterior a ese cierre
      if (lastClosureTime) {
        query = query.gt('created_at', lastClosureTime);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error("Error cargando reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos de métricas
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
      alert("No hay movimientos nuevos para cerrar.");
      return;
    }

    const confirmClose = window.confirm(
      `¿Deseas confirmar el CIERRE DE CAJA?\n\n` +
      `Total a cerrar: $${totalDay.toLocaleString()}\n\n` +
      `Al confirmar, estas ventas ya no aparecerán en el reporte diario al refrescar.`
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

      // 2. Disparar impresión
      window.print();

      // 3. PERSISTIR CIERRE: Guardamos el momento exacto en el navegador
      localStorage.setItem("last_closure_timestamp", new Date().toISOString());

      // 4. Limpiar estado local
      setSales([]); 

      alert("¡Caja cerrada! La pantalla se ha reiniciado para nuevos movimientos.");
      
    } catch (err: any) {
      alert("Error al cerrar caja: " + err.message);
    }
  };

  const chartData = [
    { name: 'Efectivo', value: cashTotal, color: '#10b981' },
    { name: 'Transferencia', value: transferTotal, color: '#3b82f6' },
  ];

  if (loading) return <div className="p-8 text-white text-center font-mono italic">Sincronizando caja...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Reporte Diario</h1>
          <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Estado Actual de Caja</p>
        </div>
        <Button 
          onClick={handleCloseCash} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-8 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
        >
          <DollarSign className="w-5 h-5 mr-2" />
          Cerrar Caja y Reiniciar
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
        <Card className="bg-[#1A1A1A] border-white/5 p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Nuevas Ventas</p>
              <p className="text-3xl font-bold font-mono">${totalDay.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/5 p-6 shadow-xl border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-4">
            <Wallet className="w-6 h-6 text-emerald-500" />
            <div>
              <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Efectivo Nuevo</p>
              <p className="text-3xl font-bold text-emerald-500 font-mono">${cashTotal.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/5 p-6 shadow-xl border-l-4 border-l-blue-500">
          <div className="flex items-center gap-4">
            <CreditCard className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Digital Nuevo</p>
              <p className="text-3xl font-bold text-blue-500 font-mono">${transferTotal.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-[#1A1A1A] border-white/5 p-6 h-80 shadow-2xl">
          <h3 className="text-white text-sm font-bold mb-6 uppercase tracking-wider">Distribución Nueva</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="name" stroke="#555" fontSize={12} />
              <YAxis stroke="#555" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/5 p-6 shadow-2xl overflow-hidden text-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Movimientos Nuevos
            </h3>
            <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded">{sales.length} items</span>
          </div>
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {sales.length === 0 ? (
              <p className="text-center text-gray-600 py-10 italic">Sin movimientos registrados después del último cierre.</p>
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