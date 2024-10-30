import { VehicleDetails } from '@/modules/vehicle-details/views/VehicleDetails';
interface PageProps {
  params: {
    id: string;
  }
}

export default async function Page({ params }: PageProps) {
  return (
    <div className='pt-[49px]  '>
      <VehicleDetails vehicleId={params.id} />
    </div>
  )
}