import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { Vehicle, VehicleFormData, BrandDistribution } from "../types/vehicle";

const STORAGE_KEY = "guernica_motors_v1";
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// ─── Seed Data ────────────────────────────────────────────────────────────────

function makeCreatedAt(daysAgo: number): number {
  return Date.now() - daysAgo * MS_PER_DAY;
}

const SEED_VEHICLES: Vehicle[] = [
  {
    id: 1, brand: "Volkswagen", model: "Amarok V6 Extreme", version: "4Motion Automática",
    year: 2023, status: "available", condition: "Usado", km: 15000,
    daysInStock: 12, views: 145, createdAt: makeCreatedAt(12), price: 48000,
    fuel_type: "Diésel", transmission: "Automática (8 marchas)", doors: 4,
    engine_cc: 3000, horsepower: 258, color_ext: "Azul Ravenna", color_int: "Cuero Negro/Gris",
    description: "La pick-up más potente de su segmento. Combina el confort de un SUV de lujo con la capacidad de carga y tracción de una verdadera 4x4. Único dueño, servicios oficiales al día.",
    features: ["Tracción 4Motion", "Asientos ErgoComfort", "Faros Bi-Xenón", "Llantas 20\"", "Cámara de retroceso", "Navegador GPS", "Climatizador Bi-zona"],
    photos: [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1555353540-64fd8b028b4c?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    id: 2, brand: "Toyota", model: "Hilux SRX 4x4", version: "Automática",
    year: 2024, status: "reserved", condition: "0km", km: 0,
    daysInStock: 5, views: 89, createdAt: makeCreatedAt(5), price: 45000,
    fuel_type: "Diésel", transmission: "Automática (6 marchas)", doors: 4,
    engine_cc: 2800, horsepower: 204, color_ext: "Blanco Perlado", color_int: "Cuero Negro",
    description: "La leyenda indiscutida. Confiabilidad, robustez y valor de reventa inigualable. Versión tope de gama con todo el equipamiento de seguridad y confort.",
    features: ["Toyota Safety Sense", "Audio JBL", "Faros Bi-LED", "Llantas 18\"", "Cámara 360", "Asientos ventilados", "Arranque por botón"],
    photos: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    id: 3, brand: "Peugeot", model: "208 Feline", version: "Tiptronic",
    year: 2023, status: "available", condition: "Usado", km: 12000,
    daysInStock: 2, views: 234, createdAt: makeCreatedAt(2), price: 22000,
    fuel_type: "Gasolina", transmission: "Automática (6 marchas)", doors: 5,
    engine_cc: 1600, horsepower: 115, color_ext: "Gris Artense", color_int: "Tela/Cuero Negro",
    description: "Diseño vanguardista y tecnología de punta. El hatchback más atractivo del mercado con el innovador i-Cockpit 3D. Excelente estado general.",
    features: ["i-Cockpit 3D", "Techo Panorámico", "Faros Full LED", "Cámara 180°", "Carga Inalámbrica", "Llantas 16\""],
    photos: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1555353540-64fd8b028b4c?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    id: 4, brand: "Fiat", model: "Cronos Precision", version: "CVT",
    year: 2022, status: "sold", condition: "Usado", km: 25000,
    daysInStock: 45, views: 56, createdAt: makeCreatedAt(45), price: 18000,
    fuel_type: "Gasolina", transmission: "Automática (CVT)", doors: 4,
    engine_cc: 1300, horsepower: 99, color_ext: "Rojo Montecarlo", color_int: "Tela Negro",
    description: "El sedán más vendido del país. Espacioso, económico y con un diseño italiano inconfundible. Ideal para la familia o uso diario urbano.",
    features: ["Pantalla 7\" con Apple CarPlay/Android Auto", "Cámara de retroceso", "Climatizador Automático", "Llantas de aleación", "Control de tracción y estabilidad"],
    photos: [
      "https://images.unsplash.com/photo-1555353540-64fd8b028b4c?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    id: 5, brand: "Ford", model: "Ranger Raptor", version: "V6 Bi-Turbo",
    year: 2024, status: "available", condition: "0km", km: 0,
    daysInStock: 3, views: 312, createdAt: makeCreatedAt(3), price: 60000,
    fuel_type: "Gasolina", transmission: "Automática (10 marchas)", doors: 4,
    engine_cc: 3000, horsepower: 397, color_ext: "Naranja Sedona", color_int: "Cuero/Alcantara Negro con costuras naranjas",
    description: "Desarrollada por Ford Performance. La pick-up deportiva definitiva, diseñada para dominar cualquier terreno a alta velocidad. Suspensión Fox Racing.",
    features: ["Amortiguadores Fox Racing 2.5\"", "Modo Baja", "Escape Activo", "Pantalla 12\" SYNC 4", "Asientos Deportivos Ford Performance", "Faros Matrix LED"],
    photos: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    id: 6, brand: "Volkswagen", model: "Vento GLI", version: "DSG",
    year: 2023, status: "available", condition: "Usado", km: 8000,
    daysInStock: 8, views: 178, createdAt: makeCreatedAt(8), price: 35000,
    fuel_type: "Gasolina", transmission: "Automática (DSG 7 marchas)", doors: 4,
    engine_cc: 2000, horsepower: 230, color_ext: "Rojo Kings", color_int: "Cuero Negro con costuras rojas",
    description: "El sedán deportivo por excelencia. Motor turbo 2.0 TSI y caja DSG para una aceleración y respuesta inmediatas. Diseño agresivo y tecnología superior.",
    features: ["Motor 2.0 TSI", "Caja DSG de 7 velocidades", "Active Info Display", "Techo Solar Panorámico", "Asientos Deportivos GLI", "Llantas 18\""],
    photos: [
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1555353540-64fd8b028b4c?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    id: 7, brand: "Porsche", model: "911 Carrera S", version: "PDK",
    year: 2023, status: "available", condition: "Usado", km: 5000,
    daysInStock: 12, views: 489, createdAt: makeCreatedAt(12), price: 185000,
    fuel_type: "Gasolina", transmission: "Automática (PDK)", doors: 2,
    engine_cc: 3000, horsepower: 450, color_ext: "Gris Ágata Metalizado", color_int: "Cuero Negro",
    description: "Una obra maestra de la ingeniería alemana. Este 911 Carrera S ofrece una experiencia de conducción inigualable, combinando lujo absoluto con un rendimiento deportivo extremo. Mantenimiento oficial, estado inmaculado y listo para entregar.",
    features: ["Sport Chrono Package", "Escape Deportivo", "Llantas Carrera S 20/21\"", "Asientos Deportivos Plus", "Bose Surround Sound", "PDLS Plus", "Techo Solar"],
    photos: [
      "https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1611821064430-0d40221e4c98?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1553440569-bfc1015e5c56?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    id: 8, brand: "Audi", model: "RS e-tron GT", version: "Quattro",
    year: 2024, status: "available", condition: "0km", km: 0,
    daysInStock: 2, views: 234, createdAt: makeCreatedAt(2), price: 145000,
    fuel_type: "Eléctrico", transmission: "Automática (2 marchas)", doors: 4,
    engine_cc: 0, horsepower: 646, color_ext: "Gris Kemora", color_int: "Cuero Nappa Fina Negro con costuras rojas",
    description: "El futuro del alto rendimiento. Un Gran Turismo 100% eléctrico que combina un diseño escultural con una aceleración brutal y tecnología de vanguardia.",
    features: ["Tracción Quattro Eléctrica", "Techo de Carbono", "Frenos de Carburo de Tungsteno", "Faros Matrix LED con luz láser", "Sonido Bang & Olufsen 3D", "Suspensión Neumática Adaptativa"],
    photos: [
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    id: 9, brand: "BMW", model: "M4 Competition", version: "M xDrive",
    year: 2023, status: "available", condition: "Usado", km: 12000,
    daysInStock: 12, views: 156, createdAt: makeCreatedAt(12), price: 120000,
    fuel_type: "Gasolina", transmission: "Automática (M Steptronic 8 marchas)", doors: 2,
    engine_cc: 3000, horsepower: 510, color_ext: "Amarillo Sao Paulo", color_int: "Cuero Merino Negro/Amarillo",
    description: "Pura adrenalina M. El M4 Competition con tracción M xDrive ofrece un dinamismo excepcional tanto en circuito como en el día a día. Diseño audaz y prestaciones de superdeportivo.",
    features: ["Tracción M xDrive", "Asientos M Carbon Bucket", "Frenos M Compound", "Techo de Carbono", "BMW Live Cockpit Professional", "Head-Up Display"],
    photos: [
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    id: 10, brand: "Mercedes-Benz", model: "AMG GT", version: "63 S 4MATIC+",
    year: 2024, status: "reserved", condition: "0km", km: 0,
    daysInStock: 5, views: 89, createdAt: makeCreatedAt(5), price: 210000,
    fuel_type: "Gasolina", transmission: "Automática (AMG Speedshift MCT 9G)", doors: 4,
    engine_cc: 4000, horsepower: 630, color_ext: "Gris Selenita Magno", color_int: "Cuero Nappa AMG Negro/Rojo",
    description: "Rendimiento sin concesiones. El AMG GT 63 S combina la practicidad de un Gran Turismo de cuatro puertas con la potencia pura de un AMG. Un icono del segmento ultra-premium.",
    features: ["Motor V8 Biturbo 4.0L", "AMG RIDE CONTROL+", "Paquete Aerodinámico AMG", "Burmester 3D Surround Sound", "Pantalla widescreen 12.3\"", "Frenos AMG Compound"],
    photos: [
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1503376760367-11ea8eb222c9?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1600",
    ],
  },
  {
    id: 11, brand: "Land Rover", model: "Range Rover", version: "Autobiography D350",
    year: 2024, status: "available", condition: "0km", km: 0,
    daysInStock: 95, views: 12, createdAt: makeCreatedAt(95), price: 195000,
    fuel_type: "Diésel", transmission: "Automática (8 marchas)", doors: 4,
    engine_cc: 3000, horsepower: 350, color_ext: "Azul Portofino Metalizado", color_int: "Cuero Windsor Ebony",
    description: "La cima del lujo todoterreno. El Range Rover Autobiography define la clase en cualquier entorno, desde la ciudad más exigente hasta los terrenos más desafiantes del mundo.",
    features: ["Air Suspension", "Terrain Response 2", "Pantalla Pivi Pro 13.1\"", "Meridian Signature Sound", "Asientos Climatizados y Masajeadores", "Sunroof Panorámico"],
    photos: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1600",
    ],
  },
];

// ─── Activity Log ──────────────────────────────────────────────────────────────

export type ActivityIcon = "car" | "dollar" | "trash" | "edit" | "users";

export interface ActivityEntry {
  id: string;
  action: string;
  detail: string;
  time: number; // ms timestamp
  icon: ActivityIcon;
}

const MAX_ACTIVITY = 30;

// ─── State & Context types ─────────────────────────────────────────────────────

interface AppState {
  vehicles: Vehicle[];
  leadsCount: number;
  appointmentsCount: number;
  activityLog: ActivityEntry[];
}

interface AppContextValue extends AppState {
  addVehicle: (data: VehicleFormData) => void;
  updateVehicle: (id: number, data: Partial<VehicleFormData>) => void;
  deleteVehicle: (id: number) => void;
  getVehicleById: (id: string | number) => Vehicle | undefined;
  incrementViews: (id: number) => void;
  setLeadsCount: (n: number) => void;
  setAppointmentsCount: (n: number) => void;
  availableVehicles: Vehicle[];
  brandDistribution: BrandDistribution[];
  soldCount: number;
  totalRevenue: number;
}

// ─── Persistence helpers ───────────────────────────────────────────────────────

function rehydrate(raw: AppState): AppState {
  return {
    ...raw,
    vehicles: raw.vehicles.map((v) => ({
      ...v,
      daysInStock: Math.floor((Date.now() - v.createdAt) / MS_PER_DAY),
    })),
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (Array.isArray(parsed.vehicles) && parsed.vehicles.length > 0) {
        return rehydrate(parsed);
      }
    }
  } catch {
    // Corrupted storage — fall through to seed
  }
  return { vehicles: SEED_VEHICLES, leadsCount: 48, appointmentsCount: 24, activityLog: [] };
}

function persistState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.warn(
        "Guernica Motors: localStorage quota exceeded. Las fotos pueden no persistir entre sesiones. Usá imágenes más pequeñas."
      );
    }
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  // Persist on every state change
  useEffect(() => {
    persistState(state);
  }, [state]);

  // ── Derived values ──────────────────────────────────────────────────────────

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

  // ── Actions ─────────────────────────────────────────────────────────────────

  const addVehicle = useCallback((data: VehicleFormData) => {
    const now = Date.now();
    const newVehicle: Vehicle = { ...data, id: now, daysInStock: 0, views: 0, createdAt: now };
    const entry: ActivityEntry = {
      id: `${now}-add`,
      action: "Nuevo vehículo",
      detail: `${data.brand} ${data.model} (${data.year}) agregado al inventario`,
      time: now,
      icon: "car",
    };
    setState((prev) => ({
      ...prev,
      vehicles: [newVehicle, ...prev.vehicles],
      activityLog: [entry, ...prev.activityLog].slice(0, MAX_ACTIVITY),
    }));
  }, []);

  const updateVehicle = useCallback((id: number, data: Partial<VehicleFormData>) => {
    setState((prev) => {
      const existing = prev.vehicles.find((v) => v.id === id);
      const entries: ActivityEntry[] = [];
      const now = Date.now();

      if (existing) {
        if (data.status && data.status !== existing.status) {
          const statusLabels: Record<string, string> = {
            sold: "Vendido",
            reserved: "Reservado",
            available: "Disponible",
          };
          if (data.status === "sold") {
            entries.push({
              id: `${now}-sold`,
              action: "Venta concretada",
              detail: `${existing.brand} ${existing.model} (${existing.year}) marcado como vendido · USD ${existing.price.toLocaleString()}`,
              time: now,
              icon: "dollar",
            });
          } else {
            entries.push({
              id: `${now}-status`,
              action: "Estado actualizado",
              detail: `${existing.brand} ${existing.model} → ${statusLabels[data.status] ?? data.status}`,
              time: now,
              icon: "edit",
            });
          }
        } else if (Object.keys(data).length > 0) {
          entries.push({
            id: `${now}-edit`,
            action: "Vehículo editado",
            detail: `${existing.brand} ${existing.model} (${existing.year}) actualizado`,
            time: now,
            icon: "edit",
          });
        }
      }

      return {
        ...prev,
        vehicles: prev.vehicles.map((v) => (v.id === id ? { ...v, ...data } : v)),
        activityLog: entries.length
          ? [...entries, ...prev.activityLog].slice(0, MAX_ACTIVITY)
          : prev.activityLog,
      };
    });
  }, []);

  const deleteVehicle = useCallback((id: number) => {
    setState((prev) => {
      const vehicle = prev.vehicles.find((v) => v.id === id);
      const entry: ActivityEntry | null = vehicle
        ? {
            id: `${Date.now()}-del`,
            action: "Vehículo eliminado",
            detail: `${vehicle.brand} ${vehicle.model} (${vehicle.year}) removido del inventario`,
            time: Date.now(),
            icon: "trash",
          }
        : null;
      return {
        ...prev,
        vehicles: prev.vehicles.filter((v) => v.id !== id),
        activityLog: entry ? [entry, ...prev.activityLog].slice(0, MAX_ACTIVITY) : prev.activityLog,
      };
    });
  }, []);

  const getVehicleById = useCallback(
    (id: string | number): Vehicle | undefined => {
      const numId = typeof id === "string" ? parseInt(id, 10) : id;
      return state.vehicles.find((v) => v.id === numId);
    },
    [state.vehicles]
  );

  const incrementViews = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      vehicles: prev.vehicles.map((v) =>
        v.id === id ? { ...v, views: v.views + 1 } : v
      ),
    }));
  }, []);

  const setLeadsCount = useCallback((n: number) => {
    setState((prev) => ({ ...prev, leadsCount: n }));
  }, []);

  const setAppointmentsCount = useCallback((n: number) => {
    setState((prev) => ({ ...prev, appointmentsCount: n }));
  }, []);

  const value: AppContextValue = {
    ...state,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,
    incrementViews,
    setLeadsCount,
    setAppointmentsCount,
    availableVehicles,
    brandDistribution,
    soldCount,
    totalRevenue,
    // activityLog already spread via ...state
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside <AppProvider>");
  }
  return ctx;
}
