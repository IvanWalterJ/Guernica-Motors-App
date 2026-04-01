import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, ChevronRight, Calendar, Fuel, 
  Zap, Activity, CheckCircle, MessageCircle, 
  ArrowLeft, Share2, Info, X, Clock
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import Footer from "./Footer";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800";

const Spec = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 text-gray-500 uppercase tracking-widest text-[10px] font-bold">
      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
      {label}
    </div>
    <p className="text-white font-light text-lg">{value}</p>
  </div>
);

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVehicleById, vehicles, addLeadAndAppointment, isLoading: contextLoading } = useAppContext();
  
  const [activePhoto, setActivePhoto] = useState(0);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vehicle = getVehicleById(id || "");
  const availableVehicles = vehicles.filter(v => v.status === 'available');

  // Generate next 7 days for scheduling
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const timeSlots = ["09:00", "10:00", "11:00", "15:00", "16:00", "17:00", "18:00"];

  if (contextLoading && !vehicle) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-white text-sm tracking-widest animate-pulse font-light italic">GUERNICA MOTORS | CARGANDO...</div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-8">
        <div className="glass-card max-w-md w-full p-12 text-center rounded-[40px] border border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <Info className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-3xl font-light text-white mb-4 tracking-tight italic">Vehículo no encontrado</h2>
          <p className="text-gray-400 font-light mb-10 leading-relaxed">El vehículo que buscás puede haber sido vendido o removido del catálogo.</p>
          <Link to="/vehiculos" className="inline-flex items-center justify-center px-10 py-5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-200 transition-all shadow-xl">
            Ver Catálogo <ChevronRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const photos = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [FALLBACK_IMAGE];

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !clientName || !clientPhone) return;

    setIsSubmitting(true);
    try {
      const date = nextDays[selectedDate];
      const leadData = {
        name: clientName,
        phone: clientPhone,
        message: `Solicitó visita para ${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
        vehicle_interested: `${vehicle.brand} ${vehicle.model}`
      };
      
      const appointmentData = {
        user_name: clientName,
        user_phone: clientPhone,
        date: date.toISOString().split('T')[0],
        time: selectedTime,
        vehicle_id: vehicle.id
      };

      await addLeadAndAppointment(leadData, appointmentData);
      setIsScheduled(true);
    } catch (error) {
      console.error("Error scheduling:", error);
      alert("Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sameBrand = availableVehicles.filter((v) => v.id !== vehicle.id && v.brand === vehicle.brand);
  const others = availableVehicles.filter((v) => v.id !== vehicle.id && v.brand !== vehicle.brand);
  const similarVehicles = [...sameBrand, ...others].slice(0, 2);

  return (
    <div className="bg-transparent min-h-screen pb-20 relative z-10">
      
      {/* Dynamic Gallery */}
      <div className="relative h-[65vh] min-h-[500px] w-full bg-black overflow-hidden group">
        <div 
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {photos.map((img: string, index: number) => (
            <div key={index} className="min-w-full h-full snap-center relative">
              <img
                src={img}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent" />
        
        {/* Gallery Overlay Controls */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {photos.map((_: any, idx: number) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                activePhoto === idx ? "bg-white w-8 shadow-lg" : "bg-white/20 w-2"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        
        {/* Header Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            
            <section className="text-white">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-6 font-bold">
                <Link to="/vehiculos" className="hover:text-white transition-colors">Catálogo</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white">{vehicle.brand}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4">{vehicle.model}</h1>
              <p className="text-xl text-gray-400 font-light italic">{vehicle.version}</p>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-12 py-12 border-y border-white/5">
              <Spec icon={Calendar} label="Año" value={vehicle.year} />
              <Spec icon={Activity} label="Kilometraje" value={`${vehicle.km.toLocaleString()} km`} />
              <Spec icon={Fuel} label="Combustible" value={vehicle.fuel} />
              <Spec icon={Zap} label="Motor" value={vehicle.engine} />
            </section>

            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-8">Descripción del Vehículo</h3>
              <p className="text-gray-300 text-lg leading-relaxed font-light">{vehicle.description || "Vehículo en estado impecable, listo para entrega inmediata."}</p>
            </section>

            {/* Photos Grid */}
            {photos.length > 1 && (
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-8 italic">Galería Detallada</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {photos.slice(1).map((photo: string, i: number) => (
                    <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-[#111]">
                      <img 
                        src={photo} 
                        alt={`Detalle ${i+1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Action Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              <div className="bg-[#0A0A0A] border border-white/10 rounded-[40px] p-10 shadow-2xl">
                <div className="mb-10 pb-10 border-b border-white/5 text-center">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-bold">Valor de Inversión</p>
                  <p className="text-5xl font-black italic text-white tracking-tighter">USD {vehicle.price.toLocaleString()}</p>
                </div>

                <div className="space-y-8">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <Clock className="w-4 h-4 text-red-600" /> Agendar Cita
                  </h4>
                  
                  <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {nextDays.map((date, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(i)}
                        className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${
                          selectedDate === i ? "bg-red-600 border-transparent text-white" : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold opacity-60">{date.toLocaleDateString("es", { weekday: "short" })}</span>
                        <span className="text-lg font-bold">{date.getDate()}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                          selectedTime === time ? "bg-white text-black border-transparent" : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4">
                    <input 
                      type="text" 
                      placeholder="Nombre Completo" 
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-600 transition-colors font-light"
                    />
                    <input 
                      type="tel" 
                      placeholder="WhatsApp (ej: 11 1234 5678)" 
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-600 transition-colors font-light"
                    />
                  </div>

                  <button
                    onClick={handleSchedule}
                    disabled={isSubmitting || !selectedDate || !selectedTime || !clientName || !clientPhone}
                    className="w-full py-5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-red-700 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Procesando..." : "Confirmar Visita"}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal - THE CENTERED POPUP */}
      <AnimatePresence>
        {isScheduled && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => setIsScheduled(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-[#0E0E0E] border border-white/10 rounded-[50px] p-12 text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-14 h-14 text-green-400" />
              </div>
              <h3 className="text-3xl font-black italic text-white mb-4 tracking-tight">¡CITA AGENDADA!</h3>
              <p className="text-gray-400 font-light text-sm mb-10 leading-relaxed">
                Hemos recibido tu solicitud. Un asesor premium se pondrá en contacto contigo a la brevedad.
              </p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    const date = nextDays[selectedDate!];
                    const dateString = date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
                    const message = `Hola, agendé una visita por el ${vehicle.brand} ${vehicle.model} para el ${dateString} a las ${selectedTime}hs.`;
                    window.open(`https://wa.me/5491160455146?text=${encodeURIComponent(message)}`, "_blank");
                  }}
                  className="w-full py-5 bg-[#25D366] text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hablar con Asesor Ya
                </button>
                <button
                  onClick={() => setIsScheduled(false)}
                  className="w-full py-2 text-gray-600 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
