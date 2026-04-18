import { useState } from "react";
import { Search, Plus, Trash2, DollarSign, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ProductSearchModal } from "../components/ProductSearchModal";
import { PaymentModal } from "../components/PaymentModal"; 
import { supabase } from "../../lib/supabase"; 
import { useNavigate, Link } from "react-router";

export function CounterSale() {
  const navigate = useNavigate();
  // ESTADOS (Asegurate de que estos nombres coincidan con los que usás abajo)
  const [items, setItems] = useState<any[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  const handleAddItem = (newItem: any) => {
    const existingItemIndex = items.findIndex(item => item.productId === newItem.productId);
    if (existingItemIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      updatedItems[existingItemIndex].subtotal += newItem.subtotal;
      setItems(updatedItems);
    } else {
      setItems([...items, newItem]);
    }
    setShowProductModal(false);
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  // ESTA ES LA FUNCIÓN QUE COBRA
  const handleConfirmPayment = async (
    method: string, 
    discount: number, 
    finalTotal: number, 
    method2: string | null = null, 
    amount1: number = 0, 
    amount2: number = 0
  ) => {
    try {
      const { error } = await supabase.from('sales').insert([{
        table_id: null,
        items: items,
        subtotal: total,
        discount: discount,
        total: finalTotal,
        payment_method: method,
        payment_method_2: method2,
        amount_1: amount1,
        amount_2: amount2,
        type: 'mostrador'
      }]);

      if (error) throw error;

      setItems([]); 
      setShowPaymentModal(false);
      navigate("/");
      
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 text-white">
        <div className="flex items-center gap-4">
          <Link to="/"><Button variant="outline" className="border-white/10 text-white"><ArrowLeft className="w-4 h-4 mr-2"/>Volver</Button></Link>
          <h1 className="text-3xl font-bold">Venta Mostrador</h1>
        </div>
        <Button onClick={() => setShowProductModal(true)} className="bg-[#C41E3A] hover:bg-[#A01830] text-white">
          <Plus className="w-5 h-5 mr-2" /> Buscar Producto
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-[#1A1A1A] border-white/10 p-6">
            {items.length === 0 ? (
              <p className="text-center py-12 text-gray-400">Carrito vacío</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center bg-[#2A2A2A] p-4 rounded-lg text-white border border-white/5">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-400">Cant: {item.quantity} x ${item.unitPrice}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold">${item.subtotal.toLocaleString()}</p>
                      <button onClick={() => handleRemoveItem(item.productId)} className="text-gray-500 hover:text-[#C41E3A]">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#1A1A1A] border-white/10 p-6 text-white text-center">
            <p className="text-gray-400 mb-2">Total Venta</p>
            <p className="text-5xl font-bold text-[#C41E3A]">${total.toLocaleString()}</p>
          </Card>
          
          <Button 
            disabled={items.length === 0}
            onClick={() => setShowPaymentModal(true)} 
            className="w-full h-16 bg-[#C41E3A] hover:bg-[#A01830] text-white font-bold text-xl shadow-lg shadow-[#C41E3A]/20"
          >
            <DollarSign className="w-6 h-6 mr-2" /> Cobrar
          </Button>
        </div>
      </div>

      <ProductSearchModal 
        open={showProductModal} 
        onClose={() => setShowProductModal(false)} 
        onAddProduct={handleAddItem} 
        isTableView={false} 
      />
      
      <PaymentModal 
        open={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        onConfirm={handleConfirmPayment} 
        total={total} 
      />
    </div>
  );
}