import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AmbientBackground from "../ui/AmbientBackground";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Small artificial delay for UX feedback
    await new Promise((r) => setTimeout(r, 500));

    const ok = login(user, pass);
    if (ok) {
      navigate("/admin", { replace: true });
    } else {
      setError("Usuario o contraseña incorrectos.");
      setShakeKey((k) => k + 1);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden">
      <AmbientBackground />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black italic tracking-widest uppercase">
            <span className="text-white">GUERNICA</span>
            <span className="text-red-600 ml-3">MOTORS</span>
          </h1>
          <p className="text-[10px] text-gray-500 tracking-[0.3em] uppercase mt-3 font-light">
            Panel de Administración
          </p>
        </div>

        {/* Card — shakes on wrong credentials */}
        <motion.div
          key={shakeKey}
          animate={
            shakeKey > 0
              ? { x: [-10, 10, -8, 8, -4, 4, 0] }
              : { x: 0 }
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="glass-card rounded-3xl p-10 border border-white/10 shadow-[0_0_60px_rgba(220,38,38,0.07)]"
        >
          <div className="mb-8">
            <h2 className="text-xl font-bold italic text-white tracking-tight">
              Acceso <span className="text-gradient-guernica">privado</span>
            </h2>
            <p className="text-xs text-gray-500 font-light mt-1">
              Ingresá con tus credenciales para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={user}
                onChange={(e) => { setUser(e.target.value); setError(""); }}
                autoComplete="username"
                required
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/25 font-light text-sm transition-colors disabled:opacity-50"
                placeholder="Ingresá tu usuario"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={pass}
                onChange={(e) => { setPass(e.target.value); setError(""); }}
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/25 font-light text-sm transition-colors disabled:opacity-50"
                placeholder="Ingresá tu contraseña"
              />
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 text-red-400 text-xs font-light bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-guernica text-white py-3.5 rounded-xl font-bold tracking-widest uppercase text-xs hover:opacity-90 transition-opacity glow-guernica glow-guernica-hover disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                "Ingresar al panel"
              )}
            </button>
          </form>
        </motion.div>

        <p className="text-center text-[10px] text-gray-700 tracking-widest uppercase mt-8 font-light">
          © 2025 Guernica Motors — Todos los derechos reservados
        </p>
      </motion.div>
    </div>
  );
}
