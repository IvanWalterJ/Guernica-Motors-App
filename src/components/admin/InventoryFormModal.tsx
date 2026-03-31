import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, Upload, Sparkles, Loader2, Plus, ImageOff } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";
import { generateVehicleDescription } from "../../lib/gemini";
import type { Vehicle, VehicleFormData, FuelType, VehicleStatus, VehicleCondition } from "../../types/vehicle";

const MAX_PHOTOS = 8;
const MAX_IMAGE_WIDTH = 800;
const IMAGE_QUALITY = 0.72;

interface Props {
  vehicle: Vehicle | null;
  onSave: (data: VehicleFormData) => void;
  onClose: () => void;
}

function buildFormData(vehicle: Vehicle | null): VehicleFormData {
  if (vehicle) {
    const { id: _id, daysInStock: _d, views: _v, createdAt: _c, ...rest } = vehicle;
    return rest;
  }
  return {
    brand: "",
    model: "",
    version: "",
    year: new Date().getFullYear(),
    status: "available",
    condition: "Usado",
    km: 0,
    price: 0,
    fuel_type: "Gasolina",
    transmission: "",
    doors: 4,
    engine_cc: 0,
    horsepower: 0,
    color_ext: "",
    color_int: "",
    description: "",
    features: [],
    photos: [],
  };
}

// Compress an image file to a base64 data URL
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, MAX_IMAGE_WIDTH / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("canvas")); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
      };
      img.onerror = reject;
      img.src = src;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm placeholder-gray-600";
const labelCls = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2";

