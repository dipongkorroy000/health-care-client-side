/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {server_fetch} from "@/lib/server-fetch";
import getUserInfo from "../auth/getUserInfo";

export async function getDashboardMetaData() {
  try {
    const userInfo = await getUserInfo();
    const cacheTag = `${userInfo.role.toLowerCase()}-dashboard-meta`;

    const response = await server_fetch.get("/meta", {
      next: {tags: [cacheTag, "dashboard-meta", "meta-data"], revalidate: 30}, // 30s after revalidate
    });
    const result = await response.json();

    return result;
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Something went wrong"}`,
    };
  }
}
