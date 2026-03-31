import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Car, 
  Users, 
  CalendarDays, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  X
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import CustomSelect from "../ui/CustomSelect";

const SALES_DATA = [
  { name: 'Ene', ventas: 8, ingresos: 320000 },
  { name: 'Feb', ventas: 10, ingresos: 400000 },
  { name: 'Mar', ventas: 15, ingresos: 600000 },
  { name: 'Abr', ventas: 12, ingresos: 480000 },
  { name: 'May', ventas: 18, ingresos: 720000 },
  { name: 'Jun', ventas: 20, ingresos: 800000 },
];

const BRAND_DATA = [
  { name: 'Porsche', value: 40 },
  { name: 'Mercedes', value: 30 },
  { name: 'Audi', value: 20 },
  { name: 'BMW', value: 10 },
];

const COLORS = ['#FFFFFF', '#A1A1AA', '#52525B', '#27272A'];

const RECENT_ACTIVITY = [
  { id: 1, action: "Nuevo lead", detail: "Juan Pérez consultó por Porsche 911", time: "Hace 10 min", icon: Users, fullDetails: "El cliente Juan Pérez dejó sus datos de contacto a través del formulario web interesado en el Porsche 911 Carrera S. Solicita información sobre planes de financiación y disponibilidad para test drive." },
  { id: 2, action: "Venta concretada", detail: "Mercedes-Benz AMG GT vendida por $210.000", time: "Hace 2 horas", icon: DollarSign, fullDetails: "Se ha completado la venta del Mercedes-Benz AMG GT a nombre de la empresa TechCorp S.A. El pago se realizó mediante transferencia bancaria y la entrega está programada para el próximo viernes." },
  { id: 3, action: "Cita agendada", detail: "Test drive confirmado para mañana 10:00 AM", time: "Hace 3 horas", icon: CalendarDays, fullDetails: "María Gómez ha confirmado su asistencia para el test drive del Audi RS e-tron GT. El vendedor asignado es Carlos Rodríguez." },
  { id: 4, action: "Nuevo vehículo", detail: "Audi RS e-tron GT ingresado al stock", time: "Ayer", icon: Car, fullDetails: "Se ha completado la revisión técnica y el detallado del Audi RS e-tron GT. El vehículo ya está disponible en el showroom y publicado en el catálogo online." },
];

export default function Dashboard() {
  const [currency, setCurrency] = useState('USD');
  const [selectedActivity, setSelectedActivity] = useState<typeof RECENT_ACTIVITY[0] | null>(null);
  const exchangeRate = 1050; // Example exchange rate

  const formatCurrency = (value: number) => {
    const amount = currency === 'ARS' ? value * exchangeRate : value;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const KPI_DATA = [
    { title: "Ventas del mes", value: "12", amount: formatCurrency(450000), trend: "+15%", isPositive: true, icon: Car },
    { title: "Ingresos netos", value: formatCurrency(125000), trend: "+8%", isPositive: true, icon: DollarSign },
    { title: "Leads nuevos", value: "48", trend: "-5%", isPositive: false, icon: Users },
    { title: "Citas agendadas", value: "24", trend: "+12%", isPositive: true, icon: CalendarDays },
  ];

  const chartData = SALES_DATA.map(data => ({
    ...data,
    ingresos: currency === 'ARS' ? data.ingresos * exchangeRate : data.ingresos
  }));

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Dashboard General</h1>
          <p className="text-gray-500 mt-2 font-light">Resumen de la actividad de tu concesionaria.</p>
        </div>
        <div className="w-48">
          <CustomSelect 
            options={[
              { value: 'USD', label: 'Dólares (USD)' },
              { value: 'ARS', label: 'Pesos (ARS)' }
            ]}
            value={currency}
            onChange={setCurrency}
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_DATA.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-8 shadow-[0_0_30px_rgba(220,38,38,0.05)]"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <kpi.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full tracking-widest ${
                kpi.isPositive ? 'bg-white/10 text-white' : 'bg-red-500/10 text-red-400'
              }`}>
                {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">{kpi.title}</p>
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-light text-white">{kpi.value}</h3>
                {kpi.amount && <span className="text-sm text-gray-500 font-light">({kpi.amount})</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-8 shadow-[0_0_30px_rgba(220,38,38,0.05)]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400">Evolución de Ventas</h3>
            <div className="w-48">
              <CustomSelect 
                options={[
                  { value: '6m', label: 'Últimos 6 meses' },
                  { value: '1y', label: 'Este año' }
                ]}
                value="6m"
                onChange={() => {}}
              />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <Bar yAxisId="left" dataKey="ventas" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="ingresos" stroke="#fff" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#000', stroke: '#fff' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brand Distribution */}
        <div className="glass-card rounded-2xl p-8 shadow-[0_0_30px_rgba(220,38,38,0.05)]">
          <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-8">Ventas por Marca</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={BRAND_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {BRAND_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-4xl font-light text-white">120</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {BRAND_DATA.map((brand, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-sm text-gray-400 font-light">{brand.name}</span>
                </div>
                <span className="text-sm font-medium text-white">{brand.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.05)]">
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400">Actividad Reciente</h3>
          <button className="text-[10px] font-bold tracking-widest uppercase text-white hover:text-gray-300 transition-colors">Ver todo</button>
        </div>
        <div className="divide-y divide-white/5">
          {RECENT_ACTIVITY.map((item, i) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedActivity(item)}
              className="px-8 py-6 flex items-center gap-6 hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <div className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                <item.icon className="w-4 h-4 text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white mb-1">{item.action}</p>
                <p className="text-xs text-gray-500 font-light">{item.detail}</p>
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActivity(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl z-10 p-8"
            >
              <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                  <selectedActivity.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-light text-white">{selectedActivity.action}</h3>
                  <p className="text-sm text-gray-400 font-light">{selectedActivity.time}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-[#111] p-5 rounded-xl border border-white/5">
                  <p className="text-sm text-white font-medium mb-2">Resumen</p>
                  <p className="text-sm text-gray-400 font-light">{selectedActivity.detail}</p>
                </div>
                
                <div className="bg-[#111] p-5 rounded-xl border border-white/5">
                  <p className="text-sm text-white font-medium mb-2">Detalles Completos</p>
                  <p className="text-sm text-gray-400 font-light leading-relaxed">{selectedActivity.fullDetails}</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setSelectedActivity(null)}
                  className="px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
