import { Outlet, Link, useLocation } from "react-router";
import { Home, Utensils, ShoppingCart, Package, BarChart3 } from "lucide-react";
import { POSProvider } from "../context/POSContext";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Inicio" },
    { path: "/counter", icon: ShoppingCart, label: "Mostrador" },
    { path: "/products", icon: Package, label: "Productos" },
    { path: "/reports", icon: BarChart3, label: "Reportes" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname.startsWith("/table/");
    }
    return location.pathname === path;
  };

  return (
    <POSProvider>
      <div className="flex h-screen bg-[#0A0A0A]">
        {/* Sidebar */}
        <aside className="w-20 bg-[#1A1A1A] border-r border-white/10 flex flex-col items-center py-6 space-y-8">
          {/* Logo */}
          <div className="w-12 h-12 bg-[#C41E3A] rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">C22</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                    active
                      ? "bg-[#C41E3A] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
                  }`}
                  title={item.label}
                >
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </Link>
              );
            })}
          </nav>

          {/* User Avatar */}
          <div className="w-12 h-12 rounded-full bg-[#2A2A2A] flex items-center justify-center border border-white/10">
            <span className="text-white text-sm">U</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </POSProvider>
  );
}
