import DoctorsManagementHeader from "@/components/modules/admin/doctorsManagement/DoctorsManagementHeader";
import DoctorsTable from "@/components/modules/admin/doctorsManagement/DoctorsTable";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import TablePagination from "@/components/shared/TablePagination";
import {TableSkeleton} from "@/components/shared/TableSkeleton";
import {queryStringFormatter} from "@/lib/formatters";
import {getDoctors} from "@/services/admin/doctorManagement";
import {getSpecialties} from "@/services/admin/specialtyManagement";
import {ISpecialty} from "@/types/specialties.interface";
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
      <DoctorsManagementHeader specialties={specialtiesResult?.data || []} />

      <div className="flex space-x-2">
        <SearchFilter paramName="searchTerm" placeholder="Search doctors..." />
        <SelectFilter
          paramName="specialty" // ?specialty="Cardiology"
          options={specialtiesResult.data.map((specialty: ISpecialty) => ({
            label: specialty.title,
            value: specialty.title,
          }))}
          placeholder="Filter by specialty"
        />
        <RefreshButton />
      </div>

      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <DoctorsTable doctors={doctorsResult.data} specialties={specialtiesResult?.data || []} />

        <TablePagination currentPage={doctorsResult?.meta?.page || 1} totalPages={totalPages || 1} />
      </Suspense>
    </div>
  );
};

export default AdminDoctorsManagementPage;
