import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, MoreVertical, ChevronLeft, ChevronRight, X, MessageCircle } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";
import { useAppContext } from "../../context/AppContext";

export default function Appointments() {
  const { appointments, isLoading, vehicles } = useAppContext();
  const [filterType, setFilterType] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const filteredAppointments = appointments.filter(apt => {
    const matchesDate = selectedDate ? apt.date === selectedDate.toISOString().split('T')[0] : true;
    return matchesDate;
  });

  if (isLoading) return <div className="p-20 text-center text-white animate-pulse">CARGANDO AGENDA...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Agenda de Visitas</h1>
          <p className="text-gray-500 mt-2 font-light">Controla las citas y test drives programados.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Overview */}
        <div className="lg:col-span-1 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Calendario</h2>
            <div className="flex items-center gap-4">
              <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm text-white font-medium capitalize">
                {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center mb-4">
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(day => (
              <div key={day} className="text-[10px] font-bold text-gray-600 py-1 uppercase">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
              const dateString = date.toISOString().split('T')[0];
              const hasAppointments = appointments.some(apt => apt.date === dateString);
              const isSelected = selectedDate?.toISOString().split('T')[0] === dateString;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(isSelected ? null : date)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all relative ${
                    isSelected ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] font-bold scale-110 z-10' : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {i + 1}
                  {hasAppointments && !isSelected && (
                    <div className="w-1 h-1 rounded-full bg-red-600 absolute bottom-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-white/5 bg-[#050505]">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              {selectedDate ? `Citas para el ${selectedDate.toLocaleDateString('es-ES')}` : 'Resumen de Agenda'}
            </h2>
          </div>
          <div className="divide-y divide-white/5 flex-1 overflow-y-auto max-h-[600px]">
            {filteredAppointments.length === 0 ? (
              <div className="p-20 text-center text-gray-600 font-light italic">
                No hay citas registradas para este periodo.
              </div>
            ) : (
              filteredAppointments.map((apt) => {
                const vehicle = vehicles.find(v => v.id === apt.vehicle_id);
                return (
                  <motion.div 
                    key={apt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center group"
                  >
                    <div className="flex gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-lg leading-none mb-2">{apt.user_name}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 uppercase tracking-widest font-bold">
                          <span className="flex items-center gap-2"><Phone className="w-3 h-3" /> {apt.user_phone}</span>
                          <span className="flex items-center gap-2 text-white"><Clock className="w-3 h-3 text-red-600" /> {apt.time} HS</span>
                          {apt.date && (
                            <span className="flex items-center gap-2 text-red-400">
                              <Calendar className="w-3 h-3" />
                              {new Date(apt.date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()}
                            </span>
                          )}
                        </div>
                        {vehicle && (
                          <div className="mt-4 flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 w-fit">
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Vehículo:</span>
                            <span className="text-xs text-white">{vehicle.brand} {vehicle.model}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <button 
                        onClick={() => window.open(`https://wa.me/${apt.user_phone.replace(/\D/g,'')}`, '_blank')}
                        className="p-4 bg-white/5 text-gray-400 hover:text-white hover:bg-[#25D366] rounded-2xl transition-all"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
