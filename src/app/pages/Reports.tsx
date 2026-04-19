import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { DollarSign, CreditCard, Wallet, TrendingUp, ShoppingBag } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

  // Cálculos de métricas
  const totalDay = sales.reduce((acc, sale) => acc + (sale.total || 0), 0);
  
  const cashTotal = sales.reduce((acc, sale) => {
    if (sale.payment_method === 'efectivo') return acc + (sale.amount_1 || sale.total);
    if (sale.payment_method_2 === 'efectivo') return acc + (sale.amount_2 || 0);
    return acc;
  }, 0);

  const transferTotal = sales.reduce((acc, sale) => {
    const isTransfer = (m: string) => m === 'transferencia' || m === 'debito' || m === 'qr';
    let sum = acc;
    if (isTransfer(sale.payment_method)) sum += (sale.amount_1 || sale.total);
    if (sale.payment_method_2 && isTransfer(sale.payment_method_2)) sum += (sale.amount_2 || 0);
    return sum;
  }, 0);

  const chartData = [
    { name: 'Efectivo', value: cashTotal, color: '#10b981' },
    { name: 'Transferencia/Digital', value: transferTotal, color: '#3b82f6' },
  ];

  if (loading) return <div className="p-8 text-white text-center">Cargando métricas...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">Reporte de Ventas Diario</h1>

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#1A1A1A] border-white/10 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-full text-green-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Ventas Totales (Hoy)</p>
              <p className="text-2xl font-bold">${totalDay.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/10 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-500">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Efectivo en Caja</p>
              <p className="text-2xl font-bold text-emerald-500">${cashTotal.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/10 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-full text-blue-500">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Transferencias / Digital</p>
              <p className="text-2xl font-bold text-blue-500">${transferTotal.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras */}
        <Card className="bg-[#1A1A1A] border-white/10 p-6">
          <h2 className="text-white font-bold mb-6">Distribución de Ingresos</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#fff' }}
                />
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lista de últimas ventas */}
        <Card className="bg-[#1A1A1A] border-white/10 p-6 overflow-hidden">
          <h2 className="text-white font-bold mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Historial de hoy ({sales.length})
          </h2>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {sales.map((sale) => (
              <div key={sale.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg text-white">
                <div>
                  <p className="text-sm font-medium">
                    {sale.type === 'mesa' ? `Mesa ${sale.table_id || ''}` : 'Mostrador'}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">${sale.total.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500 uppercase">{sale.payment_method}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}