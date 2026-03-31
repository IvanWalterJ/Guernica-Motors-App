import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Filter, Search } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=800";

const PICKUP_KEYWORDS = ["amarok", "hilux", "ranger", "navara", "d-max", "raptor", "pickup", "pick-up", "toro", "oroch"];
const SUV_KEYWORDS = ["suv", "rav4", "cx-5", "tucson", "tiguan", "compass", "pathfinder", "range rover", "x5", "q7", "cayenne", "urus", "defender", "4runner", "patrol", "land cruiser", "captiva", "outlander", "forester", "xv", "cx-30"];

function vehicleMatchesTag(tag: string, brand: string, model: string, condition: string): boolean {
  if (tag === "Todos") return true;
  if (tag === "0KM") return condition === "0km";
  if (tag === "Usados") return condition === "Usado";
  const modelLower = model.toLowerCase();
  if (tag === "Pick-ups") return PICKUP_KEYWORDS.some((kw) => modelLower.includes(kw));
  if (tag === "SUVs") return SUV_KEYWORDS.some((kw) => modelLower.includes(kw) || brand.toLowerCase().includes(kw));
  if (tag === "Autos") {
    const isPickup = PICKUP_KEYWORDS.some((kw) => modelLower.includes(kw));
    const isSuv = SUV_KEYWORDS.some((kw) => modelLower.includes(kw));
    return !isPickup && !isSuv;
  }
  return true;
}

export default function VehicleList() {
  const { availableVehicles } = useAppContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState("Todos");
  const [filters, setFilters] = useState({ minYear: "", maxYear: "", minPrice: "", maxPrice: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const displayed = availableVehicles.filter((vehicle) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      vehicle.brand.toLowerCase().includes(term) ||
      vehicle.model.toLowerCase().includes(term) ||
      vehicle.year.toString().includes(term);

    const matchesTag = vehicleMatchesTag(activeTag, vehicle.brand, vehicle.model, vehicle.condition);

    let matchesAdvanced = true;
    if (filters.minYear && vehicle.year < parseInt(filters.minYear)) matchesAdvanced = false;
    if (filters.maxYear && vehicle.year > parseInt(filters.maxYear)) matchesAdvanced = false;
    if (filters.minPrice && vehicle.price < parseInt(filters.minPrice)) matchesAdvanced = false;
    if (filters.maxPrice && vehicle.price > parseInt(filters.maxPrice)) matchesAdvanced = false;

    return matchesSearch && matchesTag && matchesAdvanced;
  });

  return (
    <div className="bg-transparent min-h-screen py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Search */}
        <div className="flex flex-col items-center justify-center mb-16 space-y-8">
          <h1 className="text-4xl md:text-6xl font-black italic text-white tracking-tight uppercase text-center">
            Encontrá tu <span className="text-gradient-guernica">vehículo</span>
          </h1>

          <div className="w-full max-w-3xl relative">
            <div className="absolute inset-0 bg-gradient-guernica rounded-full blur-xl opacity-20"></div>
            <div className="relative glass-card rounded-full p-2 flex items-center shadow-[0_0_30px_rgba(220,38,38,0.1)]">
              <Search className="text-gray-400 w-6 h-6 ml-4 mr-3" />
              <input
                type="text"
                placeholder="Buscar Amarok, Hilux, Porsche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-white px-2 py-3 focus:outline-none font-light text-lg placeholder-gray-500"
              />
              <button className="bg-gradient-guernica text-white px-8 py-3 rounded-full font-bold tracking-widest uppercase text-xs hover:opacity-90 transition-opacity glow-guernica glow-guernica-hover">
                Buscar
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl glass-card p-6 rounded-3xl border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Año</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Desde"
                    value={filters.minYear}
                    onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Hasta"
                    value={filters.maxYear}
                    onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Precio (USD)</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-sm"
                  />
                </div>
              </div>
            </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {["Todos", "0KM", "Usados", "Pick-ups", "Autos", "SUVs"].map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-6 py-2 rounded-full border transition-all text-sm font-light backdrop-blur-md ${
                  activeTag === tag
                    ? "border-[#dc2626] text-white bg-[#dc2626]/10 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                    : "border-white/10 text-gray-400 hover:text-white hover:border-[#dc2626]/50 bg-[#0A0A0A]/50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Grid */}
        {displayed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayed.map((vehicle, i) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.07, 0.5) }}
                whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
                className="group cursor-pointer bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/5 shadow-lg hover:shadow-[0_10px_30px_rgba(220,38,38,0.15)] transition-all duration-500 animate-shine"
                style={{ perspective: 1000 }}
              >
                <Link to={`/vehiculos/${vehicle.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#050505]">
                    <img
                      src={vehicle.photos[0] ?? FALLBACK_IMAGE}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-90" />
                    <div className="absolute top-4 left-4 bg-gradient-guernica px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg">
                      {vehicle.condition}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">{vehicle.brand}</p>
                        <h3 className="text-xl font-bold italic text-white">{vehicle.model}</h3>
                      </div>
                      <p className="text-xl font-medium text-white">USD {vehicle.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-light border-t border-white/5 pt-4">
                      <span>{vehicle.year}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                      <span>{vehicle.km.toLocaleString()} km</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-light text-white mb-2">No se encontraron vehículos</h3>
            <p className="text-gray-500 font-light">Intentá con otros términos de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
