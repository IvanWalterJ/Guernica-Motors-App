import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calculator, Percent, Clock, CreditCard } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";

export default function Financing() {
  const [selectedTerm, setSelectedTerm] = useState("24");
  const [vehicleValue, setVehicleValue] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [currency, setCurrency] = useState("USD");

  const calculatePayment = () => {
    const value = parseFloat(vehicleValue);
    const down = parseFloat(downPayment);
    const months = parseInt(selectedTerm);
    
    if (isNaN(value) || isNaN(down) || isNaN(months) || value <= down) {
      setMonthlyPayment(null);
      return;
    }

    const principal = value - down;
    // Higher interest rate for ARS due to inflation
    const annualInterestRate = currency === 'ARS' ? 0.65 : 0.15; 
    const monthlyInterestRate = annualInterestRate / 12;
    
    // Amortization formula
    const payment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) / (Math.pow(1 + monthlyInterestRate, months) - 1);
    
    setMonthlyPayment(Math.round(payment));
  };
  return (
    <div className="bg-transparent min-h-screen py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-black italic text-white tracking-tight uppercase mb-6">
            Financiación a tu <span className="text-gradient-guernica">Medida</span>
          </h1>
          <p className="text-lg text-gray-400 font-light leading-relaxed">
            Hacemos posible que alcances tu próximo vehículo con planes de financiación flexibles, tasas preferenciales y aprobación rápida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { icon: Percent, title: "Tasas Competitivas", desc: "Trabajamos con las principales entidades financieras para ofrecerte la mejor tasa." },
            { icon: Clock, title: "Aprobación Rápida", desc: "Proceso ágil y simplificado. Obtené tu pre-aprobación en menos de 24 horas." },
            { icon: Calculator, title: "Cuotas Fijas", desc: "Planificá tu economía con cuotas fijas y en pesos durante todo el crédito." },
            { icon: CreditCard, title: "Múltiples Opciones", desc: "Créditos prendarios, leasing y opciones personalizadas según tu perfil." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl border border-white/5 text-center group hover:border-white/20 transition-colors"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-6 text-white group-hover:bg-gradient-guernica transition-colors">
                <feature.icon className="w-8 h-8 font-light" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
              <p className="text-gray-500 font-light text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto glass-card rounded-3xl border border-white/10 p-8 md:p-12 shadow-[0_0_40px_rgba(220,38,38,0.05)]">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-light text-white mb-4">Simulador de Crédito</h2>
            <p className="text-gray-400 font-light text-sm">Calculá un estimado de tus cuotas. Sujeto a aprobación crediticia.</p>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Moneda</label>
                <CustomSelect 
                  options={[
                    { value: 'USD', label: 'Dólares (USD)' },
                    { value: 'ARS', label: 'Pesos (ARS)' }
                  ]}
                  value={currency}
                  onChange={setCurrency}
                  className="w-full"
                  buttonClassName="px-4 py-4 text-lg rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Valor del Vehículo</label>
                <input 
                  type="number" 
                  value={vehicleValue}
                  onChange={(e) => setVehicleValue(e.target.value)}
                  placeholder="Ej: 25000" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-lg transition-colors" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Anticipo</label>
                <input 
                  type="number" 
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="Ej: 10000" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-light text-lg transition-colors" 
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Plazo (Meses)</label>
              <CustomSelect 
                options={[
                  { value: '12', label: '12 Meses' },
                  { value: '24', label: '24 Meses' },
                  { value: '36', label: '36 Meses' },
                  { value: '48', label: '48 Meses' },
                  { value: '60', label: '60 Meses' }
                ]}
                value={selectedTerm}
                onChange={setSelectedTerm}
                className="w-full"
                buttonClassName="px-4 py-4 text-lg rounded-xl"
              />
            </div>

            <div className="pt-6 border-t border-white/10">
              <button 
                type="button" 
                onClick={calculatePayment}
                className="w-full py-5 bg-gradient-guernica text-white rounded-full text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(220,38,38,0.2)]"
              >
                Calcular Cuotas
              </button>
            </div>

            <AnimatePresence>
              {monthlyPayment !== null && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 pt-8 border-t border-white/10 text-center overflow-hidden"
                >
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Cuota Mensual Estimada</p>
                  <p className="text-5xl font-light text-white">{currency} {monthlyPayment.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-4 font-light">
                    *Cálculo basado en una tasa de interés anual estimada del {currency === 'ARS' ? '65%' : '15%'}. Sujeto a evaluación crediticia.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
