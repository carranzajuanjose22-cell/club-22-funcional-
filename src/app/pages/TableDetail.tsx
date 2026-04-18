import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Plus, Printer, DollarSign } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { usePOS } from "../context/POSContext";
import { ProductSearchModal } from "../components/ProductSearchModal";
import { PaymentModal } from "../components/PaymentModal";
import { supabase } from "../../lib/supabase";

export function TableDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tables, updateTable, closeTable, setTableStatus } = usePOS();
  
  const table = tables.find(t => t.id === id);
  const [items, setItems] = useState<any[]>(table?.items || []);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (table) {
      setItems(table.items);
    }
  }, [table]);

  if (!table) return <div className="p-8 text-white text-center">Mesa no encontrada</div>;

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  // --- LA FUNCIÓN AHORA ESTÁ ADENTRO DEL COMPONENTE ---
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
        table_id: id || null,
        items: items,
        subtotal: total,
        discount: discount,
        total: finalTotal,
        payment_method: method,
        payment_method_2: method2,
        amount_1: amount1,
        amount_2: amount2,
        type: id ? 'mesa' : 'mostrador'
      }]);

      if (error) throw error;

      if (id) {
        closeTable(id);
      }
      
      setItems([]); 
      setShowPaymentModal(false);
      navigate("/");
      
    } catch (error: any) {
      console.error("Error en Supabase:", error);
      alert("Error: " + (error.message || "Error desconocido"));
    }
  };

  const handleAddItem = (newItem: any) => {
    const existingItemIndex = items.findIndex(item => item.productId === newItem.productId);
    let updatedItems;
    if (existingItemIndex >= 0) {
      updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      updatedItems[existingItemIndex].subtotal += newItem.subtotal;
    } else {
      updatedItems = [...items, newItem];
    }
    setItems(updatedItems);
    updateTable(id!, updatedItems);
    setShowProductModal(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4 text-white">
          <Link to="/"><Button variant="outline" className="bg-transparent border-white/20 text-white"><ArrowLeft className="w-5 h-5 mr-2" />Volver</Button></Link>
          <h1 className="text-3xl font-bold text-white">Mesa {table.number}</h1>
        </div>
        <Button onClick={() => setShowProductModal(true)} className="bg-[#C41E3A] hover:bg-[#A01830] text-white"><Plus className="w-5 h-5 mr-2" />Agregar Ítem</Button>
      </div>

      <Card className="bg-[#1A1A1A] border-white/10 mb-6 p-6">
        {items.length === 0 ? (
          <p className="text-center py-12 text-gray-400">Mesa vacía</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center bg-[#2A2A2A] rounded-lg p-4 text-white">
                <span>{item.productName} (x{item.quantity})</span>
                <span className="font-bold">${item.subtotal.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
        <Card className="bg-[#1A1A1A] border-white/10 p-6">
          <p className="text-gray-400 mb-2">Total</p>
          <p className="text-5xl text-[#C41E3A] font-bold">${total.toLocaleString()}</p>
        </Card>
        <div className="space-y-3">
          <Button disabled={items.length === 0} className="w-full h-14 bg-[#C41E3A] text-white hover:bg-[#A01830]" onClick={() => setShowPaymentModal(true)}>
            <DollarSign className="w-5 h-5 mr-2" />Cerrar Mesa / Cobrar
          </Button>
        </div>
      </div>

      <ProductSearchModal open={showProductModal} onClose={() => setShowProductModal(false)} onAddProduct={handleAddItem} isTableView={true} />
      
      <PaymentModal 
        open={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        onConfirm={handleConfirmPayment} 
        total={total} 
      />
    </div>
  );
}