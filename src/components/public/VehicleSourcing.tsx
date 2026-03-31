import { useState } from "react";
import { motion } from "motion/react";
import { Search, Car, ShieldCheck } from "lucide-react";

export default function VehicleSourcing() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-transparent min-h-screen py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-black italic text-white tracking-tight uppercase mb-6">
            Búsqueda <span className="text-gradient-guernica">a Pedido</span>
          </h1>
          <p className="text-lg text-gray-400 font-light leading-relaxed">
            ¿No encontrás el vehículo que buscás en nuestro catálogo? Nuestro equipo de expertos se encarga de buscar, inspeccionar y adquirir el auto de tus sueños a nivel global.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Info Section */}
          <div className="space-y-12">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1600" 
                alt="Búsqueda a Pedido" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="glass-card p-6 rounded-2xl border border-white/5">
                <Search className="w-8 h-8 text-white mb-4" strokeWidth={1.5} />
                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Búsqueda Global</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">Accedemos a redes exclusivas y colecciones privadas en todo el mundo.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/5">
                <ShieldCheck className="w-8 h-8 text-white mb-4" strokeWidth={1.5} />
                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Inspección Rigurosa</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">Verificamos historial, mecánica y estado estético antes de cualquier oferta.</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(220,38,38,0.05)]">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-gradient-guernica rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                  <Car className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-light text-white mb-4">¡Solicitud Recibida!</h3>
                <p className="text-gray-400 font-light leading-relaxed mb-8">
                  Nuestro equipo de búsqueda ya está analizando tu pedido. Nos pondremos en contacto a la brevedad para discutir los detalles y comenzar la búsqueda.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 bg-transparent border border-white/20 text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white/5 transition-colors"
                >
                  Hacer otro pedido
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-xl font-light text-white mb-8 border-b border-white/10 pb-4">Detalles del Vehículo Deseado</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Marca</label>
                    <input required type="text" placeholder="Ej: Porsche" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Modelo</label>
                    <input required type="text" placeholder="Ej: 911 GT3 RS" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-sm transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Año (Aprox)</label>
                    <input type="text" placeholder="Ej: 2022-2024" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Presupuesto Estimado (USD)</label>
                    <input required type="text" placeholder="Ej: 350,000" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-sm transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Especificaciones Adicionales</label>
                  <textarea placeholder="Color preferido, equipamiento específico, kilometraje máximo..." className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-sm transition-colors resize-none" />
                </div>

                <h3 className="text-xl font-light text-white mb-8 border-b border-white/10 pb-4 pt-4">Tus Datos</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre Completo</label>
                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Teléfono / WhatsApp</label>
                    <input required type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm transition-colors" />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 mt-4 bg-gradient-guernica text-white rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                  Enviar Solicitud
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
