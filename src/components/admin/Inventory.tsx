import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Eye, Edit, Trash2, X, ImageOff, ChevronLeft, ChevronRight } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";
import InventoryFormModal from "./InventoryFormModal";
import { useAppContext } from "../../context/AppContext";
import type { Vehicle, VehicleFormData } from "../../types/vehicle";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=400";
const PAGE_SIZE = 8;

const STATUS_LABEL: Record<string, string> = {
  available: "Disponible",
  reserved: "Reservado",
  sold: "Vendido",
};

const STATUS_CLASS: Record<string, string> = {
  available: "bg-white/5 text-white border-white/20",
  reserved: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  sold: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function Inventory() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useAppContext();

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [quickViewPhoto, setQuickViewPhoto] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // ── Filtering & Pagination ──────────────────────────────────────────────────

  const filtered = vehicles.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.brand.toLowerCase().includes(q) ||
      item.model.toLowerCase().includes(q) ||
      item.version.toLowerCase().includes(q);
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (val: string) => {
    setFilterStatus(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  // ── CRUD handlers ───────────────────────────────────────────────────────────

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
    setSelectedVehicle(null);
  };

  const handleSave = (data: VehicleFormData) => {
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, data);
    } else {
      addVehicle(data);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
      deleteVehicle(id);
      if (selectedVehicle?.id === id) setSelectedVehicle(null);
    }
  };

  const openQuickView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setQuickViewPhoto(0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Inventario</h1>
          <p className="text-gray-500 mt-2 font-light">Gestioná la colección de vehículos.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Nuevo Vehículo
        </button>
      </div>

      {/* Table card */}
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#050505]">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar por marca, modelo o versión..."
              className="w-full pl-12 pr-4 py-3 bg-[#111111] border border-white/10 rounded-full text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light transition-colors"
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-full sm:w-48">
              <CustomSelect
                options={[
                  { value: "all", label: "Todos los estados" },
                  { value: "available", label: "Disponibles" },
                  { value: "reserved", label: "Reservados" },
                  { value: "sold", label: "Vendidos" },
                ]}
                value={filterStatus}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        {/* Table */}
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
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-gray-600 font-light">
                    No se encontraron vehículos
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-[#111111] flex-shrink-0 overflow-hidden border border-white/5">
                          <img
                            src={item.photos[0] ?? FALLBACK_IMAGE}
                            alt=""
                            className="w-full h-full object-cover opacity-80"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white">{item.brand} {item.model}</p>
                          <p className="text-xs text-gray-500 font-light mt-1">{item.version} · Año {item.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-light text-white">
                      USD {item.price.toLocaleString()}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${STATUS_CLASS[item.status]}`}>
                        {STATUS_LABEL[item.status]}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`font-light ${item.daysInStock > 90 ? "text-red-400" : "text-gray-400"}`}>
                        {item.daysInStock} días
                      </span>
                    </td>
                    <td className="px-8 py-5 text-gray-400 font-light">{item.views}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openQuickView(item)}
                          className="p-2 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
                          title="Vista rápida"
                        >
                          <Eye className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
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
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-light bg-[#050505]">
          <span>
            {filtered.length === 0
              ? "Sin resultados"
              : `Mostrando ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} de ${filtered.length} vehículos`}
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-white/10 rounded-full hover:bg-white/5 disabled:opacity-40 transition-colors uppercase tracking-widest font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 border border-white/10 rounded-full hover:bg-white/5 disabled:opacity-40 transition-colors uppercase tracking-widest font-bold text-white flex items-center gap-1"
            >
              Siguiente
              <ChevronRight className="w-3 h-3" />
            </button>
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
              className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedVehicle(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo carousel */}
              <div className="aspect-video relative bg-[#050505] flex-shrink-0">
                {selectedVehicle.photos.length > 0 ? (
                  <>
                    <img
                      src={selectedVehicle.photos[quickViewPhoto] ?? FALLBACK_IMAGE}
                      alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                      className="w-full h-full object-cover opacity-90"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    />
                    {selectedVehicle.photos.length > 1 && (
                      <>
                        <button
                          onClick={() => setQuickViewPhoto((p) => (p - 1 + selectedVehicle.photos.length) % selectedVehicle.photos.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/80 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setQuickViewPhoto((p) => (p + 1) % selectedVehicle.photos.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/80 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {selectedVehicle.photos.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setQuickViewPhoto(i)}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${i === quickViewPhoto ? "bg-white w-4" : "bg-white/40"}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-12 h-12 text-gray-700" strokeWidth={1} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 pointer-events-none">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border mb-3 ${STATUS_CLASS[selectedVehicle.status]}`}>
                    {STATUS_LABEL[selectedVehicle.status]}
                  </span>
                  <h2 className="text-3xl font-light text-white">
                    {selectedVehicle.brand} <span className="font-bold italic">{selectedVehicle.model}</span>
                  </h2>
                  {selectedVehicle.version && (
                    <p className="text-sm text-gray-400 font-light mt-1">{selectedVehicle.version}</p>
                  )}
                </div>
              </div>

              {/* Stats grid */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 flex-shrink-0">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Precio</p>
                  <p className="text-lg font-light text-white">USD {selectedVehicle.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Año / KM</p>
                  <p className="text-lg font-light text-white">{selectedVehicle.year} · {selectedVehicle.km.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Días en Stock</p>
                  <p className={`text-lg font-light ${selectedVehicle.daysInStock > 90 ? "text-red-400" : "text-white"}`}>{selectedVehicle.daysInStock}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Vistas</p>
                  <p className="text-lg font-light text-white">{selectedVehicle.views}</p>
                </div>
              </div>

              {/* Description */}
              {selectedVehicle.description && (
                <div className="px-6 pb-4 flex-shrink-0">
                  <p className="text-xs text-gray-400 font-light leading-relaxed border-t border-white/5 pt-4">
                    {selectedVehicle.description}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="p-6 border-t border-white/5 bg-[#050505] flex justify-end gap-4 flex-shrink-0">
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleOpenEdit(selectedVehicle)}
                  className="px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                >
                  Editar Vehículo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <InventoryFormModal
            vehicle={editingVehicle}
            onSave={handleSave}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
