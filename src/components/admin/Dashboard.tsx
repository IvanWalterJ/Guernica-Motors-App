import { useState } from "react";
import { motion } from "motion/react";
import {
  Car,
  Users,
  CalendarDays,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import CustomSelect from "../ui/CustomSelect";
import { useAppContext } from "../../context/AppContext";

// Static historical sales data (for the chart only)
const SALES_DATA_12M = [
  { name: "Abr", ventas: 8, ingresos: 320000 },
  { name: "May", ventas: 10, ingresos: 400000 },
  { name: "Jun", ventas: 15, ingresos: 600000 },
  { name: "Jul", ventas: 12, ingresos: 480000 },
  { name: "Ago", ventas: 18, ingresos: 720000 },
  { name: "Sep", ventas: 14, ingresos: 560000 },
  { name: "Oct", ventas: 20, ingresos: 800000 },
  { name: "Nov", ventas: 16, ingresos: 640000 },
  { name: "Dic", ventas: 22, ingresos: 880000 },
  { name: "Ene", ventas: 11, ingresos: 440000 },
  { name: "Feb", ventas: 17, ingresos: 680000 },
  { name: "Mar", ventas: 20, ingresos: 800000 },
];

const SALES_DATA_1W = [
  { name: "Lun", ventas: 1, ingresos: 45000 },
  { name: "Mar", ventas: 2, ingresos: 90000 },
  { name: "Mié", ventas: 0, ingresos: 0 },
  { name: "Jue", ventas: 3, ingresos: 120000 },
  { name: "Vie", ventas: 5, ingresos: 210000 },
  { name: "Sáb", ventas: 4, ingresos: 160000 },
  { name: "Dom", ventas: 2, ingresos: 85000 },
];

const SALES_DATA_1M = [
  { name: "Sem 1", ventas: 4, ingresos: 165000 },
  { name: "Sem 2", ventas: 6, ingresos: 240000 },
  { name: "Sem 3", ventas: 3, ingresos: 115000 },
  { name: "Sem 4", ventas: 7, ingresos: 280000 },
];

const VIEWS_DATA = [
  { name: "Porsche 911 S", vistas: 1245 },
  { name: "Audi RS e-tron", vistas: 980 },
  { name: "BMW M4 Comp", vistas: 850 },
  { name: "M-Benz G63", vistas: 720 },
  { name: "Range Rover", vistas: 640 },
];

const PERIOD_OPTIONS = [
  { value: "1w", label: "Última semana" },
  { value: "1m", label: "Último mes" },
  { value: "6m", label: "Últimos 6 meses" },
  { value: "12m", label: "Último año" },
];

function formatRelativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora mismo";
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Ayer" : `Hace ${days} días`;
}

