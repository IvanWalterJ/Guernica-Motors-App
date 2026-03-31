import { Outlet, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ChatWidget from "./ChatWidget";
import AmbientBackground from "../ui/AmbientBackground";

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent text-white font-sans flex flex-col selection:bg-white selection:text-black relative">
      <AmbientBackground />
      <header className="fixed top-0 w-full z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <span className="text-2xl font-black italic tracking-widest uppercase">
                  <span className="text-white">GUERNICA</span>
                  <span className="text-red-600 ml-2">MOTORS</span>
                </span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-10">
              <Link to="/" className="text-xs tracking-widest uppercase font-medium text-gray-400 hover:text-white transition-colors">Inicio</Link>
              <Link to="/vehiculos" className="text-xs tracking-widest uppercase font-medium text-gray-400 hover:text-white transition-colors">Catálogo</Link>
              <Link to="/pedidos" className="text-xs tracking-widest uppercase font-medium text-gray-400 hover:text-white transition-colors">A Pedido</Link>
              <Link to="/financiacion" className="text-xs tracking-widest uppercase font-medium text-gray-400 hover:text-white transition-colors">Financiación</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/contacto" className="bg-white text-black px-6 py-3 rounded-full text-xs tracking-widest uppercase font-bold hover:bg-gray-200 transition-all">
                Contacto
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0A0A0A] border-b border-white/10 px-4 pt-4 pb-6 space-y-4 shadow-2xl"
          >
            <Link to="/" className="block px-3 py-2 text-sm tracking-widest uppercase text-gray-300 hover:text-white">Inicio</Link>
            <Link to="/vehiculos" className="block px-3 py-2 text-sm tracking-widest uppercase text-gray-300 hover:text-white">Catálogo</Link>
            <Link to="/pedidos" className="block px-3 py-2 text-sm tracking-widest uppercase text-gray-300 hover:text-white">A Pedido</Link>
            <Link to="/financiacion" className="block px-3 py-2 text-sm tracking-widest uppercase text-gray-300 hover:text-white">Financiación</Link>
            <Link to="/contacto" className="block px-3 py-2 text-sm tracking-widest uppercase text-gray-300 hover:text-white">Contacto</Link>
          </motion.div>
        )}
      </header>

      <main className="flex-grow pt-24 relative z-10">
        <Outlet />
      </main>
      
      <ChatWidget />
    </div>
  );
}
