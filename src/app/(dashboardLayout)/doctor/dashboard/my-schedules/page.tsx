import MySchedulesFilters from "@/components/modules/doctor/my-schedules/MyScheduleFilters";
import MySchedulesHeader from "@/components/modules/doctor/my-schedules/MyScheduleHeader";
import MySchedulesTable from "@/components/modules/doctor/my-schedules/MyScheduleTable";
import TablePagination from "@/components/shared/TablePagination";
import {TableSkeleton} from "@/components/shared/TableSkeleton";
import {queryStringFormatter} from "@/lib/formatters";
import {getAvailableSchedules, getDoctorOwnSchedules} from "@/services/doctor/doctorSchedule.service";
import {Suspense} from "react";

interface DoctorMySchedulesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    isBooked?: string;
  }>;
}

const DoctorMySchedulesPage = async ({searchParams}: DoctorMySchedulesPageProps) => {
  const params = await searchParams;

  const queryString = queryStringFormatter(params);
  const myDoctorsScheduleResponse = await getDoctorOwnSchedules(queryString);
  const availableSchedulesResponse = await getAvailableSchedules();

  // console.log( availableSchedulesResponse.data.data);

  const schedules = myDoctorsScheduleResponse?.data || [];
  const meta = myDoctorsScheduleResponse?.data.meta;
  const totalPages = Math.ceil((meta?.total || 1) / (meta?.limit || 1));

  return (
    <div className="space-y-6">
      <MySchedulesHeader availableSchedules={availableSchedulesResponse?.data.data || []} />

      <MySchedulesFilters />

      <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
        <MySchedulesTable schedules={schedules} />
        <TablePagination currentPage={meta?.page || 1} totalPages={totalPages || 1} />
      </Suspense>
    </div>
  );
};

export default DoctorMySchedulesPage;
