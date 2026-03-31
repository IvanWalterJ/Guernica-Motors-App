import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Filter, Eye, Edit, Trash2, X, Save } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";

const MOCK_INVENTORY = [
  { id: 1, brand: "Porsche", model: "911 Carrera S", year: 2023, price: 185000, status: "available", daysInStock: 12, views: 145 },
  { id: 2, brand: "Mercedes-Benz", model: "AMG GT", year: 2024, price: 210000, status: "reserved", daysInStock: 5, views: 89 },
  { id: 3, brand: "Audi", model: "RS e-tron GT", year: 2023, price: 165000, status: "available", daysInStock: 2, views: 234 },
  { id: 4, brand: "BMW", model: "M8 Competition", year: 2022, price: 175000, status: "sold", daysInStock: 45, views: 56 },
  { id: 5, brand: "Land Rover", model: "Range Rover", year: 2024, price: 195000, status: "available", daysInStock: 95, views: 12 },
];

export default function Inventory() {
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [selectedVehicle, setSelectedVehicle] = useState<typeof MOCK_INVENTORY[0] | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<typeof MOCK_INVENTORY[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    status: "available"
  });

  const handleEdit = (vehicle: typeof MOCK_INVENTORY[0]) => {
    setEditingVehicle(vehicle);
    setFormData({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      status: vehicle.status
    });
    setIsAddEditModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    setFormData({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      status: "available"
    });
    setIsAddEditModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.brand || !formData.model) return;

    if (editingVehicle) {
      setInventory(inventory.map(v => v.id === editingVehicle.id ? { ...v, ...formData } : v));
    } else {
      const newVehicle = {
        id: Date.now(),
        ...formData,
        daysInStock: 0,
        views: 0
      };
      setInventory([newVehicle, ...inventory]);
    }
    setIsAddEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
      setInventory(inventory.filter(v => v.id !== id));
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.brand.toLowerCase().includes(searchQuery.toLowerCase()) || item.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Inventario</h1>
          <p className="text-gray-500 mt-2 font-light">Gestioná la colección de vehículos.</p>
        </div>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors shadow-lg">
          <Plus className="w-4 h-4" />
          Nuevo Vehículo
        </button>
      </div>

      <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#050505]">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por marca, modelo o VIN..." 
              className="w-full pl-12 pr-4 py-3 bg-[#111111] border border-white/10 rounded-full text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light transition-colors"
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-full sm:w-48">
              <CustomSelect 
                options={[
                  { value: 'all', label: 'Todos los estados' },
                  { value: 'available', label: 'Disponibles' },
                  { value: 'reserved', label: 'Reservados' },
                  { value: 'sold', label: 'Vendidos' }
                ]}
                value={filterStatus}
                onChange={setFilterStatus}
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-transparent border border-white/20 text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white/5 transition-colors w-full sm:w-auto justify-center">
              Exportar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-[#050505] border-b border-white/5">
              <tr>
                <th className="px-8 py-5 font-bold">Vehículo</th>
                <th className="px-8 py-5 font-bold">Precio</th>
                <th className="px-8 py-5 font-bold">Estado</th>
                <th className="px-8 py-5 font-bold">Días en Stock</th>
                <th className="px-8 py-5 font-bold">Vistas</th>
                <th className="px-8 py-5 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg bg-[#111111] flex-shrink-0 overflow-hidden border border-white/5">
                        <img src={`https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=100&sig=${item.id}`} alt="" className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.brand} {item.model}</p>
                        <p className="text-xs text-gray-500 font-light mt-1">Año {item.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-light text-white">
                    USD {item.price.toLocaleString()}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                      item.status === 'available' ? 'bg-white/5 text-white border-white/20' :
                      item.status === 'reserved' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      'bg-gray-800 text-gray-400 border-gray-700'
                    }`}>
                      {item.status === 'available' ? 'Disponible' : item.status === 'reserved' ? 'Reservado' : 'Vendido'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`font-light ${item.daysInStock > 90 ? 'text-red-400' : 'text-gray-400'}`}>
                      {item.daysInStock} días
                    </span>
                  </td>
                  <td className="px-8 py-5 text-gray-400 font-light">
                    {item.views}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setSelectedVehicle(item)}
                        className="p-2 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
                        title="Vista rápida"
                      >
                        <Eye className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-full hover:bg-red-500/10"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-light bg-[#050505]">
          <span>Mostrando 1 a 5 de 24 vehículos</span>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-white/10 rounded-full hover:bg-white/5 disabled:opacity-50 transition-colors uppercase tracking-widest font-bold">Anterior</button>
            <button className="px-4 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors uppercase tracking-widest font-bold text-white">Siguiente</button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVehicle(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10"
            >
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="aspect-video relative bg-[#050505]">
                <img 
                  src={`https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=800&sig=${selectedVehicle.id}`} 
                  alt={`${selectedVehicle.brand} ${selectedVehicle.model}`} 
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border mb-3 ${
                    selectedVehicle.status === 'available' ? 'bg-white/5 text-white border-white/20' :
                    selectedVehicle.status === 'reserved' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                    'bg-gray-800 text-gray-400 border-gray-700'
                  }`}>
                    {selectedVehicle.status === 'available' ? 'Disponible' : selectedVehicle.status === 'reserved' ? 'Reservado' : 'Vendido'}
                  </span>
                  <h2 className="text-3xl font-light text-white">{selectedVehicle.brand} <span className="font-bold italic">{selectedVehicle.model}</span></h2>
                </div>
              </div>
              
              <div className="p-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Precio</p>
                  <p className="text-xl font-light text-white">USD {selectedVehicle.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Año</p>
                  <p className="text-xl font-light text-white">{selectedVehicle.year}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Días en Stock</p>
                  <p className="text-xl font-light text-white">{selectedVehicle.daysInStock}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Vistas</p>
                  <p className="text-xl font-light text-white">{selectedVehicle.views}</p>
                </div>
              </div>
              
              <div className="p-6 border-t border-white/5 bg-[#050505] flex justify-end gap-4">
                <button 
                  onClick={() => setSelectedVehicle(null)}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  Cerrar
                </button>
                <button 
                  onClick={() => {
                    setSelectedVehicle(null);
                    handleEdit(selectedVehicle);
                  }}
                  className="px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                >
                  Editar Vehículo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAddEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsAddEditModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl z-10 p-8"
            >
              <button 
                onClick={() => setIsAddEditModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
              
              <h3 className="text-2xl font-light text-white mb-6">
                {editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-24">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Marca</label>
                  <input 
                    type="text" 
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Modelo</label>
                  <input 
                    type="text" 
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Año</label>
                  <input 
                    type="number" 
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Precio (USD)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Estado</label>
                  <CustomSelect 
                    options={[
                      { value: 'available', label: 'Disponible' },
                      { value: 'reserved', label: 'Reservado' },
                      { value: 'sold', label: 'Vendido' }
                    ]}
                    value={formData.status}
                    onChange={(val) => setFormData({ ...formData, status: val })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
