import DoctorProfileContent from "@/components/modules/doctor-details/DoctorProfileContent";
import DoctorReviews from "@/components/modules/doctor-details/DoctorReviews";
import {getDoctorById} from "@/services/admin/doctorManagement";

const DoctorDetailPage = async ({params}: {params: Promise<{id: string}>}) => {
  const {id} = await params;
  const result = await getDoctorById(id);
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <DoctorProfileContent doctor={result.data} />
      <DoctorReviews doctorId={id} />
    </div>
  );
};

export default DoctorDetailPage;
