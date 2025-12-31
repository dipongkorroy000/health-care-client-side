import MyProfile from "@/components/modules/my-profile/MyProfile";
import getUserInfo from "@/services/auth/getUserInfo";

const MyProfilePage = async () => {
  const userInfo = await getUserInfo();

  return <MyProfile userInfo={userInfo} />;
};

export default MyProfilePage;
