
import SpecialtiesManagementHeader from "@/components/modules/admin/specialtiesManagement/SpecialtiesManagementHeader";
import SpecialtiesTable from "@/components/modules/admin/specialtiesManagement/SpecialtiesTable";
import RefreshButton from "@/components/shared/RefreshButton";
import {TableSkeleton} from "@/components/shared/TableSkeleton";
import {getSpecialties} from "@/services/admin/specialtyManagement";
import {Suspense} from "react";

const AdminSpecialtiesManagementPage = async () => {
  const result = await getSpecialties();
  return (
    <div className="space-y-6">
      <SpecialtiesManagementHeader />

      <div className="flex">
        <RefreshButton />
      </div>
      
      <Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
        <SpecialtiesTable specialties={result.data} />
      </Suspense>
    </div>
  );
};

export default AdminSpecialtiesManagementPage;