export default function InventoryFormModal({ vehicle, onSave, onClose }: Props) {
  const [form, setForm] = useState<VehicleFormData>(() => buildFormData(vehicle));
  const [featureInput, setFeatureInput] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = useCallback(<K extends keyof VehicleFormData>(key: K, val: VehicleFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  }, []);

  // ── Features ──────────────────────────────────────────────────────────────────

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    const parts = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
    set("features", [...form.features, ...parts]);
    setFeatureInput("");
  };

  const removeFeature = (i: number) => {
    set("features", form.features.filter((_, idx) => idx !== i));
  };

  // ── Photo upload ──────────────────────────────────────────────────────────────

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = MAX_PHOTOS - form.photos.length;
    if (remaining <= 0) return;
    setIsUploadingPhoto(true);
    const selected = Array.from(files).slice(0, remaining);
    try {
      const compressed = await Promise.all(selected.map(compressImage));
      set("photos", [...form.photos, ...compressed]);
    } catch {
      // silently ignore failed files
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = (i: number) => {
    set("photos", form.photos.filter((_, idx) => idx !== i));
  };

  // ── AI Description ────────────────────────────────────────────────────────────

  const handleEnhance = async () => {
    setIsEnhancing(true);
    setAiError(null);
    try {
      const result = await generateVehicleDescription(
        {
          brand: form.brand,
          model: form.model,
          version: form.version,
          year: form.year,
          km: form.km,
          condition: form.condition,
          fuel_type: form.fuel_type,
          transmission: form.transmission,
          horsepower: form.horsepower,
          engine_cc: form.engine_cc,
          color_ext: form.color_ext,
          features: form.features,
        },
        form.description
      );
      set("description", result);
    } catch {
      setAiError("No se pudo conectar con la IA. Verificá tu conexión.");
    } finally {
      setIsEnhancing(false);
    }
  };

  // ── Save ──────────────────────────────────────────────────────────────────────

  const handleSave = () => {
    if (!form.brand.trim() || !form.model.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl z-10 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 flex-shrink-0">
          <h3 className="text-2xl font-light text-white">
            {vehicle ? "Editar Vehículo" : "Nuevo Vehículo"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-8">

          {/* ── Basic Info ── */}
          <section>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Información Básica</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Marca *</label>
                <input className={inputCls} value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Ej: Porsche" />
              </div>
              <div>
                <label className={labelCls}>Modelo *</label>
                <input className={inputCls} value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="Ej: 911 Carrera S" />
              </div>
              <div>
                <label className={labelCls}>Versión</label>
                <input className={inputCls} value={form.version} onChange={(e) => set("version", e.target.value)} placeholder="Ej: PDK" />
              </div>
              <div>
                <label className={labelCls}>Año</label>
                <input type="number" className={inputCls} value={form.year} onChange={(e) => set("year", parseInt(e.target.value) || new Date().getFullYear())} />
              </div>
              <div>
                <label className={labelCls}>Estado</label>
                <CustomSelect
                  options={[
                    { value: "available", label: "Disponible" },
                    { value: "reserved", label: "Reservado" },
                    { value: "sold", label: "Vendido" },
                  ]}
                  value={form.status}
                  onChange={(v) => set("status", v as VehicleStatus)}
                />
              </div>
              <div>
                <label className={labelCls}>Condición</label>
                <CustomSelect
                  options={[
                    { value: "Usado", label: "Usado" },
                    { value: "0km", label: "0 km" },
                  ]}
                  value={form.condition}
                  onChange={(v) => set("condition", v as VehicleCondition)}
                />
              </div>
              <div>
                <label className={labelCls}>Kilómetros</label>
                <input type="number" className={inputCls} value={form.km} onChange={(e) => set("km", parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className={labelCls}>Precio (USD)</label>
                <input type="number" className={inputCls} value={form.price} onChange={(e) => set("price", parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </section>

          {/* ── Technical Specs ── */}
          <section>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Ficha Técnica</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Combustible</label>
                <CustomSelect
                  options={[
                    { value: "Gasolina", label: "Gasolina" },
                    { value: "Diésel", label: "Diésel" },
                    { value: "Eléctrico", label: "Eléctrico" },
                    { value: "Híbrido", label: "Híbrido" },
                    { value: "GNC", label: "GNC" },
                  ]}
                  value={form.fuel_type}
                  onChange={(v) => set("fuel_type", v as FuelType)}
                />
              </div>
              <div>
                <label className={labelCls}>Transmisión</label>
                <input className={inputCls} value={form.transmission} onChange={(e) => set("transmission", e.target.value)} placeholder="Ej: Automática (PDK)" />
              </div>
              <div>
                <label className={labelCls}>Puertas</label>
                <input type="number" className={inputCls} value={form.doors} onChange={(e) => set("doors", parseInt(e.target.value) || 4)} min={2} max={5} />
              </div>
              <div>
                <label className={labelCls}>Cilindrada (cc) — 0 para eléctrico</label>
                <input type="number" className={inputCls} value={form.engine_cc} onChange={(e) => set("engine_cc", parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className={labelCls}>Potencia (CV)</label>
                <input type="number" className={inputCls} value={form.horsepower} onChange={(e) => set("horsepower", parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className={labelCls}>Color Exterior</label>
                <input className={inputCls} value={form.color_ext} onChange={(e) => set("color_ext", e.target.value)} placeholder="Ej: Gris Ágata Metalizado" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Color Interior</label>
                <input className={inputCls} value={form.color_int} onChange={(e) => set("color_int", e.target.value)} placeholder="Ej: Cuero Negro" />
              </div>
            </div>
          </section>

          {/* ── Features ── */}
          <section>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Equipamiento</h4>
            <div className="flex gap-3 mb-3">
              <input
                className={inputCls + " flex-1"}
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
                placeholder="Ej: Techo Solar, Faros LED (Enter o coma para separar)"
              />
              <button
                type="button"
                onClick={addFeature}
                className="p-3 bg-white/10 border border-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex-shrink-0"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
            {form.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.features.map((feat, i) => (
                  <span key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white text-xs px-3 py-1.5 rounded-full font-light">
                    {feat}
                    <button type="button" onClick={() => removeFeature(i)} className="text-gray-500 hover:text-white transition-colors">
                      <X className="w-3 h-3" strokeWidth={2} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* ── Description ── */}
          <section>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Descripción</h4>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describí el estado y características destacadas del vehículo..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm placeholder-gray-600 resize-none"
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={handleEnhance}
                disabled={isEnhancing || (!form.brand && !form.model)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(220,38,38,0.2)]"
              >
                {isEnhancing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                )}
                {isEnhancing ? "Mejorando..." : "Mejorar con IA"}
              </button>
              {aiError && <p className="text-xs text-red-400 font-light">{aiError}</p>}
              {!form.brand && !form.model && (
                <p className="text-xs text-gray-600 font-light">Completá la marca y modelo primero</p>
              )}
            </div>
          </section>

          {/* ── Photos ── */}
          <section>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Fotos del Vehículo</h4>
            <p className="text-[10px] text-gray-600 mb-4">
              Máximo {MAX_PHOTOS} fotos · Las imágenes se comprimen automáticamente · Formatos: JPG, PNG, WebP
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFilesSelected(e.target.files)}
            />

            {/* Upload button */}
            {form.photos.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="w-full border-2 border-dashed border-white/10 hover:border-white/25 rounded-2xl py-8 flex flex-col items-center justify-center gap-3 transition-colors group mb-4 disabled:opacity-50"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 text-gray-500 group-hover:text-gray-300 transition-colors" strokeWidth={1.5} />
                )}
                <span className="text-xs text-gray-500 group-hover:text-gray-300 font-light transition-colors">
                  {isUploadingPhoto ? "Procesando imágenes..." : "Hacer clic o arrastrar fotos aquí"}
                </span>
                <span className="text-[10px] text-gray-600 font-light">
                  {MAX_PHOTOS - form.photos.length} foto{MAX_PHOTOS - form.photos.length !== 1 ? "s" : ""} restante{MAX_PHOTOS - form.photos.length !== 1 ? "s" : ""}
                </span>
              </button>
            )}

            {/* Photo grid */}
            {form.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {form.photos.map((photo, i) => (
                  <div key={i} className="relative group aspect-video rounded-xl overflow-hidden bg-[#111] border border-white/5">
                    <img
                      src={photo}
                      alt={`Foto ${i + 1}`}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center">
                      <ImageOff className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                    </div>
                    {i === 0 && (
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                        Principal
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                    >
                      <X className="w-3 h-3" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sticky footer */}
        <div className="flex items-center justify-end gap-4 px-8 py-5 border-t border-white/5 bg-[#050505] rounded-b-3xl flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!form.brand.trim() || !form.model.trim()}
            className="px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
