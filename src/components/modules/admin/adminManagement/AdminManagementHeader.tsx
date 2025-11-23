"use client";

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import AdminFormDialog from "./AdminFormDialog";

const AdminManagementHeader = () => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    startTransition(() => router.refresh());
  };

  //force remount to reset state of form
  const [dialogKey, setDialogKey] = useState(0);

  return (
    <>
      <AdminFormDialog key={dialogKey} open={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSuccess={handleSuccess} />

      <ManagementPageHeader
        title="Admins Management"
        description="Manage admin accounts and permissions"
        action={{
          label: "Add Admin",
          icon: Plus,
          onClick: () => {
            setDialogKey((prev) => prev + 1); // Force remount
            setIsDialogOpen(true);
          },
        }}
      />
    </>
  );
};

export default AdminManagementHeader;
