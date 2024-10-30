
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Range } from '@/components/ui/range';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { VehicleCategory, TransmissionType, FuelType, FilterState, SearchFacets } from '../types/types';
import {
  Car,
  Search,
  IndianRupee,
  Warehouse,
  Fuel,
  GaugeCircle,
} from 'lucide-react';

interface SidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  facets: SearchFacets | undefined;  // Changed from manufacturers array to facets
  maxPrice: number;
}

export default function Sidebar({
  filters,
  onFilterChange,
  facets,
  maxPrice
}: SidebarProps) {
  // Helper function to update specific filter
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  // Reset all filters
  const handleReset = () => {
    onFilterChange({
      searchTerm: '',
      priceRange: { min: 0, max: 5000 },
      categories: [],
      transmission: [],
      fuelType: [],
      manufacturers: [],
      seatingCapacity: [],
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className="w-full md:w-80 bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
        >
          Reset All
        </Button>
      </div>

      <Separator />

      {/* Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Search</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            className="pl-8"
            value={filters.searchTerm}  // Changed from search to searchTerm
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
          />
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4" />
          <Label className="text-sm font-medium">Daily Rate</Label>
        </div>
        <div className="pt-4">
          <Range
            minValue={0}
            maxValue={maxPrice}
            step={100}
            value={[filters.priceRange.min, filters.priceRange.max]}  // Updated to use object
            onValueChange={(value) => {
              updateFilter('priceRange', { min: value[0], max: value[1] });
            }}
            formatLabel={(value) => `₹${value}`}
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>₹{filters.priceRange.min}</span>
            <span>₹{filters.priceRange.max}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Vehicle Categories with Facets */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4" />
          <Label className="text-sm font-medium">Vehicle Type</Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {facets?.categories.map(({ value, count }) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={value}
                checked={filters.categories.includes(value)}
                onCheckedChange={(checked) => {
                  const newCategories = checked
                    ? [...filters.categories, value]
                    : filters.categories.filter(c => c !== value);
                  updateFilter('categories', newCategories);
                }}
              />
              <label htmlFor={value}>
                {value.charAt(0) + value.slice(1).toLowerCase()} ({count})
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Manufacturers with Facets */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Warehouse className="h-4 w-4" />
          <Label className="text-sm font-medium">Manufacturer</Label>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {facets?.manufacturers.map(({ value, count }) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={value}
                checked={filters.manufacturers.includes(value)}
                onCheckedChange={(checked) => {
                  const newManufacturers = checked
                    ? [...filters.manufacturers, value]
                    : filters.manufacturers.filter(m => m !== value);
                  updateFilter('manufacturers', newManufacturers);
                }}
              />
              <label htmlFor={value}>
                {value} ({count})
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Transmission with Facets */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <GaugeCircle className="h-4 w-4" />
          <Label className="text-sm font-medium">Transmission</Label>
        </div>
        {facets?.transmission.map(({ value, count }) => (
          <div key={value} className="flex items-center space-x-2">
            <Checkbox
              id={value}
              checked={filters.transmission.includes(value)}
              onCheckedChange={(checked) => {
                const newTransmission = checked
                  ? [...filters.transmission, value]
                  : filters.transmission.filter(t => t !== value);
                updateFilter('transmission', newTransmission);
              }}
            />
            <label htmlFor={value}>
              {value.charAt(0) + value.slice(1).toLowerCase()} ({count})
            </label>
          </div>
        ))}
      </div>

      <Separator />

      {/* Fuel Type with Facets */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Fuel className="h-4 w-4" />
          <Label className="text-sm font-medium">Fuel Type</Label>
        </div>
        {facets?.fuelTypes.map(({ value, count }) => (
          <div key={value} className="flex items-center space-x-2">
            <Checkbox
              id={value}
              checked={filters.fuelType.includes(value)}
              onCheckedChange={(checked) => {
                const newFuelTypes = checked
                  ? [...filters.fuelType, value]
                  : filters.fuelType.filter(f => f !== value);
                updateFilter('fuelType', newFuelTypes);
              }}
            />
            <label htmlFor={value}>
              {value.charAt(0) + value.slice(1).toLowerCase()} ({count})
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
