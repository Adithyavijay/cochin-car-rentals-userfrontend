import React from 'react';
import { Car, Users, Fuel, Gauge } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string;
    manufacturer: string;
    model: string;
    dailyRate: number;
    transmission: string;
    seatingCapacity: number;
    category: string;
    fuelType: string;
    primaryImage: string;
  };
  onSelect: (id: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect }) => {  
  
  const router = useRouter();
  const handleClick=()=>{ 
    console.log('clicked')
    router.push(`/vehicle/${vehicle.id}`)
  }
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <Link 
        href={`/vehicle/${vehicle.id}`}
        className="block relative h-48 overflow-hidden cursor-pointer"
        onClick={handleClick}
      >
        <Image
          src={vehicle.primaryImage}
          alt={vehicle.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </Link>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">{vehicle.manufacturer} {vehicle.model}</h3>
            <p className="text-sm text-gray-600">{vehicle.name}</p>
          </div>
          <p className="text-lg font-bold text-blue-600">${vehicle.dailyRate}/day</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Gauge className="w-4 h-4" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{vehicle.seatingCapacity} seats</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Car className="w-4 h-4" />
            <span>{vehicle.category}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Fuel className="w-4 h-4" />
            <span>{vehicle.fuelType}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 bg-gray-50">
        <button
          onClick={() => onSelect(vehicle.id)}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </CardFooter>
    </Card>
  );
};