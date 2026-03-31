export type VehicleStatus = 'available' | 'reserved' | 'sold';
export type VehicleCondition = '0km' | 'Usado';
export type FuelType = 'Gasolina' | 'Diésel' | 'Eléctrico' | 'Híbrido' | 'GNC';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  status: VehicleStatus;
  condition: VehicleCondition;
  km: number;
  daysInStock: number;
  views: number;
  createdAt: number;       // timestamp ms — used to recompute daysInStock on hydration
  price: number;           // USD
  fuel_type: FuelType;
  transmission: string;
  doors: number;
  engine_cc: number;       // 0 for electric
  horsepower: number;
  color_ext: string;
  color_int: string;
  description: string;
  features: string[];
  photos: string[];        // base64 data URLs or Unsplash URLs for seed data
}

export type VehicleFormData = Omit<Vehicle, 'id' | 'daysInStock' | 'views' | 'createdAt'>;

export interface BrandDistribution {
  name: string;
  value: number; // percentage
}
