/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {UserInfo} from "@/types/user.interface";
import {server_fetch} from "@/lib/server-fetch";

const getUserInfo = async (): Promise<UserInfo | any> => {
  let userInfo: UserInfo | any;

  try {
    const response = await server_fetch.get("/auth/me", {
      next: {tags: ["user-info"], revalidate: 180}, // 180s after revalidate this api
    });

    const result = await response.json();

    userInfo = {name: result.data?.admin?.name || result.data?.doctor?.name || result.data?.patient?.name || "Unknown User", ...result.data};

    return userInfo;
  } catch (error: any) {
    console.log(error);

    return {id: "", name: "Unknown User", email: "", role: "PATIENT"};
  }
};

export default getUserInfo;
