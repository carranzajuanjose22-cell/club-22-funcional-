import { useState } from "react";
import { Search, X, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { products, Product, OrderItem } from "../data/mockData";

interface ProductSearchModalProps {
  open: boolean;
  onClose: () => void;
  onAddProduct: (item: OrderItem) => void;
  isTableView?: boolean;
}

export function ProductSearchModal({ 
  open, 
  onClose, 
  onAddProduct,
  isTableView = true 
}: ProductSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const categories = ["Todos", "Vinos", "Tapas", "Cervezas", "Promociones"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    const price = isTableView ? product.priceTable : product.priceCounter;
    
    const orderItem: OrderItem = {
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: price,
      subtotal: price * quantity
    };

    onAddProduct(orderItem);
    setQuantities({ ...quantities, [product.id]: 1 });
  };

  const updateQuantity = (productId: string, value: number) => {
    setQuantities({ ...quantities, [productId]: Math.max(1, value) });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#1A1A1A] border-white/10 text-white max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Buscar Productos</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#2A2A2A] border-white/10 text-white"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={
                selectedCategory === category
                  ? "bg-[#C41E3A] hover:bg-[#A01830] text-white border-0"
                  : "bg-transparent border-white/20 text-gray-300 hover:bg-[#2A2A2A] hover:text-white"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No se encontraron productos
            </div>
          ) : (
            filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-[#2A2A2A] rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white">{product.name}</p>
                    <Badge variant="outline" className="border-white/20 text-gray-300 text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <p className="text-[#C41E3A]">
                      ${isTableView ? product.priceTable : product.priceCounter}
                    </p>
                    <p className="text-gray-400">Stock: {product.stock}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(product.id, (quantities[product.id] || 1) - 1)}
                      className="h-8 w-8 p-0 bg-transparent border-white/20 text-white hover:bg-[#C41E3A] hover:border-[#C41E3A]"
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={quantities[product.id] || 1}
                      onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                      className="w-16 h-8 text-center bg-[#1A1A1A] border-white/10 text-white"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(product.id, (quantities[product.id] || 1) + 1)}
                      className="h-8 w-8 p-0 bg-transparent border-white/20 text-white hover:bg-[#C41E3A] hover:border-[#C41E3A]"
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    onClick={() => handleAddProduct(product)}
                    className="bg-[#C41E3A] hover:bg-[#A01830] text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" strokeWidth={1.5} />
                    Agregar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
