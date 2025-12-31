import getUserInfo from "@/services/auth/getUserInfo";
import DashboardNavbarContent from "./DashboardNavbarContent";
import {UserInfo} from "@/types/user.interface";
import {getNavItemsByRole} from "@/lib/navItems.config";
import {getDefaultDashboardRoute} from "@/lib/auth-utils";
import {NavSection} from "@/types/dashboard.interface";

const DashboardNavbar = async () => {
  const userInfo = (await getUserInfo()) as UserInfo;

  const navItems: NavSection[] = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role);

  return <DashboardNavbarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome}></DashboardNavbarContent>;
};

export default DashboardNavbar;
