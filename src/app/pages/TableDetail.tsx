import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Plus, Printer, DollarSign, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { usePOS } from "../context/POSContext";
import { ProductSearchModal } from "../components/ProductSearchModal";
import { PaymentModal } from "../components/PaymentModal"; // IMPORTAMOS EL NUEVO MODAL
import { supabase } from "../../lib/supabase"; // IMPORTAMOS SUPABASE
import { OrderItem } from "../data/mockData";

export function TableDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tables, updateTable, closeTable, setTableStatus } = usePOS();
  
  const table = tables.find(t => t.id === id);
  const [items, setItems] = useState<OrderItem[]>(table?.items || []);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // ESTADO PARA EL MODAL DE PAGO

  useEffect(() => {
    if (table) {
      setItems(table.items);
    }
  }, [table]);

  if (!table) return <div className="p-8 text-white text-center">Mesa no encontrada</div>;

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  // 1. Esta función ahora solo abre el modal de pago
  const handleOpenPayment = () => {
    setShowPaymentModal(true);
  };

  // 2. Esta es la función que realmente guarda la venta en Supabase
  const handleConfirmPayment = async (method: string, discount: number, finalTotal: number) => {
    try {
      const { error } = await supabase.from('sales').insert([{
        table_id: id,
        items: items, // Guardamos la lista de productos
        subtotal: total,
        discount: discount,
        total: finalTotal,
        payment_method: method,
        type: 'mesa'
      }]);

      if (error) throw error;

      // Si se guardó bien en la nube, cerramos la mesa en la app
      closeTable(id!);
      setShowPaymentModal(false);
      navigate("/");
      
    } catch (error: any) {
      alert("Error al registrar la venta: " + error.message);
    }
  };

  // Funciones de manejo de ítems (se mantienen igual)
  const handleAddItem = (newItem: OrderItem) => {
    const existingItemIndex = items.findIndex(item => item.productId === newItem.productId);
    let updatedItems;
    if (existingItemIndex >= 0) {
      updatedItems = [...items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
        subtotal: updatedItems[existingItemIndex].subtotal + newItem.subtotal
      };
    } else {
      updatedItems = [...items, newItem];
    }
    setItems(updatedItems);
    updateTable(id!, updatedItems);
    setShowProductModal(false);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItems(items.filter(i => i.productId !== productId));
      updateTable(id!, items.filter(i => i.productId !== productId));
      return;
    }
    const updatedItems = items.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity, subtotal: item.unitPrice * newQuantity } : item
    );
    setItems(updatedItems);
    updateTable(id!, updatedItems);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4 text-white">
          <Link to="/"><Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-[#2A2A2A]"><ArrowLeft className="w-5 h-5 mr-2" />Volver</Button></Link>
          <div>
            <h1 className="text-3xl font-bold">Mesa {table.number}</h1>
            <p className="text-gray-400 capitalize">{table.status}</p>
          </div>
        </div>
        <Button onClick={() => setShowProductModal(true)} className="bg-[#C41E3A] hover:bg-[#A01830] text-white"><Plus className="w-5 h-5 mr-2" />Agregar Ítem</Button>
      </div>

      {/* Comanda */}
      <Card className="bg-[#1A1A1A] border-white/10 mb-6 p-6">
        {items.length === 0 ? (
          <p className="text-center py-12 text-gray-400">No hay ítems en esta mesa</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="grid grid-cols-12 gap-4 items-center bg-[#2A2A2A] rounded-lg p-4 text-white">
                <div className="col-span-5">{item.productName}</div>
                <div className="col-span-3 flex justify-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 text-white border-white/20" onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}>-</Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button size="sm" variant="outline" className="h-8 w-8 text-white border-white/20" onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>+</Button>
                </div>
                <div className="col-span-4 text-right font-bold">${item.subtotal.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Acciones de Cobro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
        <Card className="bg-[#1A1A1A] border-white/10 p-6">
          <p className="text-gray-400 mb-2 font-medium">Subtotal Mesa</p>
          <p className="text-5xl text-[#C41E3A] font-bold">${total.toLocaleString()}</p>
        </Card>
        <div className="space-y-3">
          <Button disabled={items.length === 0} className="w-full h-14 bg-[#2A2A2A] text-white border border-white/10 hover:bg-[#333]" onClick={() => { setTableStatus(id!, "cerrando"); alert("Pre-ticket enviado"); }}>
            <Printer className="w-5 h-5 mr-2" />Imprimir Pre-ticket
          </Button>
          <Button disabled={items.length === 0} className="w-full h-14 bg-[#C41E3A] text-white hover:bg-[#A01830] font-bold text-lg" onClick={handleOpenPayment}>
            <DollarSign className="w-5 h-5 mr-2" />Cerrar Mesa / Cobrar
          </Button>
        </div>
      </div>

      <ProductSearchModal open={showProductModal} onClose={() => setShowProductModal(false)} onAddProduct={handleAddItem} isTableView={true} />
      
      {/* EL NUEVO MODAL DE PAGO */}
      <PaymentModal 
        open={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        onConfirm={handleConfirmPayment} 
        total={total} 
      />
    </div>
  );
}