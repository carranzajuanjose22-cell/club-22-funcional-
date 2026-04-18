import { useState } from "react";
import { DollarSign, QrCode, CreditCard, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (method: string, discount: number, finalTotal: number) => void;
  total: number;
}

export function PaymentModal({ open, onClose, onConfirm, total }: PaymentModalProps) {
  const [discount, setDiscount] = useState(0);
  
  if (!open) return null;

  const finalTotal = Math.max(0, total - discount);

  const methods = [
    { id: 'efectivo', label: 'Efectivo', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'transferencia', label: 'Transferencia', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'qr', label: 'QR / Billetera', icon: <QrCode className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-white/10 p-6 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white font-bold">Finalizar Pago</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Sección de Descuento */}
        <div className="mb-6 p-4 bg-[#2A2A2A] rounded-lg border border-white/5">
          <label className="text-sm text-gray-400 mb-2 block font-medium">Atención / Descuento ($)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input 
              type="number"
              placeholder="Monto a descontar..."
              className="pl-8 bg-[#1A1A1A] border-white/10 text-white focus:border-[#C41E3A]"
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Resumen de Cuenta */}
        <div className="space-y-3 mb-8 px-2">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal:</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#C41E3A] font-medium">
            <span>Descuento:</span>
            <span>- ${discount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-3xl text-white font-bold pt-3 border-t border-white/10">
            <span>TOTAL:</span>
            <span>${finalTotal.toLocaleString()}</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-bold text-center">Método de Pago</p>
        <div className="grid gap-3 mb-2">
          {methods.map((m) => (
            <Button
              key={m.id}
              onClick={() => onConfirm(m.id, discount, finalTotal)}
              className="h-16 justify-start gap-4 bg-[#2A2A2A] hover:bg-[#C41E3A] text-white border border-white/5 transition-all"
            >
              <div className="p-2 bg-black/20 rounded-lg">{m.icon}</div>
              <span className="text-lg">{m.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}