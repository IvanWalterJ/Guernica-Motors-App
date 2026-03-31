import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAppContext } from "../../context/AppContext";

export default function Finances() {
  const { transactions, addTransaction } = useAppContext();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [filterPeriod, setFilterPeriod] = useState('30');
  const [currency, setCurrency] = useState('USD');
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    category: "venta"
  });
  const exchangeRate = 1250;

  const formatCurrency = (value: number) => {
    const amount = currency === 'ARS' ? value * exchangeRate : value;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  const netMargin = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : '0';

  const stats = [
    { name: 'Ingresos Totales', value: formatCurrency(totalIncome), change: '+100%', trend: 'up' },
    { name: 'Gastos Operativos', value: formatCurrency(totalExpense), change: '-0%', trend: 'down' },
    { name: 'Margen Neto', value: `${netMargin}%`, change: 'Real', trend: 'up' },
    { name: 'Transacciones', value: transactions.length.toString(), change: 'Vivas', trend: 'up' },
  ];

  // Agrupar por mes para el gráfico
  const chartData = transactions.reduce((acc: any[], t) => {
    const month = new Date(t.date).toLocaleDateString('es-AR', { month: 'short' });
    const existing = acc.find(i => i.name === month);
    if (existing) {
      if (t.type === 'income') existing.ingresos += Number(t.amount);
      else existing.gastos += Number(t.amount);
    } else {
      acc.push({ name: month, ingresos: t.type === 'income' ? Number(t.amount) : 0, gastos: t.type === 'expense' ? Number(t.amount) : 0 });
    }
    return acc;
  }, []).reverse().slice(0, 6);

  const handleSaveTransaction = async () => {
    if (!formData.amount || !formData.description) return;
    try {
      await addTransaction({
        ...formData,
        type: transactionType,
        amount: Number(formData.amount)
      });
      setIsTransactionModalOpen(false);
      setFormData({ description: "", amount: "", date: new Date().toISOString().split('T')[0], category: "venta" });
    } catch (error) {
      console.error("Error al guardar transacción:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Finanzas</h1>
          <p className="text-sm text-gray-400 mt-1">Resumen financiero, ingresos y gastos.</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
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
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" />
            Exportar Reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6"
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-gray-400">{stat.name}</p>
              <div className={`p-2 rounded-lg ${stat.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-white">Flujo de Caja</h2>
            <div className="w-48">
              <CustomSelect 
                options={[
                  { value: '30', label: 'Últimos 30 días' },
                  { value: '90', label: 'Últimos 3 meses' },
                  { value: '365', label: 'Este año' }
                ]}
                value={filterPeriod}
                onChange={setFilterPeriod}
              />
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="ingresos" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-6">Acciones Rápidas</h2>
          <div className="space-y-3">
            <button 
              onClick={() => { setTransactionType('income'); setIsTransactionModalOpen(true); }}
              className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 text-green-400 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-white text-sm font-medium">Registrar Ingreso</span>
              </div>
            </button>
            <button 
              onClick={() => { setTransactionType('expense'); setIsTransactionModalOpen(true); }}
              className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 text-red-400 rounded-lg group-hover:bg-red-500/20 transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-white text-sm font-medium">Registrar Gasto</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-medium text-white">Transacciones Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500 bg-white/5">
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Descripción</th>
                <th className="p-4 font-medium">Monto</th>
                <th className="p-4 font-medium">Categoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.slice(0, 10).map((trx) => (
                <tr key={trx.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm text-gray-300">{trx.date}</td>
                  <td className="p-4 text-sm text-white">{trx.description}</td>
                  <td className={`p-4 text-sm font-medium ${trx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount)}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-full border bg-white/5 border-white/10 text-gray-400 uppercase tracking-tighter">
                      {trx.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal */}
      <AnimatePresence>
        {isTransactionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsTransactionModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl z-10 p-8"
            >
              <button 
                onClick={() => setIsTransactionModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
              
              <h3 className="text-2xl font-light text-white mb-6">
                {transactionType === 'income' ? 'Registrar Ingreso' : 'Registrar Gasto'}
              </h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Descripción</label>
                  <input 
                    type="text" 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ej. Venta de vehículo, Pago de servicios..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Monto (USD)</label>
                  <input 
                    type="number" 
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-light text-sm [color-scheme:dark]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Categoría</label>
                    <CustomSelect 
                      options={transactionType === 'income' ? [
                        { value: 'venta', label: 'Venta de Vehículo' },
                        { value: 'reserva', label: 'Reserva' },
                        { value: 'servicio', label: 'Servicio' },
                        { value: 'otro', label: 'Otro' }
                      ] : [
                        { value: 'proveedor', label: 'Pago a Proveedor' },
                        { value: 'mantenimiento', label: 'Mantenimiento' },
                        { value: 'marketing', label: 'Marketing' },
                        { value: 'operativo', label: 'Gasto Operativo' },
                        { value: 'otro', label: 'Otro' }
                      ]}
                      value={formData.category}
                      onChange={(val) => setFormData({ ...formData, category: val })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setIsTransactionModalOpen(false)}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveTransaction}
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
