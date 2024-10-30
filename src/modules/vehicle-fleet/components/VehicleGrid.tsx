import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

import { 
  Users, 
  Car, 
  GaugeCircle 
} from 'lucide-react';
import { Vehicle } from '../types/types';

interface VehicleGridProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

export default function VehicleGrid({ vehicles, isLoading }: VehicleGridProps) { 
  console.log('hii from vehicle grid')
  console.log('vehicles ',vehicles)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse h-[300px]">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {/* Image Section */} 
          <div className="relative w-full h-[200px]"> 
            <Link href={`/vehicle/${vehicle.id}`}>
            <Image
              src={vehicle.primaryImage}
              alt={vehicle.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
            </Link>
            <Badge 
              className="absolute top-4 right-4 bg-white/90"
              variant="secondary"
            >
              ₹{vehicle.dailyRate.toLocaleString()}/day
            </Badge>
          </div>
          
          {/* Details Section */}
          <div className="p-4">
            <h3 className="text-lg font-semibold truncate">{vehicle.name}</h3>
            <p className="text-sm text-gray-500 mb-4 truncate">
              {vehicle.manufacturer.name} {vehicle.model.name}
            </p>
            
            {/* Icons and Info */}
            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
              {/* Seating Capacity */}
              <div className="flex items-center gap-1.5" title="Seating Capacity">
                <Users className="w-4 h-4" />
                <span>{vehicle.seatingCapacity}</span>
              </div>

              {/* Transmission */}
              <div className="flex items-center gap-1.5" title="Transmission">
                <GaugeCircle className="w-4 h-4" />
                <span>{vehicle.transmission}</span>
              </div>

              {/* Category/Body Type */}
              <div className="flex items-center gap-1.5" title="Vehicle Type">
                <Car className="w-4 h-4" />
                <span>{vehicle.category}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}