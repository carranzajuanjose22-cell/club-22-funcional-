import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; 
import { Link } from "react-router";
import { ArrowLeft, Search, Package, Trash2, Edit3 } from "lucide-react";
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

  // 1. Cargar productos desde Supabase
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

  // 3. Guardar / Editar Producto
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const productData = {
      name: formData.get('name'),
      price_mesa: Number(formData.get('price_mesa')),
      price_mostrador: Number(formData.get('price_mostrador')),
      stock: Number(formData.get('stock')),
      category: formData.get('category') as string
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
      await fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    }
  };

  // 4. Eliminar Producto
  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert("Error al eliminar: " + error.message);
    else fetchProducts();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#0a0a0a]">
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
            <h1 className="text-3xl font-bold text-white">Catálogo de Productos</h1>
            <p className="text-gray-400 font-mono text-sm">CLUB 22 - GESTIÓN DE STOCK</p>
          </div>
        </div>
        <Button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-[#C41E3A] hover:bg-[#A01830] text-white h-12 px-6 font-bold"
        >
          + Nuevo Producto
        </Button>
      </div>

      {/* Filtros */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1A1A1A] border-white/10 text-white h-12 w-full focus:border-[#C41E3A] transition-all"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category
                ? "bg-[#C41E3A] hover:bg-[#A01830] text-white border-0"
                : "bg-transparent border-white/10 text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#1A1A1A] border-white/5 p-6 flex items-center gap-4">
          <div className="p-3 bg-[#C41E3A]/10 rounded-xl">
            <Package className="w-6 h-6 text-[#C41E3A]" />
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Productos</p>
            <p className="text-2xl text-white font-bold">{filteredProducts.length}</p>
          </div>
        </Card>
        <Card className="bg-[#1A1A1A] border-white/5 p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Stock Total</p>
            <p className="text-2xl text-white font-bold">{filteredProducts.reduce((sum, p) => sum + (p.stock || 0), 0)}</p>
          </div>
        </Card>
      </div>

      {/* Tabla */}
      <Card className="bg-[#1A1A1A] border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left p-4 text-gray-500 text-xs uppercase font-bold">Producto</th>
                <th className="text-left p-4 text-gray-500 text-xs uppercase font-bold">Categoría</th>
                <th className="text-right p-4 text-gray-500 text-xs uppercase font-bold">Precio Mesa</th>
                <th className="text-right p-4 text-gray-500 text-xs uppercase font-bold">Precio Mostr.</th>
                <th className="text-right p-4 text-gray-500 text-xs uppercase font-bold">Stock</th>
                <th className="text-center p-4 text-gray-500 text-xs uppercase font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 text-white font-medium">{product.name}</td>
                  <td className="p-4">
                    <Badge className={`${getCategoryColor(product.category)} border font-medium`}>
                      {product.category}
                    </Badge>
                  </td>
                  <td className="p-4 text-right text-white font-mono">${(product.price_mesa || 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-white font-mono">${(product.price_mostrador || 0).toLocaleString()}</td>
                  <td className={`p-4 text-right font-bold font-mono ${(product.stock || 0) < 10 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {product.stock || 0}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDelete(product.id)}
                        className="h-8 w-8 text-gray-400 hover:text-[#C41E3A] hover:bg-[#C41E3A]/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-[#161616] border-white/10 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Package className="text-[#C41E3A]" />
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-widest">Nombre del Producto</label>
                <Input name="name" defaultValue={editingProduct?.name} required className="bg-[#0f0f0f] border-white/10 text-white h-11" />
              </div>
              
              <div>
                <label className="block text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-widest">Categoría</label>
                <select 
                  name="category" 
                  defaultValue={editingProduct?.category || "Vinos"}
                  className="w-full bg-[#0f0f0f] border border-white/10 text-white h-11 rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C41E3A]"
                >
                  {categories.filter(c => c !== "Todos").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-widest">Precio Mesa</label>
                  <Input name="price_mesa" type="number" defaultValue={editingProduct?.price_mesa} required className="bg-[#0f0f0f] border-white/10 text-white h-11" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-widest">Precio Mostr.</label>
                  <Input name="price_mostrador" type="number" defaultValue={editingProduct?.price_mostrador} required className="bg-[#0f0f0f] border-white/10 text-white h-11" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-widest">Stock Inicial</label>
                <Input name="stock" type="number" defaultValue={editingProduct?.stock} required className="bg-[#0f0f0f] border-white/10 text-white h-11" />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 border-white/10 text-white hover:bg-white/5">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-[#C41E3A] hover:bg-[#A01830] text-white font-bold">
                  {editingProduct ? 'Actualizar' : 'Crear Producto'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

// Icono faltante en los imports originales
function TrendingUp(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
  )
}