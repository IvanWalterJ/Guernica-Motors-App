import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  status: 'available' | 'sold' | 'reserved';
  condition: '0km' | 'Usado';
  km: number;
  price: number;
  fuel_type: string;
  transmission: string;
  doors: number;
  engine_cc: number;
  horsepower: number;
  color_ext: string;
  color_int: string;
  description: string;
  features: string[];
  photos: string[];
  views: number;
  daysInStock: number;
  created_at: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface ActivityEntry {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'inventory' | 'lead' | 'sale' | 'system';
}

interface AppContextValue {
  vehicles: Vehicle[];
  leads: any[];
  appointments: any[];
  leadsCount: number;
  appointmentsCount: number;
  transactions: Transaction[];
  isLoading: boolean;
  refreshData: (silent?: boolean) => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  addTransaction: (data: any) => Promise<void>;
  addLeadAndAppointment: (lead: any, appointment: any) => Promise<void>;
  updateLeadStatus: (id: string, status: string) => Promise<void>;
  getVehicleById: (id: string) => Vehicle | undefined;
  incrementViews: (id: string) => Promise<void>;
  availableVehicles: Vehicle[];
  brandDistribution: { name: string; value: number }[];
  soldCount: number;
  totalRevenue: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    vehicles: Vehicle[];
    leads: any[];
    appointments: any[];
    transactions: Transaction[];
    isLoading: boolean;
  }>({
    vehicles: [],
    leads: [],
    appointments: [],
    transactions: [],
    isLoading: true
  });

  const fetchVehicles = useCallback(async () => {
    const { data } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    return (data || []).map(v => {
      // Support both old DB column name (images) and new (photos)
      const rawPhotos = v.photos ?? v.images;
      const photos: string[] = Array.isArray(rawPhotos) ? rawPhotos : JSON.parse(rawPhotos || '[]');
      const features: string[] = Array.isArray(v.features) ? v.features : JSON.parse(v.features || '[]');
      const daysInStock = v.created_at
        ? Math.floor((Date.now() - new Date(v.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      return { ...v, photos, features, daysInStock };
    }) as Vehicle[];
  }, []);

  const fetchLeads = useCallback(async () => {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    return data || [];
  }, []);

  const fetchAppointments = useCallback(async () => {
    const { data } = await supabase.from('appointments').select('*').order('date', { ascending: true });
    return data || [];
  }, []);

  const fetchTransactions = useCallback(async () => {
    const { data } = await supabase.from('transactions').select('*').order('date', { ascending: false });
    return data || [];
  }, []);

  const refreshData = useCallback(async (silent = false) => {
    if (!silent) setState(prev => ({ ...prev, isLoading: true }));
    try {
      const [vehicles, leads, appointments, transactions] = await Promise.all([
        fetchVehicles(),
        fetchLeads(),
        fetchAppointments(),
        fetchTransactions()
      ]);
      
      setState({
        vehicles,
        leads,
        appointments,
        transactions,
        isLoading: false
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [fetchVehicles, fetchLeads, fetchAppointments, fetchTransactions]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addVehicle = async (vehicle: Omit<Vehicle, 'id'>) => {
    const { error } = await supabase.from('vehicles').insert([vehicle]);
    if (error) throw error;
    await refreshData(true);
  };

  const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
    const { error } = await supabase.from('vehicles').update(vehicle).eq('id', id);
    if (error) throw error;
    await refreshData(true);
  };

  const deleteVehicle = async (id: string) => {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) throw error;
    await refreshData(true);
  };

  const addTransaction = async (data: any) => {
    const { error } = await supabase.from('transactions').insert([data]);
    if (error) throw error;
    await refreshData(true);
  };

  const addLeadAndAppointment = async (lead: any, appointment: any) => {
    const { error: leadError } = await supabase
      .from('leads')
      .insert([{
        name: lead.name,
        phone: lead.phone ?? '',
        message: lead.message ?? '',
        vehicle_id: lead.vehicle_id ?? null,
        status: 'nuevo',
        source: 'web',
      }]);

    if (leadError) throw leadError;

    if (appointment) {
      const { error: appError } = await supabase
        .from('appointments')
        .insert([{
          user_name: appointment.user_name,
          user_phone: appointment.user_phone,
          date: appointment.date,
          time: appointment.time,
          vehicle_id: appointment.vehicle_id ?? null,
          status: 'pendiente',
        }]);

      if (appError) throw appError;
    }

    // Notificar a n8n (fire & forget — si n8n no está corriendo, la reserva igual se guarda)
    const vehicle = lead.vehicle_id
      ? state.vehicles.find(v => v.id === lead.vehicle_id)
      : null;

    const webhookPayload = {
      name: lead.name,
      phone: lead.phone ?? '',
      message: lead.message ?? '',
      vehicle_brand: vehicle?.brand ?? null,
      vehicle_model: vehicle?.model ?? null,
      vehicle_year: vehicle?.year ?? null,
      vehicle_price: vehicle?.price ?? null,
      date: appointment?.date ?? '',
      time: appointment?.time ?? '',
    };

    // Si hay turno → webhook de reserva; si es solo consulta → webhook de lead
    const webhookPath = appointment ? 'gm-nueva-reserva' : 'gm-nuevo-lead';
    fetch('http://localhost:5678/webhook/' + webhookPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    }).catch(() => {});

    await refreshData(true);
  };


  const updateLeadStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    await refreshData(true);
  };

  const getVehicleById = (id: string) => state.vehicles.find(v => v.id === id);

  const incrementViews = async (id: string) => {
    const vehicle = getVehicleById(id);
    if (vehicle) {
      await supabase.from('vehicles').update({ views: (vehicle.views || 0) + 1 }).eq('id', id);
    }
  };

  const availableVehicles = useMemo(() => state.vehicles.filter(v => v.status === 'available'), [state.vehicles]);
  const soldCount = useMemo(() => state.vehicles.filter(v => v.status === 'sold').length, [state.vehicles]);
  const totalRevenue = useMemo(() => state.transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0), [state.transactions]);
  
  const brandDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    state.vehicles.forEach(v => {
      dist[v.brand] = (dist[v.brand] || 0) + 1;
    });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [state.vehicles]);

  const value = {
    ...state,
    leadsCount: state.leads.length,
    appointmentsCount: state.appointments.length,
    refreshData,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addTransaction,
    addLeadAndAppointment,
    updateLeadStatus,
    getVehicleById,
    incrementViews,
    availableVehicles,
    brandDistribution,
    soldCount,
    totalRevenue
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}
