import { Vehicle } from "./types";

export interface SearchInput {
    searchTerm?: string;
    minPrice?: number;
    maxPrice?: number;
    brands?: string[];
    models?: string[];
    bodyTypes?: string[];
    transmission?: string[];
    fuelType?: string[];
    yearRange?: {
      min: number;
      max: number;
    };
    page?: number;
    limit?: number;
  }
  
  export interface SearchResult {
    vehicles: Vehicle[];
    totalCount: number;
    facets: SearchFacets;
  }
  
  export interface SearchFacets {
    brands: FacetValue[];
    models: FacetValue[];
    bodyTypes: FacetValue[];
    transmissionTypes: FacetValue[];
    fuelTypes: FacetValue[];
    priceRanges: PriceRange[];
  }
  
  export interface FacetValue {
    value: string;
    count: number;
  }
  
  export interface PriceRange {
    min: number;
    max: number;
    count: number;
  }