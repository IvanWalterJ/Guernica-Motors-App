import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { Vehicle, VehicleFormData, BrandDistribution } from "../types/vehicle";
import { supabase } from "../lib/supabase";

const ACTIVITY_LOG_KEY = "guernica_motors_activity";
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export type ActivityIcon = "car" | "dollar" | "trash" | "edit" | "users";

export interface ActivityEntry {
  id: string;
  action: string;
  detail: string;
  time: number;
  icon: ActivityIcon;
}

const MAX_ACTIVITY = 30;

interface AppState {
  vehicles: Vehicle[];
  leadsCount: number;
  appointmentsCount: number;
  activityLog: ActivityEntry[];
  isLoading: boolean;
}

interface AppContextValue extends AppState {
  addVehicle: (data: VehicleFormData) => Promise<void>;
  updateVehicle: (id: string, data: Partial<VehicleFormData>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  getVehicleById: (id: string) => Vehicle | undefined;
  incrementViews: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  availableVehicles: Vehicle[];
  brandDistribution: BrandDistribution[];
  setAppointmentsCount: (count: number) => void;
  setLeadsCount: (count: number) => void;
  soldCount: number;
  totalRevenue: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    vehicles: [],
    leadsCount: 0,
    appointmentsCount: 0,
    activityLog: [],
    isLoading: true,
  });

  // ─── Data Fetching ───────────────────────────────────────────────────────────

  const fetchVehicles = useCallback(async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching vehicles:', error);
      return [];
    }

    return (data || []).map(v => ({
      ...v,
      createdAt: new Date(v.created_at).getTime(),
      daysInStock: Math.floor((Date.now() - new Date(v.created_at).getTime()) / MS_PER_DAY),
    })) as Vehicle[];
  }, []);

  const fetchCounts = useCallback(async () => {
    const [leads, appointments] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true })
    ]);

    return {
      leads: leads.count || 0,
      appointments: appointments.count || 0
    };
  }, []);

  const refreshData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    const [vehicles, counts] = await Promise.all([fetchVehicles(), fetchCounts()]);
    
    // Load activity log from localStorage (local browser context only)
    const savedLog = localStorage.getItem(ACTIVITY_LOG_KEY);
    const activityLog = savedLog ? JSON.parse(savedLog) : [];

    setState(prev => ({
      ...prev,
      vehicles,
      leadsCount: counts.leads,
      appointmentsCount: counts.appointments,
      activityLog,
      isLoading: false
    }));
  }, [fetchVehicles, fetchCounts]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Persist activity log locally
  useEffect(() => {
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(state.activityLog));
  }, [state.activityLog]);

  // ─── Actions ─────────────────────────────────────────────────────────────────

  const addActivity = useCallback((action: string, detail: string, icon: ActivityIcon) => {
    const entry: ActivityEntry = {
      id: `${Date.now()}-activity`,
      action,
      detail,
      time: Date.now(),
      icon,
    };
    setState(prev => ({
      ...prev,
      activityLog: [entry, ...prev.activityLog].slice(0, MAX_ACTIVITY)
    }));
  }, []);

  const addVehicle = useCallback(async (data: VehicleFormData) => {
    const { data: newVehicle, error } = await supabase
      .from('vehicles')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }

    if (newVehicle) {
      const vehicle: Vehicle = {
        ...newVehicle,
        createdAt: new Date(newVehicle.created_at).getTime(),
        daysInStock: 0
      };

      addActivity("Nuevo vehículo", `${data.brand} ${data.model} agregado al inventario`, "car");
      setState(prev => ({
        ...prev,
        vehicles: [vehicle, ...prev.vehicles]
      }));
    }
  }, [addActivity]);

  const updateVehicle = useCallback(async (id: string, data: Partial<VehicleFormData>) => {
    const { error } = await supabase
      .from('vehicles')
      .update(data)
      .eq('id', id);

    if (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }

    setState(prev => {
      const existing = prev.vehicles.find(v => v.id === id);
      if (existing && data.status && data.status !== existing.status) {
        if (data.status === "sold") {
          addActivity("Venta concretada", `${existing.brand} ${existing.model} marcado como vendido`, "dollar");
        } else {
          addActivity("Estado actualizado", `${existing.brand} ${existing.model} actualizado`, "edit");
        }
      }
      return {
        ...prev,
        vehicles: prev.vehicles.map(v => v.id === id ? { ...v, ...data } : v)
      };
    });
  }, [addActivity]);

  const deleteVehicle = useCallback(async (id: string) => {
    const vehicleToDelete = state.vehicles.find(v => v.id === id);
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }

    if (vehicleToDelete) {
      addActivity("Vehículo eliminado", `${vehicleToDelete.brand} ${vehicleToDelete.model} removido`, "trash");
      setState(prev => ({
        ...prev,
        vehicles: prev.vehicles.filter(v => v.id !== id)
      }));
    }
  }, [state.vehicles, addActivity]);

  const getVehicleById = useCallback((id: string) => {
    return state.vehicles.find(v => v.id === id);
  }, [state.vehicles]);

  const incrementViews = useCallback(async (id: string) => {
    const vehicle = state.vehicles.find(v => v.id === id);
    if (!vehicle) return;

    const { error } = await supabase
      .from('vehicles')
      .update({ views: (vehicle.views || 0) + 1 })
      .eq('id', id);

    if (!error) {
      setState(prev => ({
        ...prev,
        vehicles: prev.vehicles.map(v => v.id === id ? { ...v, views: (v.views || 0) + 1 } : v)
      }));
    }
  }, [state.vehicles]);

  // ─── Derived values ──────────────────────────────────────────────────────────

  const availableVehicles = useMemo(
    () => state.vehicles.filter((v) => v.status === "available"),
    [state.vehicles]
  );

  const soldCount = useMemo(
    () => state.vehicles.filter((v) => v.status === "sold").length,
    [state.vehicles]
  );

  const totalRevenue = useMemo(
    () => state.vehicles.filter((v) => v.status === "sold").reduce((sum, v) => sum + v.price, 0),
    [state.vehicles]
  );

  const brandDistribution = useMemo((): BrandDistribution[] => {
    const counts: Record<string, number> = {};
    state.vehicles.forEach((v) => {
      counts[v.brand] = (counts[v.brand] ?? 0) + 1;
    });
    const total = state.vehicles.length;
    if (total === 0) return [];
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100),
      }));
  }, [state.vehicles]);

  const value: AppContextValue = {
    ...state,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,
    incrementViews,
    refreshData,
    setAppointmentsCount: (count: number) => setState(prev => ({ ...prev, appointmentsCount: count })),
    setLeadsCount: (count: number) => setState(prev => ({ ...prev, leadsCount: count })),
    availableVehicles,
    brandDistribution,
    soldCount,
    totalRevenue,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
}
