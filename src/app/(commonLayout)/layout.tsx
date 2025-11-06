import PublicNavbar from "@/components/shared/PublicNavbar";
import React from "react";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PublicNavbar></PublicNavbar>
      {children}
    </>
  );
};

export default CommonLayout;
