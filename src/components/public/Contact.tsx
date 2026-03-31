import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Phone, Mail, Clock, CheckCircle, Calendar, MessageCircle } from "lucide-react";

export default function Contact() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);

  const handleSchedule = () => {
    if (selectedDate !== null && selectedTime) {
      setIsScheduled(true);
      setTimeout(() => {
        setIsScheduled(false);
        setSelectedDate(null);
        setSelectedTime(null);
      }, 5000);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hola, me gustaría recibir más información sobre sus vehículos.`;
    window.open(`https://wa.me/5491112345678?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Generate next 7 days for the calendar
  const nextDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // Start from tomorrow
    return d;
  });

  const timeSlots = ["10:00", "11:30", "14:00", "15:30", "17:00"];

  return (
    <div className="bg-transparent min-h-screen py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-black italic text-white tracking-tight uppercase mb-6">
            Contactanos
          </h1>
          <p className="text-lg text-gray-400 font-light leading-relaxed">
            Estamos para asesorarte. Visitanos en nuestra agencia en Zona Sur o comunicate a través de nuestros canales digitales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/5 space-y-8">
              <h3 className="text-2xl font-light text-white mb-8 border-b border-white/10 pb-4">Información de Contacto</h3>
              
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-white">
                  <MapPin className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ubicación</h4>
                  <p className="text-lg text-white font-light">Guernica, Zona Sur</p>
                  <p className="text-sm text-gray-400 font-light mt-1">Buenos Aires, Argentina</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-white">
                  <Phone className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Teléfono / WhatsApp</h4>
                  <p className="text-lg text-white font-light">+54 11 1234-5678</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-white">
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</h4>
                  <p className="text-lg text-white font-light">contacto@guernicamotors.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-white">
                  <Clock className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Horarios de Atención</h4>
                  <p className="text-lg text-white font-light">Lunes a Viernes: 09:00 a 19:00 hs</p>
                  <p className="text-lg text-white font-light mt-1">Sábados: 09:00 a 13:00 hs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling & WhatsApp */}
          <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(255,0,255,0.05)] relative overflow-hidden">
            <AnimatePresence>
              {isScheduled && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-[#0A0A0A]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-400 mb-6" />
                  <h3 className="text-2xl font-light text-white mb-2">¡Visita Agendada!</h3>
                  <p className="text-gray-400 font-light">Te esperamos en nuestra agencia. Te enviamos los detalles por email.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-8">
              <h3 className="text-2xl font-light text-white mb-8 border-b border-white/10 pb-4">Agendar Visita a la Agencia</h3>
              
              <div>
                {/* Date Selector */}
                <div className="mb-6">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Seleccionar Día</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {nextDays.map((date, i) => {
                      const isSelected = selectedDate === i;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(i)}
                          className={`flex-shrink-0 w-16 h-20 rounded-xl border flex flex-col items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-white border-white text-black' 
                              : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                          }`}
                        >
                          <span className="text-xs uppercase font-bold">{date.toLocaleDateString('es-AR', { weekday: 'short' })}</span>
                          <span className="text-2xl font-light">{date.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selector */}
                <div className="mb-8">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Seleccionar Horario</p>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time, i) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                            isSelected 
                              ? 'bg-white border-white text-black' 
                              : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={handleSchedule}
                  disabled={selectedDate === null || !selectedTime}
                  className="w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Confirmar Visita
                </button>
              </div>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-widest">O</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button 
                onClick={handleWhatsApp}
                className="w-full py-4 bg-[#25D366] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.2)]"
              >
                <MessageCircle className="w-5 h-5" />
                Contactar por WhatsApp
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
