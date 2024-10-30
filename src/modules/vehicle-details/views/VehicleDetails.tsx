'use client';
import BookingModal from "../components/BookingModal";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Loader2 } from 'lucide-react';
import { GET_VEHICLE_DETAILS } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import { Vehicle } from "@/modules/vehicle-fleet/types/types";
import { BookingFormData } from "../types/types";
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const VehicleDetails: React.FC<{ vehicleId: string }> = ({ vehicleId }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [availabilityStatus, setAvailabilityStatus] = useState<'unchecked' | 'available' | 'unavailable'>('unchecked');
    const [dates, setDates] = useState({
      pickupDate: new Date(),
      dropoffDate: new Date()
    });
  
    const { data, loading, error } = useQuery<{ getVehicleDetails: Vehicle }>(
      GET_VEHICLE_DETAILS,
      {
        variables: { id: vehicleId }
      }
    );
  
    if (loading) return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;
    if (!data?.getVehicleDetails) return <div className="text-white">No vehicle found</div>;
  
    const vehicle = data.getVehicleDetails;
    const allImages = [vehicle.primaryImage, ...vehicle.otherImages];
  
    const handleProceedToPayment = (bookingData: BookingFormData) => {
      // Handle payment flow
      console.log('Proceeding to payment with data:', bookingData);
    };

    const checkAvailability = async () => {
      setIsCheckingAvailability(true);
      try {
        // Replace this with your actual API call
        const response = await fetch('/api/check-availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vehicleId,
            pickupDate: dates.pickupDate,
            dropoffDate: dates.dropoffDate
          }),
        });
        
        const data = await response.json();
        setAvailabilityStatus(data.isAvailable ? 'available' : 'unavailable');
        
        if (data.isAvailable) {
          setIsBookingModalOpen(true);
        }
      } catch (error) {
        setAvailabilityStatus('unchecked');
        console.error('Failed to check availability:', error);
      } finally {
        setIsCheckingAvailability(false);
      }
    };
  
    return (
      <div className="h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={allImages[selectedImageIndex]}
                alt={`${vehicle.name} view ${selectedImageIndex + 1}`}
                className="w-full h-[400px] object-cover rounded-lg"
              />
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev + 1) % allImages.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
  
            <div className="grid grid-cols-5 gap-2">
              {allImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${vehicle.name} thumbnail ${index + 1}`}
                  className={`w-full h-16 object-cover rounded-md cursor-pointer transition-all ${
                    selectedImageIndex === index ? 'ring-2 ring-blue-500' : 'hover:opacity-80'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </div>
  
          {/* Right Column - Details */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold">{vehicle.name}</h1>
              <p className="text-gray-400 text-sm">{vehicle.description}</p>
            </div>
  
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <span className="text-gray-400">Manufacturer</span>
                <p className="font-medium">{vehicle.manufacturer.name}</p>
              </div>
              <div>
                <span className="text-gray-400">Model</span>
                <p className="font-medium">{vehicle.model.name}</p>
              </div>
              <div>
                <span className="text-gray-400">Daily Rate</span>
                <p className="font-medium">${vehicle.dailyRate}/day</p>
              </div>
              <div>
                <span className="text-gray-400">Category</span>
                <p className="font-medium">{vehicle.category}</p>
              </div>
              <div>
                <span className="text-gray-400">Transmission</span>
                <p className="font-medium">{vehicle.transmission}</p>
              </div>
              <div>
                <span className="text-gray-400">Seating</span>
                <p className="font-medium">{vehicle.seatingCapacity} People</p>
              </div>
              <div>
                <span className="text-gray-400">Fuel Type</span>
                <p className="font-medium">{vehicle.fuelType}</p>
              </div>
              <div>
                <span className="text-gray-400">Year</span>
                <p className="font-medium">{vehicle.yearOfManufacture}</p>
              </div>
            </div>

            {/* Availability Checker */}
            <div className="space-y-4 mt-6">
              <h2 className="text-lg font-semibold">Check Availability</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Pickup Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={format(dates.pickupDate, 'yyyy-MM-dd')}
                      onChange={(e) => setDates({...dates, pickupDate: new Date(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Drop-off Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={format(dates.dropoffDate, 'yyyy-MM-dd')}
                      onChange={(e) => setDates({...dates, dropoffDate: new Date(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              {availabilityStatus === 'available' && (
                <Alert className="bg-green-500/20 text-green-500 border-green-500">
                  <AlertDescription>
                    Vehicle is available for the selected dates!
                  </AlertDescription>
                </Alert>
              )}

              {availabilityStatus === 'unavailable' && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Sorry, the vehicle is not available for these dates. Please try different dates.
                  </AlertDescription>
                </Alert>
              )}

              <button
                onClick={checkAvailability}
                disabled={isCheckingAvailability}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 rounded-md transition-colors flex items-center justify-center"
              >
                {isCheckingAvailability ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Checking Availability...
                  </>
                ) : (
                  'Check Availability'
                )}
              </button>
            </div>
          </div>
        </div>
  
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          vehicle={vehicle}
          onProceedToPayment={handleProceedToPayment}
        />
      </div>
    );
};