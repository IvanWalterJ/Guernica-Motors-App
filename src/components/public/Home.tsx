import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Shield, Zap, Star } from "lucide-react";

export default function Home() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

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
          
          {/* Animated Glow Orb */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-guernica rounded-full blur-[120px] mix-blend-screen pointer-events-none"
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
              <span className="text-gradient-guernica">VEHÍCULO.</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              <Link 
                to="/vehiculos" 
                className="group flex items-center justify-center px-8 py-4 text-xs tracking-widest uppercase font-bold rounded-full text-white bg-gradient-guernica glow-guernica glow-guernica-hover transition-all duration-300 w-full sm:w-auto"
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
        <div className="glass-card rounded-full p-2 flex flex-col sm:flex-row items-center shadow-[0_0_40px_rgba(220,38,38,0.15)]">
          <div className="flex-1 w-full relative flex items-center px-6 py-3">
            <Search className="text-gray-400 w-6 h-6 mr-4" />
            <input 
              type="text" 
              placeholder="Buscar Amarok, Hilux, 208..." 
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 text-xl font-light outline-none"
            />
          </div>
          <button className="w-full sm:w-auto px-10 py-4 bg-gradient-guernica text-white text-sm tracking-widest uppercase font-bold rounded-full hover:opacity-90 transition-opacity mt-2 sm:mt-0 glow-guernica glow-guernica-hover">
            Buscar
          </button>
        </div>
      </div>

      {/* Premium Features */}
      <section className="py-32 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            {[
              { icon: Shield, title: "Confianza Total", desc: "Todos nuestros vehículos son revisados exhaustivamente antes de la entrega." },
              { icon: Zap, title: "Financiación a Medida", desc: "Tomamos tu usado al mejor precio y te financiamos la diferencia." },
              { icon: Star, title: "Atención Personalizada", desc: "Te acompañamos en todo el proceso de compra de forma transparente y segura." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-8 text-white group-hover:border-[#dc2626]/50 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-500">
                  <feature.icon className="w-6 h-6 font-light" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium text-white mb-4 tracking-wide">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-light text-sm max-w-xs">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-32 bg-[#0A0A0A]/40 backdrop-blur-sm border-y border-white/5 relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#dc2626]/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-3">Destacados</p>
              <h2 className="text-4xl md:text-5xl font-black italic text-white tracking-tight">MÁS BUSCADOS</h2>
            </div>
            <Link to="/vehiculos" className="text-xs tracking-widest uppercase font-bold text-white border-b border-white/30 pb-1 hover:border-[#dc2626] transition-colors">
              Ver Catálogo Completo
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 1, brand: "Volkswagen", model: "Amarok V6 Extreme", price: "48.000", img: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=800" },
              { id: 2, brand: "Toyota", model: "Hilux SRX 4x4", price: "45.000", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800" },
              { id: 3, brand: "Peugeot", model: "208 Feline", price: "22.000", img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800" }
            ].map((car, i) => (
              <Link to={`/vehiculos/${car.id}`} key={i}>
                <motion.div 
                  whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
                  className="bg-[#050505] rounded-2xl overflow-hidden border border-white/5 group cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(220,38,38,0.15)] transition-all duration-500 animate-shine h-full"
                  style={{ perspective: 1000 }}
                >
                  <div className="block relative aspect-[4/5] overflow-hidden">
                    <img 
                      src={car.img} 
                      alt={car.model} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-8">
                      <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">{car.brand}</p>
                      <h3 className="text-2xl font-bold italic text-white mb-4">{car.model}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-white">USD {car.price}</span>
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-gradient-guernica group-hover:border-transparent group-hover:text-white transition-all">
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
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-guernica rounded-full blur-[150px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black italic text-white mb-8 tracking-tight">¿NO ENCONTRÁS LO QUE BUSCÁS?</h2>
          <p className="text-lg text-gray-300 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            Hablá con nuestro asistente de IA o contactanos directamente. Te ayudamos a conseguir el auto que querés.
          </p>
          <Link to="/contacto" className="inline-block px-10 py-5 bg-white text-black text-xs tracking-widest uppercase font-bold rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Contactar Asesor
          </Link>
        </div>
      </section>
    </div>
  );
}
