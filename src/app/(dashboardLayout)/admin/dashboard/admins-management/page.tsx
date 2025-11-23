import AdminsFilter from "@/components/modules/admin/adminManagement/AdminFilter";
import AdminManagementHeader from "@/components/modules/admin/adminManagement/AdminManagementHeader";
import AdminTable from "@/components/modules/admin/adminManagement/AdminTable";
import TablePagination from "@/components/shared/TablePagination";
import {TableSkeleton} from "@/components/shared/TableSkeleton";
import {queryStringFormatter} from "@/lib/formatters";
import {getAdmins} from "@/services/admin/adminManagement";
import {Suspense} from "react";

const AdminAdminsManagementPage = async ({searchParams}: {searchParams: Promise<{[key: string]: string | string[] | undefined}>}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const adminsResult = await getAdmins(queryString);

  const totalPages = Math.ceil((adminsResult?.meta?.total || 1) / (adminsResult?.meta?.limit || 1));

  return (
    <div className="space-y-6">
      {/* add admin */}
      <AdminManagementHeader />

      {/* Search, Filters */}
      <AdminsFilter />

      <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
        <AdminTable admins={adminsResult?.data || []} />
        <TablePagination currentPage={adminsResult?.meta?.page || 1} totalPages={totalPages || 1} />
      </Suspense>
    </div>
  );
};

export default AdminAdminsManagementPage;
