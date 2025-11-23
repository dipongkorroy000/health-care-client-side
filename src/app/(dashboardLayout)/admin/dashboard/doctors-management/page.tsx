import DoctorFilters from "@/components/modules/admin/doctorsManagement/DoctorsFilter";
import DoctorsManagementHeader from "@/components/modules/admin/doctorsManagement/DoctorsManagementHeader";
import DoctorsTable from "@/components/modules/admin/doctorsManagement/DoctorsTable";
import TablePagination from "@/components/shared/TablePagination";
import {TableSkeleton} from "@/components/shared/TableSkeleton";
import {queryStringFormatter} from "@/lib/formatters";
import {getDoctors} from "@/services/admin/doctorManagement";
import {getSpecialties} from "@/services/admin/specialtyManagement";
import {Suspense} from "react";

const AdminDoctorsManagementPage = async ({searchParams}: {searchParams: Promise<{[key: string]: string | string[] | undefined}>}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj); // {searchTerm: "John", specialty: "Cardiology" => "?searchTerm=John&specialty=Cardiology"}

  const specialtiesResult = await getSpecialties();

  const doctorsResult = await getDoctors(queryString);
  // console.log(doctorsResult?.data);

  const totalPages = Math.ceil((doctorsResult?.meta?.total || 1) / (doctorsResult?.meta?.limit || 1));

  return (
    <div className="space-y-6">
      {/* add doctor */}
      <DoctorsManagementHeader specialties={specialtiesResult?.data || []} />

      {/* search and filter doctors */}
      <DoctorFilters specialties={specialtiesResult?.data || []} />

      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <DoctorsTable doctors={doctorsResult.data} specialties={specialtiesResult?.data || []} />

        <TablePagination currentPage={doctorsResult?.meta?.page || 1} totalPages={totalPages || 1} />
      </Suspense>
    </div>
  );
};

export default AdminDoctorsManagementPage;
