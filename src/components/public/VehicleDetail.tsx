import { useState, useEffect } from "react";
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
  X
} from "lucide-react";

const MOCK_VEHICLES_DB: Record<string, any> = {
  "1": {
    id: 1,
    brand: "Volkswagen",
    model: "Amarok V6 Extreme",
    version: "4Motion Automática",
    year: 2023,
    km: 15000,
    price: 48000,
    condition: "Usado",
    fuel_type: "Diésel",
    transmission: "Automática (8 marchas)",
    doors: 4,
    engine_cc: 3000,
    horsepower: 258,
    color_ext: "Azul Ravenna",
    color_int: "Cuero Negro/Gris",
    description: "La pick-up más potente de su segmento. Combina el confort de un SUV de lujo con la capacidad de carga y tracción de una verdadera 4x4. Único dueño, servicios oficiales al día.",
    features: ["Tracción 4Motion", "Asientos ErgoComfort", "Faros Bi-Xenón", "Llantas 20\"", "Cámara de retroceso", "Navegador GPS", "Climatizador Bi-zona"],
    photos: [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1555353540-64fd8b028b4c?auto=format&fit=crop&q=80&w=1600"
    ]
  },
  "2": {
    id: 2,
    brand: "Toyota",
    model: "Hilux SRX 4x4",
    version: "Automática",
    year: 2024,
    km: 0,
    price: 45000,
    condition: "0km",
    fuel_type: "Diésel",
    transmission: "Automática (6 marchas)",
    doors: 4,
    engine_cc: 2800,
    horsepower: 204,
    color_ext: "Blanco Perlado",
    color_int: "Cuero Negro",
    description: "La leyenda indiscutida. Confiabilidad, robustez y valor de reventa inigualable. Versión tope de gama con todo el equipamiento de seguridad y confort.",
    features: ["Toyota Safety Sense", "Audio JBL", "Faros Bi-LED", "Llantas 18\"", "Cámara 360", "Asientos ventilados", "Arranque por botón"],
    photos: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1600"
    ]
  },
  "3": {
    id: 3,
    brand: "Peugeot",
    model: "208 Feline",
    version: "Tiptronic",
    year: 2023,
    km: 12000,
    price: 22000,
    condition: "Usado",
    fuel_type: "Gasolina",
    transmission: "Automática (6 marchas)",
    doors: 5,
    engine_cc: 1600,
    horsepower: 115,
    color_ext: "Gris Artense",
    color_int: "Tela/Cuero Negro",
    description: "Diseño vanguardista y tecnología de punta. El hatchback más atractivo del mercado con el innovador i-Cockpit 3D. Excelente estado general.",
    features: ["i-Cockpit 3D", "Techo Panorámico", "Faros Full LED", "Cámara 180°", "Carga Inalámbrica", "Llantas 16\""],
    photos: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1555353540-64fd8b028b4c?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1600"
    ]
  },
  "4": {
    id: 4,
    brand: "Fiat",
    model: "Cronos Precision",
    version: "CVT",
    year: 2022,
    km: 25000,
    price: 18000,
    condition: "Usado",
    fuel_type: "Gasolina",
    transmission: "Automática (CVT)",
    doors: 4,
    engine_cc: 1300,
    horsepower: 99,
    color_ext: "Rojo Montecarlo",
    color_int: "Tela Negro",
    description: "El sedán más vendido del país. Espacioso, económico y con un diseño italiano inconfundible. Ideal para la familia o uso diario urbano.",
    features: ["Pantalla 7\" con Apple CarPlay/Android Auto", "Cámara de retroceso", "Climatizador Automático", "Llantas de aleación", "Control de tracción y estabilidad"],
    photos: [
      "https://images.unsplash.com/photo-1555353540-64fd8b028b4c?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1600"
    ]
  },
  "5": {
    id: 5,
    brand: "Ford",
    model: "Ranger Raptor",
    version: "V6 Bi-Turbo",
    year: 2024,
    km: 0,
    price: 60000,
    condition: "0km",
    fuel_type: "Gasolina",
    transmission: "Automática (10 marchas)",
    doors: 4,
    engine_cc: 3000,
    horsepower: 397,
    color_ext: "Naranja Sedona",
    color_int: "Cuero/Alcantara Negro con costuras naranjas",
    description: "Desarrollada por Ford Performance. La pick-up deportiva definitiva, diseñada para dominar cualquier terreno a alta velocidad. Suspensión Fox Racing.",
    features: ["Amortiguadores Fox Racing 2.5\"", "Modo Baja", "Escape Activo", "Pantalla 12\" SYNC 4", "Asientos Deportivos Ford Performance", "Faros Matrix LED"],
    photos: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1600"
    ]
  },
  "6": {
    id: 6,
    brand: "Volkswagen",
    model: "Vento GLI",
    version: "DSG",
    year: 2023,
    km: 8000,
    price: 35000,
    condition: "Usado",
    fuel_type: "Gasolina",
    transmission: "Automática (DSG 7 marchas)",
    doors: 4,
    engine_cc: 2000,
    horsepower: 230,
    color_ext: "Rojo Kings",
    color_int: "Cuero Negro con costuras rojas",
    description: "El sedán deportivo por excelencia. Motor turbo 2.0 TSI y caja DSG para una aceleración y respuesta inmediatas. Diseño agresivo y tecnología superior.",
    features: ["Motor 2.0 TSI", "Caja DSG de 7 velocidades", "Active Info Display", "Techo Solar Panorámico", "Asientos Deportivos GLI", "Llantas 18\""],
    photos: [
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1555353540-64fd8b028b4c?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1600"
    ]
  },
  "7": {
    id: 7,
    brand: "Porsche",
    model: "911 Carrera S",
    version: "PDK",
    year: 2023,
    km: 5000,
    price: 185000,
    condition: "Usado",
    fuel_type: "Gasolina",
    transmission: "Automática (PDK)",
    doors: 2,
    engine_cc: 3000,
    horsepower: 450,
    color_ext: "Gris Ágata Metalizado",
    color_int: "Cuero Negro",
    description: "Una obra maestra de la ingeniería alemana. Este 911 Carrera S ofrece una experiencia de conducción inigualable, combinando lujo absoluto con un rendimiento deportivo extremo. Mantenimiento oficial, estado inmaculado y listo para entregar.",
    features: ["Sport Chrono Package", "Escape Deportivo", "Llantas Carrera S 20/21\"", "Asientos Deportivos Plus", "Bose Surround Sound", "PDLS Plus", "Techo Solar"],
    photos: [
      "https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1611821064430-0d40221e4c98?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1553440569-bfc1015e5c56?auto=format&fit=crop&q=80&w=1600"
    ]
  },
  "8": {
    id: 8,
    brand: "Audi",
    model: "RS e-tron GT",
    version: "Quattro",
    year: 2024,
    km: 0,
    price: 145000,
    condition: "0km",
    fuel_type: "Eléctrico",
    transmission: "Automática (2 marchas)",
    doors: 4,
    engine_cc: 0,
    horsepower: 646,
    color_ext: "Gris Kemora",
    color_int: "Cuero Nappa Fina Negro con costuras rojas",
    description: "El futuro del alto rendimiento. Un Gran Turismo 100% eléctrico que combina un diseño escultural con una aceleración brutal y tecnología de vanguardia.",
    features: ["Tracción Quattro Eléctrica", "Techo de Carbono", "Frenos de Carburo de Tungsteno", "Faros Matrix LED con luz láser", "Sonido Bang & Olufsen 3D", "Suspensión Neumática Adaptativa"],
    photos: [
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1600"
    ]
  },
  "9": {
    id: 9,
    brand: "BMW",
    model: "M4 Competition",
    version: "M xDrive",
    year: 2023,
    km: 12000,
    price: 120000,
    condition: "Usado",
    fuel_type: "Gasolina",
    transmission: "Automática (M Steptronic 8 marchas)",
    doors: 2,
    engine_cc: 3000,
    horsepower: 510,
    color_ext: "Amarillo Sao Paulo",
    color_int: "Cuero Merino Negro/Amarillo",
    description: "Pura adrenalina M. El M4 Competition con tracción M xDrive ofrece un dinamismo excepcional tanto en circuito como en el día a día. Diseño audaz y prestaciones de superdeportivo.",
    features: ["Tracción M xDrive", "Asientos M Carbon Bucket", "Frenos M Compound", "Techo de Carbono", "BMW Live Cockpit Professional", "Head-Up Display"],
    photos: [
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1600"
    ]
  }
};

