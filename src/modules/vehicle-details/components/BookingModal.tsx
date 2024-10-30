import React, { useState } from 'react';
import { Vehicle } from '@/modules/vehicle-fleet/types/types';
import { Clock, Calendar, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format, addDays } from 'date-fns';

interface BookingFormData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  dropoffDate: Date;
  pickupTime: string;
  dropoffTime: string;
}

const BookingModal = ({ 
  isOpen, 
  onClose, 
  vehicle, 
  onProceedToPayment 
}: { 
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onProceedToPayment: (data: BookingFormData) => void;
}) => {
  // States
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState<BookingFormData>({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: new Date(),
    dropoffDate: addDays(new Date(), 1),
    pickupTime: '10:00',
    dropoffTime: '10:00',
  });

  // Calculations
  const calculateTotalDays = () => {
    const diffTime = Math.abs(bookingData.dropoffDate.getTime() - bookingData.pickupDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };    

  const calculateTotalCost = () => {
    return (calculateTotalDays() * vehicle.dailyRate).toFixed(2);
  };

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  // Handlers
  const validateForm = () => {
    if (!bookingData.pickupLocation) {
      setError('Please enter pickup location');
      return false;
    }
    if (!bookingData.dropoffLocation) {
      setError('Please enter drop-off location');
      return false;
    }
    return true;
  };

  const handlePickupTimeChange = (time: string) => {
    setBookingData({
      ...bookingData,
      pickupTime: time,
      dropoffTime: time // Sync dropoff time with pickup time
    });
  };

  const handlePickupDateChange = (date: string) => {
    const newPickupDate = new Date(date);
    const newDropoffDate = addDays(newPickupDate, 1);
    
    setBookingData({
      ...bookingData,
      pickupDate: newPickupDate,
      dropoffDate: newDropoffDate
    });
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateForm()) {
        setError('');
        setStep(2);
      }
    } else {
      onProceedToPayment(bookingData);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#0A0A0A] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === 1 ? 'Select Pickup & Drop-off' : 'Confirm Booking'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="mt-4">
          {step === 1 ? (
            <div className="space-y-4">
              {/* Pickup Location */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-9 p-2 text-sm bg-[#1A1A1A] border border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter pickup location"
                    value={bookingData.pickupLocation}
                    onChange={(e) => setBookingData({...bookingData, pickupLocation: e.target.value})}
                  />
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Drop-off Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-9 p-2 text-sm bg-[#1A1A1A] border border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter drop-off location"
                    value={bookingData.dropoffLocation}
                    onChange={(e) => setBookingData({...bookingData, dropoffLocation: e.target.value})}
                  />
                </div>
              </div>

              {/* Date and Time Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Pickup Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      min={today}
                      className="w-full pl-9 p-2 text-sm bg-[#1A1A1A] border border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500"
                      value={format(bookingData.pickupDate, 'yyyy-MM-dd')}
                      onChange={(e) => handlePickupDateChange(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Pickup Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      className="w-full pl-9 p-2 text-sm bg-[#1A1A1A] border border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500"
                      value={bookingData.pickupTime}
                      onChange={(e) => handlePickupTimeChange(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Drop-off Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      min={tomorrow}
                      className="w-full pl-9 p-2 text-sm bg-[#1A1A1A] border border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500"
                      value={format(bookingData.dropoffDate, 'yyyy-MM-dd')}
                      onChange={(e) => setBookingData({...bookingData, dropoffDate: new Date(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Drop-off Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      className="w-full pl-9 p-2 text-sm bg-[#1A1A1A] border border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500"
                      value={bookingData.dropoffTime}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Step 2: Booking Summary
            <div className="space-y-4">
              <div className="bg-[#1A1A1A] p-4 rounded-md space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Pickup</span>
                  <span>{bookingData.pickupLocation}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Drop-off</span>
                  <span>{bookingData.dropoffLocation}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Duration</span>
                  <span>{calculateTotalDays()} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Daily Rate</span>
                  <span>${vehicle.dailyRate}/day</span>
                </div>
                <div className="pt-3 border-t border-gray-700 flex justify-between font-semibold">
                  <span>Total Cost</span>
                  <span>${calculateTotalCost()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {step === 2 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors ${
                step === 2 ? '' : 'ml-auto'
              }`}
            >
              {step === 1 ? 'Continue' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;  