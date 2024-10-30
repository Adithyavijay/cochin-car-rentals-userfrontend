import React from 'react';
import VehicleGrid from '../components/VehicleGrid';
import Sidebar from '../components/sidebar';
import { useQuery } from '@apollo/client';
import { SEARCH_VEHICLES } from '@/graphql/queries';
import Image from 'next/image';
import backgroundImage from '../../../../public/images/backgroundImage.jpg'
import { 
  FilterState, 
  SearchVehicleResponse
} from '../types/types';

export default function VehicleFleet() {
  // Filter state with proper typing
  const [filters, setFilters] = React.useState<FilterState>({
    searchTerm: '',  // Changed from 'search' to match API
    priceRange: { min: 0, max: 5000 },  // Changed to object structure
    categories: [],
    transmission: [],
    fuelType: [],
    manufacturers: [],  // Changed from manufacturer to manufacturers
    seatingCapacity: [],
    page: 1,
    limit: 10
  });

  // Single query for searching vehicles
  const { data, loading } = useQuery<SearchVehicleResponse>(SEARCH_VEHICLES, {
    variables: {
      input: {
        searchTerm: filters.searchTerm,
        priceRange: {
          min: filters.priceRange.min,
          max: filters.priceRange.max
        },
        categories: filters.categories,
        transmission: filters.transmission,
        fuelType: filters.fuelType,
        manufacturers: filters.manufacturers,
        seatingCapacity: filters.seatingCapacity,
        page: filters.page,
        limit: filters.limit
      }
    }
  });

  console.log('Search results:', data);


  // Get max price (could be from your backend or set manually)
  const maxPrice = 5000; // You could adjust this based on your needs

  return (
    <div className="h-screen py-20 ">
        {/* <div className="absolute inset-0">
          <Image
            src={backgroundImage} // Replace with your car image path
            alt="Luxury Car"
            fill
            priority
            className="object-cover object-top"
            quality={100}
          />
        </div> */}
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row gap-8 overflow-y-auto">
          {/* Sidebar */}
          <div className="w-full md:w-80">
            <Sidebar
              filters={filters}
              onFilterChange={(newFilters: FilterState) => setFilters(newFilters)}
              maxPrice={maxPrice}
              facets={data?.searchVehiclesUser?.facets}  // Pass facets to Sidebar
            />
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {data?.searchVehiclesUser?.totalCount || 0} vehicles found
              </p>
            </div>
            <VehicleGrid
              vehicles={data?.searchVehiclesUser?.results || []}
              isLoading={loading}
            />
          </main>
        </div>
      </div>
    </div>
  );
}