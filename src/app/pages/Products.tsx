import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; 
import { Link } from "react-router";
import { ArrowLeft, Search, Package } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

export function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const categories = ["Todos", "Vinos", "Tapas", "Cervezas", "Promociones"];

  // 1. Función para traer datos de Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) console.error("Error cargando productos:", error);
    else setDbProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Lógica de filtrado
  const filteredProducts = dbProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Vinos": return "bg-purple-900/30 text-purple-300 border-purple-700/50";
      case "Tapas": return "bg-orange-900/30 text-orange-300 border-orange-700/50";
      case "Cervezas": return "bg-amber-900/30 text-amber-300 border-amber-700/50";
      case "Promociones": return "bg-[#C41E3A]/30 text-red-300 border-[#C41E3A]/50";
      default: return "bg-gray-800/30 text-gray-300 border-gray-700/50";
    }
  };

  // 3. Función de Guardar conectada a Supabase
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const productData = {
      name: formData.get('name'),
      price_mesa: Number(formData.get('price_mesa')),
      price_mostrador: Number(formData.get('price_mostrador')),
      stock: Number(formData.get('stock')),
      category: editingProduct?.category || (selectedCategory !== "Todos" ? selectedCategory : "Vinos")
    };

    const { error } = await supabase
      .from('products')
      .upsert([{ 
        ...(editingProduct?.id && { id: editingProduct.id }), 
        ...productData 
      }]);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      await fetchProducts(); // Recarga la lista automáticamente
      setIsModalOpen(false);
      setEditingProduct(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/">
          <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-[#2A2A2A]">
            <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={1.5} />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Productos y Precios</h1>
          <p className="text-gray-400">Catálogo completo</p>
        </div>
      </div>

      {/* Search and Action Button */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#2A2A2A] border-white/10 text-white h-12 w-full"
            />
          </div>
          <Button 
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            className="bg-[#C41E3A] hover:bg-[#A01830] text-white h-12 px-6"
          >
            + Nuevo Producto
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category
                ? "bg-[#C41E3A] hover:bg-[#A01830] text-white border-0"
                : "bg-transparent border-white/20 text-gray-300 hover:bg-[#2A2A2A]"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-[#1A1A1A] border-white/10 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-[#C41E3A]" strokeWidth={1.5} />
            <div>
              <p className="text-gray-400 text-sm">Total Productos</p>
              <p className="text-2xl text-white font-bold">{filteredProducts.length}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/10 p-4 shadow-sm">
          <p className="text-gray-400 text-sm mb-1">Stock Total</p>
          <p className="text-2xl text-white font-bold">
            {filteredProducts.reduce((sum, p) => sum + (p.stock || 0), 0)} unidades
          </p>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/10 p-4 shadow-sm">
          <p className="text-gray-400 text-sm mb-1">Categorías</p>
          <p className="text-2xl text-white font-bold">{categories.length - 1}</p>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="bg-[#1A1A1A] border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left p-4 text-gray-400 font-medium">Producto</th>
                <th className="text-left p-4 text-gray-400 font-medium">Categoría</th>
                <th className="text-right p-4 text-gray-400 font-medium">Precio Mesa</th>
                <th className="text-right p-4 text-gray-400 font-medium">Precio Mostrador</th>
                <th className="text-right p-4 text-gray-400 font-medium">Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr
                  key={product.id}
                  onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                  className="border-b border-white/5 hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                >
                  <td className="p-4 text-white font-medium">{product.name}</td>
                  <td className="p-4">
                    <Badge className={`${getCategoryColor(product.category)} border`}>
                      {product.category}
                    </Badge>
                  </td>
                  <td className="p-4 text-right text-white">${(product.price_mesa || 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-white">${(product.price_mostrador || 0).toLocaleString()}</td>
                  <td className={`p-4 text-right font-medium ${(product.stock || 0) < 10 ? 'text-red-500' : 'text-gray-300'}`}>
                    {product.stock || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL DE EDICIÓN/CARGA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-[#1a1a1a] border-gray-800 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 uppercase">Nombre</label>
                <Input name="name" defaultValue={editingProduct?.name} required className="bg-[#121212] border-gray-800 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase">Precio Mesa</label>
                  <Input name="price_mesa" type="number" defaultValue={editingProduct?.price_mesa} required className="bg-[#121212] border-gray-800 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase">Precio Mostrador</label>
                  <Input name="price_mostrador" type="number" defaultValue={editingProduct?.price_mostrador} required className="bg-[#121212] border-gray-800 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 uppercase">Stock</label>
                <Input name="stock" type="number" defaultValue={editingProduct?.stock} required className="bg-[#121212] border-gray-800 text-white" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 border-gray-700 text-white">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-[#C41E3A] hover:bg-[#A01830] text-white font-bold">
                  Guardar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}