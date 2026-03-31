import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, MoreVertical, MessageCircle, Phone, Mail, CalendarDays, X, Activity, Car, Clock } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";

const INITIAL_LEADS = [
  { id: 1, name: "Juan Pérez", vehicle: "Porsche 911", type: "Test Drive", status: "new", date: "Hoy 10:30", source: "Web", phone: "+54 9 11 1234-5678", email: "juan@example.com", history: [{ action: "Buscó Porsche 911", date: "Hoy 10:15" }, { action: "Solicitó Test Drive", date: "Hoy 10:30" }] },
  { id: 2, name: "María Gómez", vehicle: "Mercedes AMG GT", type: "Consulta", status: "contacted", date: "Ayer", source: "WhatsApp", phone: "+54 9 11 8765-4321", email: "maria@example.com", history: [{ action: "Consultó por WhatsApp", date: "Ayer 15:20" }] },
  { id: 3, name: "Carlos López", vehicle: "Audi RS e-tron", type: "Pedido", status: "negotiating", date: "Hace 2 días", source: "Referido", phone: "+54 9 11 2233-4455", email: "carlos@example.com", history: [{ action: "Referido por cliente", date: "Hace 2 días" }, { action: "Llamada inicial", date: "Ayer" }] },
  { id: 4, name: "Ana Martínez", vehicle: "BMW M8", type: "Test Drive", status: "won", date: "Hace 1 semana", source: "Web", phone: "+54 9 11 5566-7788", email: "ana@example.com", history: [{ action: "Test Drive completado", date: "Hace 1 semana" }, { action: "Reserva confirmada", date: "Hace 3 días" }] },
  { id: 5, name: "Pedro Sánchez", vehicle: "Range Rover", type: "Consulta", status: "lost", date: "Hace 2 semanas", source: "Facebook", phone: "+54 9 11 9988-7766", email: "pedro@example.com", history: [{ action: "Consulta por Facebook", date: "Hace 2 semanas" }, { action: "No respondió seguimiento", date: "Hace 1 semana" }] },
];

const COLUMNS = [
  { id: "new", title: "Nuevo", color: "text-white border-white/20 bg-white/5" },
  { id: "contacted", title: "Contactado", color: "text-blue-400 border-blue-400/20 bg-blue-400/5" },
  { id: "negotiating", title: "En Negociación", color: "text-purple-400 border-purple-400/20 bg-purple-400/5" },
  { id: "won", title: "Ganado", color: "text-green-400 border-green-400/20 bg-green-400/5" },
  { id: "lost", title: "Perdido", color: "text-red-400 border-red-400/20 bg-red-400/5" },
];

export default function Leads() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedLead, setSelectedLead] = useState<typeof INITIAL_LEADS[0] | null>(null);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || lead.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || lead.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDragStart = (e: React.DragEvent, leadId: number) => {
    e.dataTransfer.setData("leadId", leadId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    const leadId = parseInt(e.dataTransfer.getData("leadId"));
    if (leadId) {
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: statusId } : lead
      ));
    }
  };

  return (
    <div className="space-y-8 h-[calc(100vh-11rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Gestión de Leads</h1>
          <p className="text-gray-500 mt-2 font-light">Seguimiento de consultas y oportunidades.</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar lead..." 
              className="w-full pl-12 pr-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-full text-sm text-white focus:outline-none focus:border-white/30 transition-colors font-light"
            />
          </div>
          <div className="w-full sm:w-48">
            <CustomSelect 
              options={[
                { value: 'all', label: 'Todos los tipos' },
                { value: 'Test Drive', label: 'Test Drive' },
                { value: 'Consulta', label: 'Consulta' },
                { value: 'Pedido', label: 'Pedido' }
              ]}
              value={filterType}
              onChange={setFilterType}
            />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max items-start h-full">
          {COLUMNS.map(col => (
            <div 
              key={col.id} 
              className="w-80 flex flex-col bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden h-full"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className={`px-6 py-4 border-b flex justify-between items-center ${col.color.split(' ')[1]} bg-[#050505] flex-shrink-0`}>
                <h3 className={`text-xs font-bold tracking-widest uppercase ${col.color.split(' ')[0]}`}>{col.title}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${col.color.split(' ')[2]} ${col.color.split(' ')[0]}`}>
                  {filteredLeads.filter(l => l.status === col.id).length}
                </span>
              </div>
              
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                {filteredLeads.filter(l => l.status === col.id).map(lead => (
                  <motion.div 
                    key={lead.id}
                    layoutId={`lead-${lead.id}`}
                    draggable
                    onDragStart={(e: any) => handleDragStart(e, lead.id)}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-[#111111] p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-colors cursor-grab active:cursor-grabbing group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-white">{lead.name}</h4>
                      <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-400 font-light mb-4">{lead.vehicle}</p>
                    
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-500 mb-5 font-bold">
                      <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                        {lead.type === 'Test Drive' ? <CalendarDays className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
                        {lead.type}
                      </span>
                      <span>{lead.date}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${lead.phone.replace(/\D/g,'')}`, '_blank'); }}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors" 
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.open(`tel:${lead.phone}`, '_self'); }}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors" 
                        title="Llamar"
                      >
                        <Phone className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.open(`mailto:${lead.email}`, '_blank'); }}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors" 
                        title="Email"
                      >
                        <Mail className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      
                      <div className="ml-auto w-8 h-8 rounded-full bg-[#222] border border-white/10 overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${lead.id}`} alt="Vendedor" className="w-full h-full object-cover opacity-80" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl z-10"
            >
              <div className="p-8 border-b border-white/5 relative z-20">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#222] border border-white/10 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${selectedLead.id}`} alt={selectedLead.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-white">{selectedLead.name}</h2>
                    <p className="text-sm text-gray-400 font-light">{selectedLead.email} • {selectedLead.phone}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-gray-300 flex items-center justify-center text-center">
                    {selectedLead.type}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-gray-300 flex items-center justify-center text-center">
                    Origen: {selectedLead.source}
                  </span>
                  <div className="ml-auto w-48">
                    <CustomSelect 
                      options={COLUMNS.map(col => ({ value: col.id, label: col.title }))}
                      value={selectedLead.status}
                      onChange={(newStatus) => {
                        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: newStatus } : l));
                        setSelectedLead({ ...selectedLead, status: newStatus });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
                    <Car className="w-4 h-4" /> Vehículo de Interés
                  </h3>
                  <div className="bg-[#111] p-4 rounded-xl border border-white/5">
                    <p className="text-lg font-light text-white">{selectedLead.vehicle}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Historial de Actividad
                  </h3>
                  <div className="space-y-4">
                    {selectedLead.history.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="mt-1">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          {index !== selectedLead.history.length - 1 && (
                            <div className="w-px h-full bg-white/10 mx-auto my-1" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-white font-light">{item.action}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" /> {item.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-[#050505] flex justify-end gap-4">
                <button 
                  onClick={() => window.open(`https://wa.me/${selectedLead.phone.replace(/\D/g,'')}`, '_blank')}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
