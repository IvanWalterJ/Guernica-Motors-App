import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Filter, Search, ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

const MOCK_VEHICLES = [
  { id: 1, brand: "Volkswagen", model: "Amarok V6 Extreme", year: 2023, km: 15000, price: 48000, condition: "Usado", image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=800" },
  { id: 2, brand: "Toyota", model: "Hilux SRX 4x4", year: 2024, km: 0, price: 45000, condition: "0km", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800" },
  { id: 3, brand: "Peugeot", model: "208 Feline", year: 2023, km: 12000, price: 22000, condition: "Usado", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800" },
  { id: 4, brand: "Fiat", model: "Cronos Precision", year: 2022, km: 25000, price: 18000, condition: "Usado", image: "https://images.unsplash.com/photo-1555353540-64fd8b028b4c?auto=format&fit=crop&q=80&w=800" },
  { id: 5, brand: "Ford", model: "Ranger Raptor", year: 2024, km: 0, price: 60000, condition: "0km", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800" },
  { id: 6, brand: "Volkswagen", model: "Vento GLI", year: 2023, km: 8000, price: 35000, condition: "Usado", image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=800" },
  { id: 7, brand: "Porsche", model: "911 Carrera S", year: 2023, km: 5000, price: 185000, condition: "Usado", image: "https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=800" },
  { id: 8, brand: "Audi", model: "RS e-tron GT", year: 2024, km: 0, price: 145000, condition: "0km", image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=800" },
  { id: 9, brand: "BMW", model: "M4 Competition", year: 2023, km: 12000, price: 120000, condition: "Usado", image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800" },
];

export default function VehicleList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState("Todos");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    minYear: "",
    maxYear: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredVehicles = MOCK_VEHICLES.filter((vehicle) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      vehicle.brand.toLowerCase().includes(term) ||
      vehicle.model.toLowerCase().includes(term) ||
      vehicle.year.toString().includes(term);

    let matchesTag = true;
    if (activeTag === "0KM") matchesTag = vehicle.condition === "0km";
    if (activeTag === "Usados") matchesTag = vehicle.condition === "Usado";
    if (activeTag === "Pick-ups") matchesTag = vehicle.model.includes("Amarok") || vehicle.model.includes("Hilux") || vehicle.model.includes("Ranger");
    if (activeTag === "Autos") matchesTag = vehicle.model.includes("208") || vehicle.model.includes("Cronos") || vehicle.model.includes("Vento");
    // Simplified tag matching for mock data

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
        
        {/* Simplified Header & Search */}
        <div className="flex flex-col items-center justify-center mb-16 space-y-8">
          <h1 className="text-4xl md:text-6xl font-black italic text-white tracking-tight uppercase text-center">
            Encontrá tu <span className="text-gradient-guernica">vehículo</span>
          </h1>
          
          <div className="w-full max-w-3xl relative">
            <div className="absolute inset-0 bg-gradient-guernica rounded-full blur-xl opacity-20"></div>
            <div className="relative glass-card rounded-full p-2 flex items-center shadow-[0_0_30px_rgba(255,0,255,0.1)]">
              <Search className="text-gray-400 w-6 h-6 ml-4 mr-3" />
              <input 
                type="text" 
                placeholder="Buscar Amarok, Hilux, 208..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-white px-2 py-3 focus:outline-none font-light text-lg placeholder-gray-500" 
              />
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="mr-2 p-3 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                title="Filtros Avanzados"
              >
                <Filter className="w-5 h-5" />
              </button>
              <button className="bg-gradient-guernica text-white px-8 py-3 rounded-full font-bold tracking-widest uppercase text-xs hover:opacity-90 transition-opacity glow-guernica glow-guernica-hover">
                Buscar
              </button>
            </div>
          </div>

          {showAdvanced && (
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
                    onChange={(e) => setFilters({...filters, minYear: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-sm" 
                  />
                  <input 
                    type="number" 
                    placeholder="Hasta" 
                    value={filters.maxYear}
                    onChange={(e) => setFilters({...filters, maxYear: e.target.value})}
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
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-sm" 
                  />
                  <input 
                    type="number" 
                    placeholder="Máximo" 
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-sm" 
                  />
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {['Todos', '0KM', 'Usados', 'Pick-ups', 'Autos', 'SUVs'].map(tag => (
              <button 
                key={tag} 
                onClick={() => setActiveTag(tag)}
                className={`px-6 py-2 rounded-full border transition-all text-sm font-light backdrop-blur-md ${
                  activeTag === tag 
                    ? 'border-[#ff00ff] text-white bg-[#ff00ff]/10 shadow-[0_0_15px_rgba(255,0,255,0.2)]' 
                    : 'border-white/10 text-gray-400 hover:text-white hover:border-[#ff00ff]/50 bg-[#0A0A0A]/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle, i) => (
              <motion.div 
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
                className="group cursor-pointer bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/5 shadow-lg hover:shadow-[0_10px_30px_rgba(255,0,255,0.15)] transition-all duration-500 animate-shine"
                style={{ perspective: 1000 }}
              >
                <Link to={`/vehiculos/${vehicle.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#050505]">
                    <img 
                      src={vehicle.image} 
                      alt={`${vehicle.brand} ${vehicle.model}`} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
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
            <p className="text-gray-500 font-light">Intenta con otros términos de búsqueda.</p>
          </div>
        )}
        
        {/* Pagination */}
        {filteredVehicles.length > 0 && (
          <div className="mt-20 flex justify-center">
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors">
              Cargar más vehículos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
