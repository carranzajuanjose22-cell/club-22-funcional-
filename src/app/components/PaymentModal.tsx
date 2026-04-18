import { useState } from "react";
import { DollarSign, QrCode, CreditCard, X, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function PaymentModal({ open, onClose, onConfirm, total }: any) {
  const [discount, setDiscount] = useState(0);
  const [method1, setMethod1] = useState('efectivo');
  const [amount1, setAmount1] = useState(total);
  const [method2, setMethod2] = useState(''); // Vacío si no hay segundo método
  const [amount2, setAmount2] = useState(0);

  if (!open) return null;

  const subtotalWithDiscount = Math.max(0, total - discount);
  const remaining = subtotalWithDiscount - amount1 - amount2;

  const handleConfirm = () => {
    if (remaining !== 0) {
      alert(`La suma de los pagos debe ser igual a $${subtotalWithDiscount.toLocaleString()}. Faltan/Sobran: $${remaining}`);
      return;
    }
    onConfirm(method1, discount, subtotalWithDiscount, method2 || null, amount1, amount2);
  };

  const methods = [
    { id: 'efectivo', label: 'Efectivo', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'transferencia', label: 'Transf.', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'qr', label: 'QR', icon: <QrCode className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-white/10 p-6 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-white font-bold">Cobro Dividido</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X /></button>
        </div>

        {/* Descuento */}
        <div className="mb-6">
          <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Descuento ($)</label>
          <Input 
            type="number" 
            className="bg-[#2A2A2A] border-white/10 text-white"
            onChange={(e) => {
                const desc = Number(e.target.value) || 0;
                setDiscount(desc);
                setAmount1(total - desc);
                setAmount2(0);
            }}
          />
        </div>

        {/* Método 1 */}
        <div className="space-y-3 mb-4">
          <label className="text-xs text-gray-400 uppercase font-bold block">Pago Principal</label>
          <div className="flex gap-2">
            <select 
              value={method1} 
              onChange={(e) => setMethod1(e.target.value)}
              className="bg-[#2A2A2A] text-white border border-white/10 rounded-md p-2 flex-1"
            >
              {methods.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
            <Input 
              type="number" 
              value={amount1}
              onChange={(e) => setAmount1(Number(e.target.value))}
              className="bg-[#2A2A2A] border-white/10 text-white w-32"
            />
          </div>
        </div>

        {/* Método 2 (Opcional) */}
        {method2 ? (
          <div className="space-y-3 mb-6 p-3 border border-[#C41E3A]/30 rounded-lg bg-[#C41E3A]/5">
            <div className="flex justify-between items-center">
                <label className="text-xs text-[#C41E3A] uppercase font-bold">Segundo Pago</label>
                <button onClick={() => { setMethod2(''); setAmount2(0); setAmount1(subtotalWithDiscount); }} className="text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
            </div>
            <div className="flex gap-2">
              <select 
                value={method2} 
                onChange={(e) => setMethod2(e.target.value)}
                className="bg-[#2A2A2A] text-white border border-white/10 rounded-md p-2 flex-1"
              >
                {methods.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
              <Input 
                type="number" 
                value={amount2}
                onChange={(e) => setAmount2(Number(e.target.value))}
                className="bg-[#2A2A2A] border-white/10 text-white w-32"
              />
            </div>
          </div>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => setMethod2('transferencia')}
            className="w-full mb-6 border-dashed border-white/20 text-gray-400 hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2"/> Combinar con otro método
          </Button>
        )}

        {/* Resumen */}
        <div className="bg-black/40 p-4 rounded-lg mb-6">
            <div className="flex justify-between text-xl font-bold text-white mb-1">
                <span>A COBRAR:</span>
                <span>${subtotalWithDiscount.toLocaleString()}</span>
            </div>
            <div className={`text-sm ${remaining === 0 ? 'text-green-500' : 'text-yellow-500'}`}>
                {remaining === 0 ? '✓ Monto cubierto' : `Pendiente: $${remaining.toLocaleString()}`}
            </div>
        </div>

        <Button 
          onClick={handleConfirm}
          className="w-full h-14 bg-[#C41E3A] hover:bg-[#A01830] text-white font-bold text-lg"
        >
          Confirmar y Cerrar
        </Button>
      </div>
    </div>
  );
}