const DEFAULT_VEHICLE = {
  id: 99,
  brand: "Vehículo",
  model: "Premium",
  version: "Full",
  year: 2024,
  km: 0,
  price: 50000,
  condition: "0km",
  fuel_type: "Gasolina",
  transmission: "Automática",
  doors: 4,
  engine_cc: 2000,
  horsepower: 200,
  color_ext: "A consultar",
  color_int: "A consultar",
  description: "Vehículo premium en excelente estado. Contáctenos para más detalles sobre esta unidad específica.",
  features: ["Climatizador", "Pantalla Táctil", "Llantas de Aleación", "Sensores de Estacionamiento", "Cámara de Retroceso", "Control de Crucero"],
  photos: [
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1555353540-64fd8b028b4c?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1600"
  ]
};

export default function VehicleDetail() {
  const { id } = useParams();
  const [activePhoto, setActivePhoto] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);

  // Calculator State
  const [downPayment, setDownPayment] = useState<number>(0);
  const [months, setMonths] = useState<number>(24);

  // Trade-in Modal State
  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [tradeInData, setTradeInData] = useState({
    brand: '',
    model: '',
    year: '',
    km: '',
    version: ''
  });

  const vehicle = id && MOCK_VEHICLES_DB[id] ? MOCK_VEHICLES_DB[id] : DEFAULT_VEHICLE;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setActivePhoto(0);
    setDownPayment(vehicle.price * 0.3); // Default 30% down payment
  }, [id, vehicle.price]);

  const nextPhoto = () => {
    setActivePhoto((prev) => (prev + 1) % vehicle.photos.length);
  };

  const prevPhoto = () => {
    setActivePhoto((prev) => (prev - 1 + vehicle.photos.length) % vehicle.photos.length);
  };

  const handleSchedule = () => {
    if (selectedDate !== null && selectedTime) {
      const date = nextDays[selectedDate];
      const dateString = date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
      const message = `Hola, me gustaría agendar una visita para ver el ${vehicle.brand} ${vehicle.model} el día ${dateString} a las ${selectedTime}hs.`;
      window.open(`https://wa.me/5491112345678?text=${encodeURIComponent(message)}`, '_blank');

      setIsScheduled(true);
      setTimeout(() => {
        setIsScheduled(false);
        setSelectedDate(null);
        setSelectedTime(null);
      }, 5000);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hola, estoy interesado en el ${vehicle.brand} ${vehicle.model} (${vehicle.year}). Me gustaría recibir más información.`;
    window.open(`https://wa.me/5491112345678?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleTradeInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hola, me interesa el ${vehicle.brand} ${vehicle.model} y quiero entregar mi ${tradeInData.brand} ${tradeInData.model} ${tradeInData.version} (Año ${tradeInData.year}, ${tradeInData.km}km) como parte de pago. ¿Me podrían pasar una cotización aproximada?`;
    window.open(`https://wa.me/5491112345678?text=${encodeURIComponent(message)}`, '_blank');
    setShowTradeInModal(false);
    setTradeInData({ brand: '', model: '', year: '', km: '', version: '' });
  };

  // Generate next 7 days for the calendar
  const nextDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // Start from tomorrow
    return d;
  });

  const timeSlots = ["10:00", "11:30", "14:00", "15:30", "17:00"];

  // Simple loan calculation (mock interest rate)
  const calculateMonthlyPayment = () => {
    const principal = vehicle.price - downPayment;
    if (principal <= 0) return 0;
    const annualInterestRate = 0.15; // 15% annual
    const monthlyInterestRate = annualInterestRate / 12;
    const payment = (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -months));
    return payment.toFixed(0);
  };

  const similarVehicles = Object.values(MOCK_VEHICLES_DB).filter(v => v.id !== vehicle.id).slice(0, 2);

  return (
    <div className="bg-transparent min-h-screen pb-20 relative z-10">
      {/* Immersive Gallery Hero Carousel */}
      <div className="relative h-[60vh] min-h-[500px] w-full bg-[#0A0A0A]/40 backdrop-blur-sm overflow-hidden group">
        <motion.div style={{ y }} className="absolute inset-0 w-full h-[140%] -top-[20%]">
          <AnimatePresence mode="wait">
            <motion.img 
              key={activePhoto}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              src={vehicle.photos[activePhoto]} 
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          </AnimatePresence>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevPhoto}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 hover:scale-110 z-20"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextPhoto}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 hover:scale-110 z-20"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {vehicle.photos.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setActivePhoto(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${
                activePhoto === idx 
                  ? 'bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.8)]' 
                  : 'bg-white/30 w-2 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
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
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-16 text-white">
            
            {/* Header Info */}
            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-4">{vehicle.brand}</p>
              <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4">{vehicle.model}</h1>
              <p className="text-xl text-gray-400 font-light">{vehicle.version}</p>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-white/10 pb-4">Visión General</h2>
              <p className="text-gray-300 leading-relaxed text-lg font-light">{vehicle.description}</p>
            </div>

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
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-white/10 pb-4">Equipamiento</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vehicle.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-4 text-gray-300 font-light">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Calculator */}
            <div className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Calculadora de Financiación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Anticipo (USD)</span>
                      <span className="text-white font-medium">${downPayment.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={vehicle.price} 
                      step="1000"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full accent-[#ff00ff]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Plazo (Meses)</span>
                      <span className="text-white font-medium">{months}</span>
                    </div>
                    <input 
                      type="range" 
                      min="12" 
                      max="60" 
                      step="12"
                      value={months}
                      onChange={(e) => setMonths(Number(e.target.value))}
                      className="w-full accent-[#ff00ff]"
                    />
                  </div>
                </div>
                <div className="bg-[#050505] rounded-2xl p-6 flex flex-col justify-center items-center text-center border border-white/5">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Cuota Estimada</p>
                  <p className="text-4xl font-light text-white mb-2">USD {calculateMonthlyPayment()}</p>
                  <p className="text-[10px] text-gray-500">*Valores de referencia sujetos a aprobación crediticia.</p>
                </div>
              </div>
            </div>

            {/* Gallery Grid */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-white/10 pb-4">Galería Completa</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vehicle.photos.map((photo: string, i: number) => (
                  <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setActivePhoto(i)}>
                    <img src={photo} alt={`Gallery ${i}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Vehicles */}
            {similarVehicles.length > 0 && (
              <div className="pt-12 border-t border-white/10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">Vehículos Similares</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {similarVehicles.map((simVehicle) => (
                    <Link to={`/vehiculos/${simVehicle.id}`} key={simVehicle.id} className="group block">
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                        <img src={simVehicle.photos[0]} alt={simVehicle.model} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      </div>
                      <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-1">{simVehicle.brand}</p>
                      <h3 className="text-lg font-medium text-white mb-1 group-hover:text-[#ff00ff] transition-colors">{simVehicle.model}</h3>
                      <p className="text-sm text-gray-400">USD {simVehicle.price.toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Action Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <div className="glass-card rounded-3xl p-8 shadow-[0_0_30px_rgba(255,0,255,0.1)] relative overflow-hidden">
                <AnimatePresence>
                  {isScheduled && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 bg-[#0A0A0A]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
                    >
                      <CheckCircle className="w-16 h-16 text-green-400 mb-6" />
                      <h3 className="text-2xl font-light text-white mb-2">¡Visita Agendada!</h3>
                      <p className="text-gray-400 font-light text-sm">Te esperamos en nuestra agencia. Te enviamos los detalles por email.</p>
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
                    
                    {/* Date Selector */}
                    <div className="mb-4">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Seleccionar Día</p>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {nextDays.map((date, i) => {
                          const isSelected = selectedDate === i;
                          return (
                            <button
                              key={i}
                              onClick={() => setSelectedDate(i)}
                              className={`flex-shrink-0 w-14 h-16 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                isSelected 
                                  ? 'bg-white border-white text-black' 
                                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                              }`}
                            >
                              <span className="text-[10px] uppercase font-bold">{date.toLocaleDateString('es-AR', { weekday: 'short' })}</span>
                              <span className="text-lg font-light">{date.getDate()}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Selector */}
                    <div className="mb-6">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Seleccionar Horario</p>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time, i) => {
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={i}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                                isSelected 
                                  ? 'bg-white border-white text-black' 
                                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button 
                      onClick={handleSchedule}
                      disabled={selectedDate === null || !selectedTime}
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
              <p className="text-sm text-gray-400 font-light mb-8">Ingresá los datos de tu vehículo actual para recibir una cotización aproximada por WhatsApp.</p>
              
              <form onSubmit={handleTradeInSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Marca</label>
                    <input 
                      required
                      type="text" 
                      value={tradeInData.brand}
                      onChange={e => setTradeInData({...tradeInData, brand: e.target.value})}
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
                      onChange={e => setTradeInData({...tradeInData, model: e.target.value})}
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
                    onChange={e => setTradeInData({...tradeInData, version: e.target.value})}
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
                      onChange={e => setTradeInData({...tradeInData, year: e.target.value})}
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
                      onChange={e => setTradeInData({...tradeInData, km: e.target.value})}
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
