import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Plus, Printer, DollarSign, Trash2, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { usePOS } from "../context/POSContext";
import { ProductSearchModal } from "../components/ProductSearchModal";
import { OrderItem } from "../data/mockData";

export function CounterSale() {
  const { addCounterSale } = usePOS();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);

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
    setShowProductModal(false);
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setItems(items.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: item.unitPrice * newQuantity
        };
      }
      return item;
    }));
  };

  const handleClearSale = () => {
    if (window.confirm("¿Limpiar toda la venta?")) {
      setItems([]);
    }
  };

  const handleCheckout = () => {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    if (window.confirm(`¿Procesar venta por $${total.toLocaleString()}?`)) {
      addCounterSale(total);
      alert("Ticket impreso. Venta registrada.");
      setItems([]);
    }
  };

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
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
            <h1 className="text-3xl text-white">Venta Mostrador</h1>
            <p className="text-gray-400">Venta directa / Para llevar</p>
          </div>
        </div>

        <Button
          onClick={() => setShowProductModal(true)}
          className="bg-[#C41E3A] hover:bg-[#A01830] text-white"
        >
          <Plus className="w-5 h-5 mr-2" strokeWidth={1.5} />
          Agregar Producto
        </Button>
      </div>

      {/* Order Items */}
      <Card className="bg-[#1A1A1A] border-white/10 mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-white">Cuenta</h2>
            {items.length > 0 && (
              <Button
                onClick={handleClearSale}
                variant="ghost"
                className="text-gray-400 hover:text-[#C41E3A] hover:bg-transparent"
              >
                <X className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Limpiar Venta
              </Button>
            )}
          </div>
          
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No hay productos en la venta</p>
              <p className="text-sm mt-2">Haz clic en "Agregar Producto" para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 pb-3 border-b border-white/10 text-gray-400 text-sm">
                <div className="col-span-5">Producto</div>
                <div className="col-span-2 text-center">Cantidad</div>
                <div className="col-span-2 text-right">Precio Unit.</div>
                <div className="col-span-2 text-right">Subtotal</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="grid grid-cols-12 gap-4 items-center bg-[#2A2A2A] rounded-lg p-4"
                >
                  <div className="col-span-5 text-white">{item.productName}</div>
                  
                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      className="h-8 w-8 p-0 bg-transparent border-white/20 text-white hover:bg-[#C41E3A] hover:border-[#C41E3A]"
                    >
                      -
                    </Button>
                    <span className="text-white w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      className="h-8 w-8 p-0 bg-transparent border-white/20 text-white hover:bg-[#C41E3A] hover:border-[#C41E3A]"
                    >
                      +
                    </Button>
                  </div>
                  
                  <div className="col-span-2 text-right text-gray-300">
                    ${item.unitPrice.toLocaleString()}
                  </div>
                  
                  <div className="col-span-2 text-right text-white">
                    ${item.subtotal.toLocaleString()}
                  </div>
                  
                  <div className="col-span-1 flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveItem(item.productId)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-[#C41E3A] hover:bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Total and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#1A1A1A] border-white/10 p-6">
          <p className="text-gray-400 mb-2">Total a Cobrar</p>
          <p className="text-5xl text-[#C41E3A]">${total.toLocaleString()}</p>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="w-full h-14 bg-[#C41E3A] hover:bg-[#A01830] text-white"
          >
            <DollarSign className="w-5 h-5 mr-2" strokeWidth={1.5} />
            Cobrar / Imprimir Ticket
          </Button>
        </div>
      </div>

      {/* Product Search Modal */}
      <ProductSearchModal
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        onAddProduct={handleAddItem}
        isTableView={false}
      />
    </div>
  );
}
