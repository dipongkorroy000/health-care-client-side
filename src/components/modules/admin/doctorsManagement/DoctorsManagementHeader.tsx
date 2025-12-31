"use client";

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import {ISpecialty} from "@/types/specialties.interface";
import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import DoctorFormDialog from "./DoctorFormDialog";

interface DoctorsManagementHeaderProps {
  specialties?: ISpecialty[];
}

const DoctorsManagementHeader = ({specialties}: DoctorsManagementHeaderProps) => {
  const router = useRouter();

  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    startTransition(() => router.refresh());
  };

  const [dialogKey, setDialogKey] = useState(0);

  return (
    <>
      <DoctorFormDialog key={dialogKey} open={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSuccess={handleSuccess} specialties={specialties} />

      <ManagementPageHeader
        title="Doctors Management"
        description="Manage Doctors information and details"
        action={{
          label: "Add Doctor",
          icon: Plus,
          onClick: () => {
            setIsDialogOpen(true);
            setDialogKey((prev) => prev + 1);
          },
        }}
      />
    </>
  );
};

export default DoctorsManagementHeader;
