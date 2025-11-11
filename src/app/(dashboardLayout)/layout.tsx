import LogoutButton from "@/components/shared/LogoutButton";
import { getCookie } from "@/services/auth/tokenHandler";
import React from "react";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const accessToken = await getCookie("accessToken");
  return (
    <div>
      {accessToken && <LogoutButton></LogoutButton>}
      {children}
    </div>
  );
};

export default DashboardLayout;
