import { useState } from "react";
import { Save, User, Building, Bell, Shield, Globe } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Configuración</h1>
        <p className="text-sm text-gray-400 mt-1">Administra las preferencias de la agencia y tu cuenta.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            {[
              { id: 'general', name: 'General', icon: Building },
              { id: 'profile', name: 'Perfil', icon: User },
              { id: 'notifications', name: 'Notificaciones', icon: Bell },
              { id: 'security', name: 'Seguridad', icon: Shield },
              { id: 'website', name: 'Sitio Web', icon: Globe },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-xl p-6 md:p-8">
          {activeTab === 'general' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-medium text-white mb-4">Información de la Agencia</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre de la Agencia</label>
                    <input type="text" defaultValue="Guernica Motors" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30 font-light text-sm" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email de Contacto</label>
                      <input type="email" defaultValue="contacto@guernicamotors.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30 font-light text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Teléfono Principal</label>
                      <input type="tel" defaultValue="+54 11 1234-5678" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30 font-light text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Dirección</label>
                    <input type="text" defaultValue="Guernica, Zona Sur, Buenos Aires" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30 font-light text-sm" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${
                    saved ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          )}

          {activeTab !== 'general' && (
            <div className="py-12 text-center">
              <h3 className="text-xl font-light text-white mb-2">Sección en Desarrollo</h3>
              <p className="text-gray-500 text-sm">Las opciones de {activeTab} estarán disponibles próximamente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
