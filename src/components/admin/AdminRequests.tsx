import { useState } from "react";
import { Search, MessageSquareText, X, Calendar, User, Car, DollarSign, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CustomSelect from "../ui/CustomSelect";

const MOCK_REQUESTS = [
  { id: 1, client: "Carlos Ruiz", contact: "carlos@email.com", vehicle: "Ferrari Testarossa 1988", budget: 150000, status: "pending", notes: "", date: "2026-03-28" },
  { id: 2, client: "Ana Silva", contact: "+54 11 4567-8901", vehicle: "Porsche 911 GT3 RS 2024", budget: 350000, status: "in_progress", notes: "Contactado concesionario en Miami.", date: "2026-03-29" },
  { id: 3, client: "Martín Gómez", contact: "martin@empresa.com", vehicle: "Mercedes-Benz G63 AMG", budget: 250000, status: "acquired", notes: "Vehículo en aduana, entrega estimada en 15 días.", date: "2026-03-20" },
  { id: 4, client: "Laura Torres", contact: "laura@email.com", vehicle: "Bugatti Chiron", budget: 2000000, status: "declined", notes: "Presupuesto insuficiente para el modelo solicitado.", date: "2026-03-25" },
];

export default function AdminRequests() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [noteInput, setNoteInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusChange = (id: number, newStatus: string) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  const handleSaveNote = () => {
    if (selectedRequest) {
      setRequests(requests.map(req => req.id === selectedRequest.id ? { ...req, notes: noteInput } : req));
      setSelectedRequest(null);
    }
  };

  const filteredRequests = requests.filter(req => 
    req.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Pedidos Especiales</h1>
          <p className="text-gray-500 mt-2 font-light">Gestioná las solicitudes de vehículos a pedido.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-[0_0_30px_rgba(255,0,255,0.05)]">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/[0.02]">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" strokeWidth={1.5} />
            <input 
              type="text" 
              placeholder="Buscar por cliente o vehículo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 font-light transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-[#050505]/50 border-b border-white/5">
              <tr>
                <th className="px-8 py-5 font-bold">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" strokeWidth={2} />
                    Fecha
                  </div>
                </th>
                <th className="px-8 py-5 font-bold">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" strokeWidth={2} />
                    Cliente
                  </div>
                </th>
                <th className="px-8 py-5 font-bold">
                  <div className="flex items-center gap-2">
                    <Car className="w-3 h-3" strokeWidth={2} />
                    Vehículo Solicitado
                  </div>
                </th>
                <th className="px-8 py-5 font-bold">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3" strokeWidth={2} />
                    Presupuesto
                  </div>
                </th>
                <th className="px-8 py-5 font-bold">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3" strokeWidth={2} />
                    Estado
                  </div>
                </th>
                <th className="px-8 py-5 font-bold text-right">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5 font-light">{req.date}</td>
                  <td className="px-8 py-5">
                    <p className="font-medium text-white">{req.client}</p>
                    <p className="text-xs text-gray-500 font-light mt-1">{req.contact}</p>
                  </td>
                  <td className="px-8 py-5 font-medium text-white">{req.vehicle}</td>
                  <td className="px-8 py-5 font-light">USD {req.budget.toLocaleString()}</td>
                  <td className="px-8 py-5">
                    <div className="w-40">
                      <CustomSelect 
                        options={[
                          { value: 'pending', label: 'Pendiente' },
                          { value: 'in_progress', label: 'En Progreso' },
                          { value: 'acquired', label: 'Adquirido' },
                          { value: 'declined', label: 'Rechazado' }
                        ]}
                        value={req.status}
                        onChange={(val) => handleStatusChange(req.id, val)}
                      />
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => { setSelectedRequest(req); setNoteInput(req.notes); }}
                      className={`p-2 transition-colors rounded-full hover:bg-white/10 ${req.notes ? 'text-white' : 'text-gray-600'}`}
                      title="Notas Internas"
                    >
                      <MessageSquareText className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 p-8"
            >
              <button 
                onClick={() => setSelectedRequest(null)}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
              
              <h3 className="text-xl font-light text-white mb-2">Notas Internas</h3>
              <p className="text-sm text-gray-400 mb-6">Pedido: <span className="text-white font-medium">{selectedRequest.vehicle}</span> ({selectedRequest.client})</p>
              
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Añadir notas sobre la búsqueda, contactos con concesionarios, etc..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 resize-none font-light text-sm mb-6"
              />
              
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveNote}
                  className="px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                >
                  Guardar Notas
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
