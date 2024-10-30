import FeaturedVehicles from "@/modules/featture-section/Featured";
import HeroSection from "@/modules/hero-section/Hero";
import QuickBooking from "@/modules/quick-booking/QuickBooking";

export default function Home() {
  return (
    <>
      <HeroSection/>  
      <QuickBooking/>
      <FeaturedVehicles/>
    </>
  );
}
