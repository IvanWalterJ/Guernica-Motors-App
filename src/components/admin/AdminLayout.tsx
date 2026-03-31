import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CarFront, 
  Users, 
  CalendarDays, 
  Wallet, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  X,
  Check
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import AmbientBackground from "../ui/AmbientBackground";

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Inventario', href: '/admin/inventario', icon: CarFront },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Pedidos Especiales', href: '/admin/pedidos', icon: ClipboardList },
  { name: 'Citas', href: '/admin/citas', icon: CalendarDays },
  { name: 'Finanzas', href: '/admin/finanzas', icon: Wallet },
  { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
];

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'lead' | 'appointment' | 'system';
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nuevo Lead Recibido',
      message: 'María Gómez ha consultado por el Porsche 911 Carrera S.',
      time: 'Hace 5 min',
      read: false,
      type: 'lead'
    },
    {
      id: '2',
      title: 'Nueva Cita Agendada',
      message: 'Test drive confirmado para mañana a las 15:00 hs.',
      time: 'Hace 2 horas',
      read: false,
      type: 'appointment'
    },
    {
      id: '3',
      title: 'Actualización de Sistema',
      message: 'El sistema se ha actualizado a la versión 2.1.0',
      time: 'Ayer',
      read: true,
      type: 'system'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Cerrar notificaciones al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Registrar Service Worker y solicitar permisos para Web Push
  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('Service Worker registrado con éxito:', registration.scope);
          }).catch(error => {
            console.error('Error al registrar el Service Worker:', error);
          });
        }
      });
    }
  }, []);

  // Función para simular la recepción de una notificación push
  const simulatePushNotification = () => {
    const isLead = Math.random() > 0.5;
    const newNotif: Notification = {
      id: Date.now().toString(),
      title: isLead ? '¡Nuevo Lead Recibido!' : '¡Nueva Cita Agendada!',
      message: isLead 
        ? 'Carlos Ruiz ha consultado por el Audi RS e-tron GT.' 
        : 'Test drive confirmado para hoy a las 17:00 hs.',
      time: 'Ahora',
      read: false,
      type: isLead ? 'lead' : 'appointment'
    };

    setNotifications(prev => [newNotif, ...prev]);

    if ('Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        const url = isLead ? '/admin/leads' : '/admin/citas';
        registration.showNotification(newNotif.title, {
          body: newNotif.message,
          icon: '/vite.svg',
          badge: '/vite.svg',
          data: url
        });
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-white font-sans selection:bg-white selection:text-black relative">
      <AmbientBackground />
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-[#0A0A0A]/40 backdrop-blur-xl border-r border-white/10 transform transition-all duration-300 ease-in-out lg:static lg:inset-auto lg:flex lg:flex-col",
        sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "lg:w-20" : "lg:w-72"
      )}>
        <div className="flex flex-col h-full relative">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-8 bg-[#111] border border-white/10 rounded-full p-1 text-gray-400 hover:text-white z-50"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <div className="flex items-center justify-center h-24 px-6 border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-3">
              <span className={cn("text-xl font-black italic tracking-widest uppercase text-white transition-all", isCollapsed && "lg:hidden")}>
                GUERNICA<span className="text-red-600 ml-2">MOTORS</span>
              </span>
              {isCollapsed && (
                <span className="hidden lg:block text-xl font-black italic tracking-widest uppercase text-white">
                  G<span className="text-red-600">M</span>
                </span>
              )}
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  title={isCollapsed ? item.name : undefined}
                  className={cn(
                    "group flex items-center px-4 py-3 text-xs tracking-widest uppercase font-medium rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-white text-black"
                      : "text-gray-500 hover:bg-white/5 hover:text-white",
                    isCollapsed && "lg:justify-center"
                  )}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0 h-4 w-4 transition-colors duration-300",
                      isActive ? "text-black" : "text-gray-500 group-hover:text-white",
                      !isCollapsed && "mr-4"
                    )}
                    strokeWidth={1.5}
                  />
                  <span className={cn(isCollapsed && "lg:hidden")}>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="p-6 border-t border-white/10">
            <button 
              title={isCollapsed ? "Cerrar Sesión" : undefined}
              className={cn(
                "flex items-center w-full px-4 py-3 text-xs tracking-widest uppercase font-medium text-gray-500 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors group",
                isCollapsed && "lg:justify-center"
              )}
            >
              <LogOut className={cn("flex-shrink-0 h-4 w-4 text-gray-500 group-hover:text-red-400 transition-colors", !isCollapsed && "mr-4")} strokeWidth={1.5} />
              <span className={cn(isCollapsed && "lg:hidden")}>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Topbar */}
        <header className="bg-transparent border-b border-white/10 z-10 backdrop-blur-sm">
          <div className="flex items-center justify-between h-24 px-4 sm:px-6 lg:px-10">
            <button
              type="button"
              className="text-gray-400 hover:text-white focus:outline-none lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Abrir sidebar</span>
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>

            <div className="flex-1 flex justify-between items-center lg:ml-0 ml-4">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Buscar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-12 pr-4 py-3 border border-white/10 rounded-full leading-5 bg-white/5 backdrop-blur-md text-white placeholder-gray-500 focus:outline-none focus:border-white/30 sm:text-sm transition-all font-light"
                    placeholder="Buscar..."
                    type="search"
                  />
                </div>
              </div>
              
              <div className="ml-4 flex items-center md:ml-6 gap-6">
                <div className="relative" ref={notificationsRef}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-400 hover:text-white relative bg-white/5 backdrop-blur-md border border-white/10 rounded-full transition-colors"
                    title="Ver notificaciones"
                  >
                    <span className="sr-only">Ver notificaciones</span>
                    <Bell className="h-4 w-4" strokeWidth={1.5} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#0A0A0A]" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-4 w-80 sm:w-96 bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                          <h3 className="text-xs font-bold tracking-widest uppercase text-white">Notificaciones</h3>
                          <div className="flex gap-3">
                            <button 
                              onClick={simulatePushNotification}
                              className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
                              title="Simular nueva notificación"
                            >
                              Simular
                            </button>
                            {unreadCount > 0 && (
                              <button 
                                onClick={markAllAsRead}
                                className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
                              >
                                Marcar todo leído
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="max-h-[400px] overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm font-light">
                              No tienes notificaciones
                            </div>
                          ) : (
                            <div className="divide-y divide-white/5">
                              {notifications.map((notif) => (
                                <div 
                                  key={notif.id}
                                  onClick={() => markAsRead(notif.id)}
                                  className={cn(
                                    "p-4 hover:bg-white/5 transition-colors cursor-pointer relative group",
                                    !notif.read ? "bg-white/[0.02]" : ""
                                  )}
                                >
                                  {!notif.read && (
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
                                  )}
                                  <div className="pl-4 pr-6">
                                    <div className="flex justify-between items-start mb-1">
                                      <p className={cn(
                                        "text-sm font-medium",
                                        !notif.read ? "text-white" : "text-gray-300"
                                      )}>
                                        {notif.title}
                                      </p>
                                      <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                                        {notif.time}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-400 font-light line-clamp-2">
                                      {notif.message}
                                    </p>
                                  </div>
                                  
                                  <button
                                    onClick={(e) => removeNotification(notif.id, e)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {notifications.length > 0 && (
                          <div className="p-3 border-t border-white/10 bg-white/[0.02] text-center">
                            <Link 
                              to="/admin" 
                              onClick={() => setShowNotifications(false)}
                              className="text-[10px] font-bold tracking-widest uppercase text-white hover:text-gray-300 transition-colors"
                            >
                              Ver todas
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile dropdown */}
                <div className="relative flex items-center gap-4 pl-6 border-l border-white/10">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold tracking-widest uppercase text-white">Admin</p>
                    <p className="text-[10px] tracking-widest uppercase text-gray-500">Gerente</p>
                  </div>
                  <div className="h-10 w-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main section */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-transparent">
          <div className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
