// src/types/vehicle.ts
export interface Manufacturer {
    id: string;
    name: string;
  }
  
  export interface Model {
    id: string;
    name: string;
    manufacturer: Manufacturer;
  }
  
  export interface Vehicle {
    id: string;
    name: string;
    manufacturer: Manufacturer;
    model: Model;
    dailyRate: number;
    category: VehicleCategory;
    transmission: TransmissionType;
    seatingCapacity: number;
    yearOfManufacture: number;
    maintenanceStatus: MaintenanceStatus;
    primaryImage: string;
    otherImages: string[];
    fuelType: FuelType;
    description: string;
  }
  
  export enum VehicleCategory {
    ECONOMY = 'ECONOMY',
    COMPACT = 'COMPACT',
    MIDSIZE = 'MIDSIZE',
    FULLSIZE = 'FULLSIZE',
    LUXURY = 'LUXURY',
    SUV = 'SUV',
    VAN = 'VAN',
    TRUCK = 'TRUCK'
  }
  
  export enum TransmissionType {
    MANUAL = 'MANUAL',
    AUTOMATIC = 'AUTOMATIC',
    SEMI_AUTOMATIC = 'SEMI_AUTOMATIC'
  }
  
  export enum MaintenanceStatus {
    EXCELLENT = 'EXCELLENT',
    GOOD = 'GOOD',
    NEEDS_SERVICE = 'NEEDS_SERVICE',
    IN_MAINTENANCE = 'IN_MAINTENANCE'
  }
  
  export enum FuelType {
    PETROL = 'PETROL',
    DIESEL = 'DIESEL',
    ELECTRIC = 'ELECTRIC',
    HYBRID = 'HYBRID'
  }
  
  export interface VehicleSearchInput {
    searchTerm?: string;
    filters: {
      minPrice?: number;
      maxPrice?: number;
      bodyTypes?: VehicleCategory[];
      transmission?: TransmissionType[];
      fuelType?: FuelType[];
      manufacturer?: string;
      model?: string;
      yearOfManufacture?: number;
    };
    pagination?: {
      page: number;
      perPage: number;
    };
    sort?: {
      field: string;
      direction: 'asc' | 'desc';
    };
  }

  export interface FilterState {
    searchTerm: string;
    priceRange: {
      min: number;
      max: number;
    };
    categories: string[];
    transmission: string[];
    fuelType: string[];
    manufacturers: string[];
    seatingCapacity: number[];
    page: number;
    limit: number;
  }
  


export interface QueryResponse {
  getAvailableVehiclesForRent: Vehicle[];
}

export interface SearchVehicleResponse {
  searchVehiclesUser: {
    results: Vehicle[];
    totalCount: number;
    facets: SearchFacets;
  };
} 

export interface FacetValue {
  value: string;
  count: number;
}

export interface SearchFacets {
  manufacturers: FacetValue[];
  categories: FacetValue[];
  transmission: FacetValue[];
  fuelTypes: FacetValue[];
  seatingCapacity: FacetValue[];
}