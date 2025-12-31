"use server";

import { redirect } from "next/navigation";
import { deleteCookie } from "./tokenHandler";

export const logoutUser = async () => {
  await deleteCookie("accessToken");
  await deleteCookie("refreshToken");

  redirect("/login?loggedOut=true"); // loggedOut="true" -> set this path because when it's true showing logout toast
};