export default function Dashboard() {
  const {
    vehicles,
    soldCount,
    totalRevenue,
    leadsCount,
    appointmentsCount,
    availableVehicles,
    leads,
  } = useAppContext();

  const [currency, setCurrency] = useState("USD");
  const [period, setPeriod] = useState("6m");

  const exchangeRate = 1050;

  const reservedCount = vehicles.filter((v) => v.status === "reserved").length;

  const formatCurrency = (value: number) => {
    const amount = currency === "ARS" ? value * exchangeRate : value;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getChartData = () => {
    switch (period) {
      case "1w": return SALES_DATA_1W;
      case "1m": return SALES_DATA_1M;
      case "6m": return SALES_DATA_12M.slice(-6);
      case "12m":
      default: return SALES_DATA_12M;
    }
  };

  const salesChartData = getChartData().map((d) => ({
    ...d,
    ingresos: currency === "ARS" ? d.ingresos * exchangeRate : d.ingresos,
  }));

  const KPI_DATA = [
    {
      title: "Total Vendidos",
      value: soldCount.toString(),
      amount: formatCurrency(totalRevenue),
      trend: "+15%",
      isPositive: true,
      icon: Car,
      accent: "from-white/5 to-transparent border-white/10 hover:border-white/20",
      iconBg: "bg-white/5 border-white/10",
      iconColor: "text-white",
    },
    {
      title: "Ingresos Totales",
      value: formatCurrency(totalRevenue),
      trend: "+8%",
      isPositive: true,
      icon: DollarSign,
      accent: "from-white/5 to-transparent border-white/10 hover:border-white/20",
      iconBg: "bg-white/5 border-white/10",
      iconColor: "text-white",
    },
    {
      title: "Leads Nuevos",
      value: leadsCount.toString(),
      trend: leadsCount > 40 ? "+5%" : "-5%",
      isPositive: leadsCount > 40,
      icon: Users,
      accent: "from-white/5 to-transparent border-white/10 hover:border-white/20",
      iconBg: "bg-white/5 border-white/10",
      iconColor: "text-white",
    },
    {
      title: "Citas Agendadas",
      value: appointmentsCount.toString(),
      trend: appointmentsCount > 20 ? "+12%" : "-3%",
      isPositive: appointmentsCount > 20,
      icon: CalendarDays,
      accent: "from-white/5 to-transparent border-white/10 hover:border-white/20",
      iconBg: "bg-white/5 border-white/10",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Dashboard General</h1>
          <p className="text-gray-500 mt-2 font-light">Resumen de la actividad de tu concesionaria.</p>
        </div>
        <div className="w-48">
          <CustomSelect
            options={[
              { value: "USD", label: "Dólares (USD)" },
              { value: "ARS", label: "Pesos (ARS)" },
            ]}
            value={currency}
            onChange={setCurrency}
          />
        </div>
      </div>

      {/* Inventory Status Summary */}
      <div>
        <h3 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-4">Estado del Inventario</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Disponibles", count: availableVehicles.length, color: "text-white" },
            { label: "Reservados", count: reservedCount, color: "text-red-400" },
            { label: "Vendidos", count: soldCount, color: "text-gray-400" },
        ].map((item) => (
          <div key={item.label} className="glass-card rounded-2xl p-5 text-center border border-white/5">
            <p className={`text-3xl font-light ${item.color}`}>{item.count}</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">{item.label}</p>
          </div>
        ))}
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
            className={`rounded-2xl p-8 bg-gradient-to-br ${kpi.accent} border backdrop-blur-xl`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-xl border ${kpi.iconBg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} strokeWidth={1.5} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full tracking-widest ${
                  kpi.isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-500"
                }`}
              >
                {kpi.isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">{kpi.title}</p>
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-light text-white">{kpi.value}</h3>
                {"amount" in kpi && kpi.amount && (
                  <span className="text-sm text-gray-400 font-light">({kpi.amount})</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sales Evolution Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-8 shadow-[0_0_30px_rgba(220,38,38,0.05)]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400">Evolución de Ventas</h3>
            <div className="w-48">
              <CustomSelect
                options={PERIOD_OPTIONS}
                value={period}
                onChange={setPeriod}
              />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Tooltip
                  cursor={{ stroke: "rgba(34,197,94,0.2)", strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: "rgba(10,10,10,0.95)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    border: "1px solid rgba(34,197,94,0.2)",
                    color: "#fff",
                    boxShadow: "0 0 20px rgba(34,197,94,0.1)"
                  }}
                  formatter={(value: number, name: string) =>
                    name === "ingresos" ? [formatCurrency(value), "Ingresos"] : [value, "Ventas"]
                  }
                />
                <Bar yAxisId="left" dataKey="ventas" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={30} opacity={0.6} />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorIngresos)"
                  activeDot={{ r: 6, fill: "#16a34a", strokeWidth: 0, stroke: "none" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Viewed Vehicles */}
        <div className="glass-card rounded-2xl p-8 shadow-[0_0_30px_rgba(220,38,38,0.05)] flex flex-col">
          <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-8">Vehículos Más Vistos</h3>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {VIEWS_DATA.map((item, index) => {
              // Calculate percentage relative to the highest viewed car
              const maxViews = VIEWS_DATA[0].vistas;
              const width = `${(item.vistas / maxViews) * 100}%`;
              return (
                <div key={item.name} className="relative">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-medium text-white">{item.name}</span>
                    <span className="text-xs text-gray-400 font-light">{item.vistas.toLocaleString()} vistas</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Leads */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.05)]">
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400">Leads Recientes</h3>
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600">
            {leads.length} total
          </span>
        </div>
        <div className="divide-y divide-white/5">
          {leads.length === 0 ? (
            <div className="px-8 py-12 text-center text-gray-600 text-sm font-light">
              No hay leads aún.
            </div>
          ) : (
            leads.slice(0, 8).map((lead) => (
              <div key={lead.id} className="px-8 py-5 flex items-center gap-6 hover:bg-white/[0.03] transition-colors">
                <div className="p-2.5 rounded-full bg-white/5 border border-white/10 flex-shrink-0">
                  <Users className="w-4 h-4 text-red-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white mb-0.5">{lead.name}</p>
                  <p className="text-xs text-gray-500 font-light truncate">{lead.vehicle_interested ?? lead.message}</p>
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600 flex-shrink-0">
                  {lead.created_at ? formatRelativeTime(new Date(lead.created_at).getTime()) : ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
