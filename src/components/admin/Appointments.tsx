import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, MoreVertical, ChevronLeft, ChevronRight, X } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";

const MOCK_APPOINTMENTS = [
  { id: 1, client: "María Gómez", phone: "+54 11 4567-8901", date: "2026-04-02", time: "10:00", type: "Test Drive", vehicle: "Porsche 911 Carrera S", status: "Confirmada" },
  { id: 2, client: "Carlos Rodríguez", phone: "+54 11 2345-6789", date: "2026-04-02", time: "15:30", type: "Asesoramiento", vehicle: "Audi RS Q8", status: "Pendiente" },
  { id: 3, client: "Laura Fernández", phone: "+54 11 3456-7890", date: "2026-04-03", time: "11:00", type: "Entrega", vehicle: "BMW M4 Competition", status: "Confirmada" },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [filterType, setFilterType] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);

  // New Appointment Form State
  const [newAptClient, setNewAptClient] = useState("");
  const [newAptPhone, setNewAptPhone] = useState("");
  const [newAptDate, setNewAptDate] = useState("");
  const [newAptTime, setNewAptTime] = useState("");
  const [newAptType, setNewAptType] = useState("Test Drive");

  const handleSaveNewAppointment = () => {
    if (!newAptClient || !newAptDate || !newAptTime) return;
    
    const newAppointment = {
      id: Date.now(),
      client: newAptClient,
      phone: newAptPhone,
      date: newAptDate,
      time: newAptTime,
      type: newAptType,
      vehicle: "Vehículo a confirmar",
      status: "Pendiente"
    };

    setAppointments([...appointments, newAppointment]);
    setIsNewAppointmentModalOpen(false);
    
    // Reset form
    setNewAptClient("");
    setNewAptPhone("");
    setNewAptDate("");
    setNewAptTime("");
    setNewAptType("Test Drive");
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const filteredAppointments = appointments.filter(apt => {
    const matchesType = filterType === "all" || apt.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesDate = selectedDate ? apt.date === selectedDate.toISOString().split('T')[0] : true;
    return matchesType && matchesDate;
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Citas y Agenda</h1>
          <p className="text-sm text-gray-400 mt-1">Gestiona los test drives, entregas y reuniones.</p>
        </div>
        <button 
          onClick={() => setIsNewAppointmentModalOpen(true)}
          className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          + Nueva Cita
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Overview */}
        <div className="lg:col-span-1 bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-white">Calendario</h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm text-white font-medium">
                {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
              <div key={day} className="text-xs font-medium text-gray-500 py-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
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
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors relative ${
                    isSelected ? 'bg-white text-black font-bold' : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                  {hasAppointments && (
                    <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-black' : 'bg-red-500'}`} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Próximos Días</h3>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
              <span className="text-white text-sm">Hoy</span>
              <span className="bg-[#ff00ff]/20 text-[#ff00ff] text-xs px-2 py-1 rounded-full">
                {appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length} Citas
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
              <span className="text-white text-sm">Mañana</span>
              <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full">
                {appointments.filter(a => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  return a.date === tomorrow.toISOString().split('T')[0];
                }).length} Citas
              </span>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-medium text-white">
              {selectedDate ? `Citas para el ${selectedDate.toLocaleDateString('es-ES')}` : 'Próximas Citas'}
            </h2>
            <div className="w-full sm:w-48">
              <CustomSelect 
                options={[
                  { value: 'all', label: 'Todas las citas' },
                  { value: 'test drive', label: 'Test Drives' },
                  { value: 'entrega', label: 'Entregas' },
                  { value: 'asesoramiento', label: 'Asesoramiento' }
                ]}
                value={filterType}
                onChange={setFilterType}
              />
            </div>
          </div>
          <div className="divide-y divide-white/5 flex-1 overflow-y-auto">
            {filteredAppointments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay citas programadas para esta selección.
              </div>
            ) : (
              filteredAppointments.map((apt) => (
              <motion.div 
                key={apt.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-white/5 transition-colors flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{apt.client}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {apt.phone}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.date} {apt.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="text-white/70">{apt.type}:</span> {apt.vehicle}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className={`px-3 py-1 text-xs rounded-full border ${
                    apt.status === 'Confirmada' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {apt.status}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusChange(apt.id, 'Confirmada')}
                      className={`p-2 rounded-lg transition-colors ${apt.status === 'Confirmada' ? 'text-green-400 bg-green-500/10' : 'text-gray-400 hover:text-green-400 hover:bg-white/10'}`} 
                      title="Confirmar"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleStatusChange(apt.id, 'Cancelada')}
                      className={`p-2 rounded-lg transition-colors ${apt.status === 'Cancelada' ? 'text-red-400 bg-red-500/10' : 'text-gray-400 hover:text-red-400 hover:bg-white/10'}`} 
                      title="Cancelar"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )))}
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {isNewAppointmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsNewAppointmentModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl z-10 p-8"
            >
              <button 
                onClick={() => setIsNewAppointmentModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
              
              <h3 className="text-2xl font-light text-white mb-6">Nueva Cita</h3>
              
              <div className="space-y-4 mb-8 pb-24">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Cliente</label>
                  <input 
                    type="text" 
                    placeholder="Nombre del cliente" 
                    value={newAptClient}
                    onChange={(e) => setNewAptClient(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Teléfono</label>
                  <input 
                    type="tel" 
                    placeholder="+54 9 11..." 
                    value={newAptPhone}
                    onChange={(e) => setNewAptPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha</label>
                    <input 
                      type="date" 
                      value={newAptDate}
                      onChange={(e) => setNewAptDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm [color-scheme:dark]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Hora</label>
                    <input 
                      type="time" 
                      value={newAptTime}
                      onChange={(e) => setNewAptTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm [color-scheme:dark]" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tipo de Cita</label>
                  <CustomSelect 
                    options={[
                      { value: 'Test Drive', label: 'Test Drive' },
                      { value: 'Entrega', label: 'Entrega' },
                      { value: 'Asesoramiento', label: 'Asesoramiento' }
                    ]}
                    value={newAptType}
                    onChange={setNewAptType}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setIsNewAppointmentModalOpen(false)}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveNewAppointment}
                  className="px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                >
                  Guardar Cita
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
