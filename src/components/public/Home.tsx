import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Shield, Zap, Star } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function Home() {
  const { vehicles, isLoading } = useAppContext();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  const featuredVehicles = (vehicles || []).filter(v => v.status === 'available').slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-white text-sm tracking-widest animate-pulse font-light">CARGANDO...</div>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      {/* Cinematic Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            style={{ y }}
            animate={{ scale: [1.05, 1.1, 1.05] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=2560"
            alt="Luxury car"
            className="w-full h-[120%] object-cover opacity-40 -top-[10%] relative"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-transparent to-[#050505]/90" />
          
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-gray-400 mb-6 font-medium">
              Venta de Autos 0KM y Usados
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter text-white mb-8 leading-[0.9]">
              TU PRÓXIMO <br />
              <span className="text-red-600">VEHÍCULO.</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              <Link 
                to="/vehiculos" 
                className="group flex items-center justify-center px-8 py-4 text-xs tracking-widest uppercase font-bold rounded-full text-white bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300 w-full sm:w-auto"
              >
                Ver Catálogo
                <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/financiacion" className="flex items-center justify-center px-8 py-4 text-xs tracking-widest uppercase font-bold rounded-full text-white bg-transparent border border-white/20 hover:bg-white/10 backdrop-blur-md transition-all duration-300 w-full sm:w-auto">
                Financiación
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Minimalist Search */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-full p-2 flex flex-col sm:flex-row items-center shadow-2xl">
          <div className="flex-1 w-full relative flex items-center px-6 py-3">
            <Search className="text-gray-400 w-6 h-6 mr-4" />
            <input 
              type="text" 
              placeholder="Buscar Amarok, Hilux, 208..." 
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 text-xl font-light outline-none"
            />
          </div>
          <button className="w-full sm:w-auto px-10 py-4 bg-red-600 text-white text-sm tracking-widest uppercase font-bold rounded-full hover:opacity-90 transition-opacity mt-2 sm:mt-0">
            Buscar
          </button>
        </div>
      </div>

      {/* Featured Collection */}
      <section className="py-32 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-3 font-bold">Destacados</p>
              <h2 className="text-4xl md:text-5xl font-black italic text-white tracking-tight">MÁS BUSCADOS</h2>
            </div>
            <Link to="/vehiculos" className="text-xs tracking-widest uppercase font-bold text-white border-b border-white/30 pb-1 hover:border-red-600 transition-colors">
              Ver Catálogo Completo
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((car, i) => (
              <Link to={`/vehiculos/${car.id}`} key={car.id}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="bg-[#050505] rounded-2xl overflow-hidden border border-white/5 group cursor-pointer shadow-lg transition-all duration-500 h-full"
                >
                  <div className="block relative aspect-[4/5] overflow-hidden">
                    <img
                      src={car.photos[0] ?? "https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=800"}
                      alt={car.model}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=800"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-8">
                      <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">{car.brand}</p>
                      <h3 className="text-2xl font-bold italic text-white mb-4">{car.model}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-white">USD {car.price.toLocaleString()}</span>
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-red-600 group-hover:border-transparent group-hover:text-white transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Concierge CTA */}
      <section className="py-32 bg-transparent relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black italic text-white mb-8 tracking-tight uppercase">¿No encontrás lo que buscás?</h2>
          <p className="text-lg text-gray-300 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            Contactanos directamente. Te ayudamos a conseguir el auto que querés al mejor precio del mercado.
          </p>
          <a href="https://wa.me/5491160455146" target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-5 bg-white text-black text-xs tracking-widest uppercase font-bold rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Hablar con un asesor
          </a>
        </div>
      </section>
    </div>
  );
}
