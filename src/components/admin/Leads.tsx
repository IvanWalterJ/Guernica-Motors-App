import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, MoreVertical, MessageCircle, Phone, Mail, CalendarDays, X, Activity, Car, Clock } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";
import { useAppContext } from "../../context/AppContext";

const COLUMNS = [
  { id: "nuevo", title: "Nuevo", color: "text-white border-white/20 bg-white/5" },
  { id: "contactado", title: "Contactado", color: "text-blue-400 border-blue-400/20 bg-blue-400/5" },
  { id: "negociando", title: "En Negociación", color: "text-purple-400 border-purple-400/20 bg-purple-400/5" },
  { id: "ganado", title: "Ganado", color: "text-green-400 border-green-400/20 bg-green-400/5" },
  { id: "perdido", title: "Perdido", color: "text-red-400 border-red-400/20 bg-red-400/5" },
];

export default function Leads() {
  const { leads, updateLeadStatus, isLoading } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (lead.message || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || lead.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("leadId", leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    if (leadId) {
      await updateLeadStatus(leadId, statusId);
    }
  };

  if (isLoading) return <div className="p-20 text-center text-white animate-pulse">CARGANDO LEADS...</div>;

  return (
    <div className="space-y-8 h-[calc(100vh-11rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Gestión de Leads</h1>
          <p className="text-gray-500 mt-2 font-light">Seguimiento de consultas y citas de venta.</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre..." 
              className="w-full pl-12 pr-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-full text-sm text-white focus:outline-none focus:border-white/30 transition-colors font-light"
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
                    </div>
                    <p className="text-xs text-gray-400 font-light mb-4 truncate">{lead.message || "Sin mensaje adicional"}</p>
                    
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-500 mb-5 font-bold">
                      <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                        <MessageCircle className="w-3 h-3" /> {new Date(lead.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${lead.phone.replace(/\D/g,'')}`, '_blank'); }}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.open(`tel:${lead.phone}`, '_self'); }}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                      >
                        <Phone className="w-4 h-4" strokeWidth={1.5} />
                      </button>
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
              className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl z-10 p-8"
            >
              <button 
                onClick={() => setSelectedLead(null)}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
              
              <h2 className="text-2xl font-light text-white mb-2">{selectedLead.name}</h2>
              <p className="text-sm text-gray-400 font-light mb-8">{selectedLead.phone}</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Mensaje / Interés</h3>
                  <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-white font-light">
                    {selectedLead.message}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Estado del Lead</h3>
                  <CustomSelect 
                    options={COLUMNS.map(col => ({ value: col.id, label: col.title }))}
                    value={selectedLead.status}
                    onChange={(newStatus) => {
                      updateLeadStatus(selectedLead.id, newStatus);
                      setSelectedLead({ ...selectedLead, status: newStatus });
                    }}
                  />
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button 
                    onClick={() => window.open(`https://wa.me/${selectedLead.phone.replace(/\D/g,'')}`, '_blank')}
                    className="flex-1 py-4 bg-[#25D366] text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
