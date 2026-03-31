import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  Car,
  Palette,
  Check,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Clock,
  CheckCircle,
  Calculator,
  X,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=1600";

export default function VehicleDetail() {
  const { id } = useParams();
  const { getVehicleById, incrementViews, availableVehicles, appointmentsCount, setAppointmentsCount, isLoading, addLeadAndAppointment } = useAppContext();

  const vehicle = id ? getVehicleById(id) : undefined;

  const [activePhoto, setActivePhoto] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);

  const [downPayment, setDownPayment] = useState<number>(0);
  const [months, setMonths] = useState<number>(24);

  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [tradeInData, setTradeInData] = useState({
    brand: "",
    model: "",
    year: "",
    km: "",
    version: "",
  });

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center relative z-10">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-white text-sm tracking-widest uppercase font-bold"
        >
          Cargando Vehículo...
        </motion.div>
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────────

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative z-10">
        <div className="glass-card rounded-3xl p-12 max-w-md border border-white/10">
          <Car className="w-16 h-16 text-gray-600 mx-auto mb-6" strokeWidth={1} />
          <h1 className="text-2xl font-light text-white mb-3">Vehículo no encontrado</h1>
          <p className="text-gray-400 font-light mb-8 text-sm">
            El vehículo que buscás no existe o fue removido del catálogo.
          </p>
          <Link
            to="/vehiculos"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
          >
            Ver Catálogo
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const photos = vehicle.photos.length > 0 ? vehicle.photos : [FALLBACK_IMAGE];

  const nextPhoto = () => setActivePhoto((p) => (p + 1) % photos.length);
  const prevPhoto = () => setActivePhoto((p) => (p - 1 + photos.length) % photos.length);

  const nextDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const timeSlots = ["10:00", "11:30", "14:00", "15:30", "17:00"];

  const calculateMonthlyPayment = () => {
    const principal = vehicle.price - downPayment;
    if (principal <= 0) return 0;
    const monthlyRate = 0.15 / 12;
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    return Math.round(payment);
  };

  const handleSchedule = async () => {
    if (selectedDate === null || !selectedTime || !clientName.trim() || !clientPhone.trim()) return;
    
    const date = nextDays[selectedDate];
    const dateString = date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
    
    try {
      // 1. Guardar en Supabase automáticamente
      await addLeadAndAppointment({
        name: clientName.trim(),
        phone: clientPhone.trim(),
        vehicle_interested: `${vehicle.brand} ${vehicle.model}`,
        status: 'nuevo'
      }, {
        appointment_date: date.toISOString().split('T')[0],
        appointment_time: selectedTime,
        vehicle_id: vehicle.id
      });

      // 2. Mostrar Popup de éxito
      setIsScheduled(true);
    } catch (error) {
      console.error("Error agendando cita:", error);
      alert("Hubo un problema al agendar. Por favor, intenta por WhatsApp.");
    }
  };

  const handleWhatsApp = () => {
    const message = `Hola, vengo de la web. Me interesa el ${vehicle.brand} ${vehicle.model}. ¿Podrían darme más información?`;
    window.open(`https://wa.me/5491160455146?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleTradeInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hola, me interesa el ${vehicle.brand} ${vehicle.model} y quiero entregar mi ${tradeInData.brand} ${tradeInData.model} ${tradeInData.version} (Año ${tradeInData.year}, ${tradeInData.km}km) como parte de pago. ¿Me podrían pasar una cotización aproximada?`;
    window.open(`https://wa.me/5491160455146?text=${encodeURIComponent(message)}`, "_blank");
    setShowTradeInModal(false);
    setTradeInData({ brand: "", model: "", year: "", km: "", version: "" });
  };

  // Similar vehicles: same brand first, then fill with other available
  const sameBrand = availableVehicles.filter((v) => v.id !== vehicle.id && v.brand === vehicle.brand);
  const others = availableVehicles.filter((v) => v.id !== vehicle.id && v.brand !== vehicle.brand);
  const similarVehicles = [...sameBrand, ...others].slice(0, 2);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="bg-transparent min-h-screen pb-20 relative z-10">

      {/* Hero Gallery Carousel - Native Scroll Snap for best performance */}
      <div className="relative h-[60vh] min-h-[500px] w-full bg-[#0A0A0A]/40 backdrop-blur-sm overflow-hidden group">
        <div 
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={(e) => {
            const scrollLeft = (e.currentTarget as HTMLDivElement).scrollLeft;
            const width = (e.currentTarget as HTMLDivElement).offsetWidth;
            const index = Math.round(scrollLeft / width);
            if (index !== activePhoto) setActivePhoto(index);
          }}
        >
          {photos.map((img, index) => (
            <div key={index} className="min-w-full h-full snap-center relative">
              <img
                src={img}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

        <button
          onClick={prevPhoto}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 hover:scale-110 z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextPhoto}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 hover:scale-110 z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const gallery = document.querySelector('.snap-x');
                if (gallery) {
                  gallery.scrollTo({ left: idx * gallery.clientWidth, behavior: 'smooth' });
                }
                setActivePhoto(idx);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                activePhoto === idx ? "bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-white/30 w-2 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs tracking-widest uppercase text-gray-500 mb-12 font-medium">
          <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/vehiculos" className="hover:text-white transition-colors">Catálogo</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">{vehicle.brand}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-16 text-white">

            {/* Header */}
            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-4">{vehicle.brand}</p>
              <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4">{vehicle.model}</h1>
              <p className="text-xl text-gray-400 font-light">{vehicle.version}</p>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-white/10 pb-4">Visión General</h2>
                <p className="text-gray-300 leading-relaxed text-lg font-light">{vehicle.description}</p>
              </div>
            )}

            {/* Technical Specs */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-white/10 pb-4">Especificaciones</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-6">
                {[
                  { icon: Calendar, label: "Año", value: vehicle.year },
                  { icon: Gauge, label: "Kilometraje", value: `${vehicle.km.toLocaleString()} km` },
                  { icon: Fuel, label: "Motor", value: vehicle.fuel_type },
                  { icon: Settings2, label: "Transmisión", value: vehicle.transmission },
                  { icon: Car, label: "Potencia", value: `${vehicle.horsepower} CV` },
                  { icon: Palette, label: "Color", value: vehicle.color_ext },
                ].map((spec, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-gray-500">
                      <spec.icon className="w-4 h-4" strokeWidth={1.5} />
                      <span className="text-xs uppercase tracking-widest">{spec.label}</span>
                    </div>
                    <span className="text-lg font-light text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {vehicle.features.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-white/10 pb-4">Equipamiento</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vehicle.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-4 text-gray-300 font-light">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Financing Calculator */}
            <div className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Calculadora de Financiación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                    <div className="flex justify-between items-center text-sm mb-4">
                      <span className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">Anticipo</span>
                      <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-full">USD {downPayment.toLocaleString()}</span>
                    </div>
                    <div className="relative pt-2">
                      <input
                        type="range"
                        min="0"
                        max={vehicle.price}
                        step="1000"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#dc2626]"
                      />
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                    <div className="flex justify-between items-center text-sm mb-4">
                      <span className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">Plazo</span>
                      <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-full">{months} Meses</span>
                    </div>
                    <div className="relative pt-2">
                      <input
                        type="range"
                        min="12"
                        max="60"
                        step="12"
                        value={months}
                        onChange={(e) => setMonths(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#dc2626]"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-900/20 to-black rounded-2xl p-8 flex flex-col justify-center items-center text-center border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
                  <p className="text-[10px] text-red-500 uppercase tracking-widest mb-4 font-bold">Cuota Mensual Estimada</p>
                  <p className="text-5xl font-light text-white mb-4">USD {calculateMonthlyPayment().toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500 mt-2 max-w-[200px] leading-relaxed">*Valores de referencia sujetos a aprobación crediticia y tasas vigentes del mercado.</p>
                </div>
              </div>
            </div>

            {/* Full Gallery Grid */}
            {photos.length > 1 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-white/10 pb-4">Galería Completa</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {photos.map((photo, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer"
                      onClick={() => setActivePhoto(i)}
                    >
                      <img
                        src={photo}
                        alt={`Foto ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Vehicles - Visible ONLY on Desktop here if needed, but better moved below */}
            <div className="hidden lg:block">
              {similarVehicles.length > 0 && (
                <div className="pt-12 border-t border-white/10">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">Vehículos Similares</h2>
                  <div className="grid grid-cols-2 gap-6">
                    {similarVehicles.map((sim) => (
                      <Link to={`/vehiculos/${sim.id}`} key={sim.id} className="group block">
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                          <img
                            src={sim.photos[0] ?? FALLBACK_IMAGE}
                            alt={sim.model}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                          />
                        </div>
                        <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-1">{sim.brand}</p>
                        <h3 className="text-lg font-medium text-white mb-1 group-hover:text-[#dc2626] transition-colors">{sim.model}</h3>
                        <p className="text-sm text-gray-400">USD {sim.price.toLocaleString()}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Action Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <div className="glass-card rounded-3xl p-8 shadow-[0_0_30px_rgba(220,38,38,0.08)] relative overflow-hidden">
                <AnimatePresence>
                  {isScheduled && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 overflow-y-auto"
                    >
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-12 h-12 text-green-400" />
                      </div>
                      <h3 className="text-2xl font-light text-white mb-4">¡Cita Registrada!</h3>
                      <p className="text-gray-400 font-light text-sm mb-8 leading-relaxed">
                        Tus datos han sido recibidos. Un asesor revisará tu solicitud y te contactará a la brevedad.
                      </p>
                      <div className="flex flex-col gap-3 w-full">
                        <button
                          onClick={() => {
                            const date = nextDays[selectedDate!];
                            const dateString = date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
                            const message = `Hola, acabo de agendar una visita para el ${vehicle.brand} ${vehicle.model} el día ${dateString} a las ${selectedTime}hs. Me gustaría confirmar la recepción.`;
                            window.open(`https://wa.me/5491160455146?text=${encodeURIComponent(message)}`, "_blank");
                          }}
                          className="w-full py-4 bg-[#25D366] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Hablar con un asesor ya
                        </button>
                        <button
                          onClick={() => {
                            setIsScheduled(false);
                            setSelectedDate(null);
                            setSelectedTime(null);
                            setClientName("");
                            setClientPhone("");
                          }}
                          className="w-full py-4 bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10"
                        >
                          Volver al detalle
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mb-8 pb-8 border-b border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Valor de Inversión</p>
                  <p className="text-4xl font-light text-white">USD {vehicle.price.toLocaleString()}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Agendar Test Drive / Visita
                    </h3>

                    <div className="mb-4">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Seleccionar Día</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {nextDays.map((date, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(i)}
                            className={`flex-shrink-0 w-14 h-16 rounded-xl border flex flex-col items-center justify-center transition-all ${
                              selectedDate === i
                                ? "bg-white border-white text-black"
                                : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold">
                              {date.toLocaleDateString("es-AR", { weekday: "short" })}
                            </span>
                            <span className="text-lg font-light">{date.getDate()}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Seleccionar Horario</p>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                              selectedTime === time
                                ? "bg-white border-white text-black"
                                : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6 space-y-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Nombre completo"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          placeholder="Teléfono"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSchedule}
                      disabled={selectedDate === null || !selectedTime || !clientName.trim() || !clientPhone.trim()}
                      className="w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Confirmar Visita
                    </button>
                  </div>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-widest">O</span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>

                  <button
                    onClick={handleWhatsApp}
                    className="w-full py-4 bg-[#25D366] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.2)]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Consultar por WhatsApp
                  </button>

                  <button
                    onClick={() => setShowTradeInModal(true)}
                    className="w-full py-4 bg-transparent border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors"
                  >
                    Cotizar mi Usado
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    Un asesor especializado se pondrá en contacto para brindarle atención personalizada.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Similar Vehicles Mobile (Moved to Bottom) */}
        <div className="lg:hidden mt-16 pt-12 border-t border-white/10">
          {similarVehicles.length > 0 && (
            <>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 px-4 text-center">Vehículos Similares</h2>
              <div className="grid grid-cols-1 gap-8 px-4">
                {similarVehicles.map((sim) => (
                  <Link to={`/vehiculos/${sim.id}`} key={sim.id} className="group block glass-card p-4 rounded-3xl border border-white/5 shadow-xl">
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4">
                      <img
                        src={sim.photos[0] ?? FALLBACK_IMAGE}
                        alt={sim.model}
                        className="w-full h-full object-cover opacity-80"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                      />
                    </div>
                    <div className="px-2 pb-2">
                      <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-1">{sim.brand}</p>
                      <h3 className="text-xl font-light text-white mb-2">{sim.model}</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-white">USD {sim.price.toLocaleString()}</p>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Ver detalle</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Trade-in Modal */}
      <AnimatePresence>
        {showTradeInModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setShowTradeInModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-light text-white mb-2">Cotizar mi Usado</h3>
              <p className="text-sm text-gray-400 font-light mb-8">
                Ingresá los datos de tu vehículo actual para recibir una cotización aproximada por WhatsApp.
              </p>

              <form onSubmit={handleTradeInSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Marca</label>
                    <input
                      required
                      type="text"
                      value={tradeInData.brand}
                      onChange={(e) => setTradeInData({ ...tradeInData, brand: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="Ej: Volkswagen"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Modelo</label>
                    <input
                      required
                      type="text"
                      value={tradeInData.model}
                      onChange={(e) => setTradeInData({ ...tradeInData, model: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="Ej: Golf"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Versión</label>
                  <input
                    required
                    type="text"
                    value={tradeInData.version}
                    onChange={(e) => setTradeInData({ ...tradeInData, version: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="Ej: 1.4 TSI Highline"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Año</label>
                    <input
                      required
                      type="number"
                      min="1990"
                      max={new Date().getFullYear()}
                      value={tradeInData.year}
                      onChange={(e) => setTradeInData({ ...tradeInData, year: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="Ej: 2018"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Kilómetros</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={tradeInData.km}
                      onChange={(e) => setTradeInData({ ...tradeInData, km: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="Ej: 65000"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Solicitar Cotización
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
