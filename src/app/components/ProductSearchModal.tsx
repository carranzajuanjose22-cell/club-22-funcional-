import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Search, X, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ProductSearchModalProps {
  open: boolean;
  onClose: () => void;
  onAddProduct: (item: any) => void;
  isTableView: boolean;
}

export function ProductSearchModal({ open, onClose, onAddProduct, isTableView }: ProductSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchProducts = async () => {
        setLoading(true);
        // Traemos los productos reales de tu tabla en Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          console.error("Error cargando productos:", error.message);
        } else {
          setProducts(data || []);
        }
        setLoading(false);
      };
      fetchProducts();
    }
  }, [open]);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-white/10 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-white font-bold">Agregar Producto</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input 
              autoFocus
              placeholder="Buscar por nombre o categoría..." 
              className="pl-10 bg-[#2A2A2A] border-white/10 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {loading ? (
            <p className="text-center text-gray-500 py-8">Conectando con Supabase...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay productos cargados</p>
          ) : (
            filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="flex items-center justify-between p-4 bg-[#2A2A2A] hover:bg-[#333] rounded-lg border border-transparent hover:border-[#C41E3A]/50 transition-all group"
              >
                <div>
                  <p className="text-white font-medium">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="flex items-center gap-6">
                  <p className="text-[#C41E3A] font-bold">
                    ${isTableView ? (product.price_mesa || 0) : (product.price_mostrador || 0)}
                  </p>
                  <Button 
                    size="sm"
                    className="bg-[#C41E3A] hover:bg-[#A01830] text-white h-8"
                    onClick={() => onAddProduct({
                      productId: product.id,
                      productName: product.name,
                      quantity: 1,
                      unitPrice: isTableView ? (product.price_mesa || 0) : (product.price_mostrador || 0),
                      subtotal: isTableView ? (product.price_mesa || 0) : (product.price_mostrador || 0)
                    })}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Agregar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}