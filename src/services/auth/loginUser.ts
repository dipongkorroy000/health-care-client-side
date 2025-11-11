/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { parse } from "cookie";

import { redirect } from "next/navigation";
import z from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/auth-utils";
import { setCookie } from "./tokenHandler";

const loginValidationZodSchema = z.object({
  email: z.email({ message: "Email is required" }),
  password: z
    .string("Password is required")
    .min(6, { error: "Password is required and must be at least 6 characters long" })
    .max(100, { error: "Password must be at most 100 characters long" }),
});

export const loginUser = async (_currentState: any, formData: any): Promise<any> => {
  try {
    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const redirectTo = formData.get("redirect") || null;
    const validatedFields = loginValidationZodSchema.safeParse(loginData);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.issues.map((issue) => ({ field: issue.path[0], message: issue.message })),
      };
    }

    const res = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: { "Content-Type": "application/json" },
    });
    const setCookieHeaders = res.headers.getSetCookie();

    let accessTokenObj: null | any = null;
    let refreshTokenObj: null | any = null;

    // cookie parse by cookie npm package using
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parsedCookie = parse(cookie);

        if (parsedCookie["accessToken"]) accessTokenObj = parsedCookie;
        if (parsedCookie.refreshToken) refreshTokenObj = parsedCookie;
      });
    }

    // when login -> accessToken fetch backend -> then set accessToken frontend web

    if (!accessTokenObj || !refreshTokenObj) throw new Error("No Set-Cookie header found");

    await setCookie("accessToken", accessTokenObj.accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(accessTokenObj["Max-Age"] || 1000 * 60 * 60 * 24),
      path: accessTokenObj.Path || "/",
      sameSite: accessTokenObj.SameSite || "none",
    });

    await setCookie("refreshToken", refreshTokenObj.refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(refreshTokenObj["Max-Age"]) || 1000 * 60 * 60 * 24 * 30,
      path: refreshTokenObj.Path || "/",
      sameSite: refreshTokenObj.SameSite || "none",
    });

    const verifiedToken: JwtPayload | string = jwt.verify(accessTokenObj.accessToken, process.env.JWT_SECRET as string);

    if (typeof verifiedToken === "string") {
      throw new Error("Invalid token");
    }

    const userRole: UserRole = verifiedToken.role;

    const result = await res.json();
    if (!result.success) throw new Error(result.message || "Login failed");

    if (redirectTo) {
      // when user get any protected route then navigate login and again protected route navigate
      const requestedPath = redirectTo.toString();

      if (isValidRedirectForRole(requestedPath, userRole)) redirect(requestedPath);
      else redirect(getDefaultDashboardRoute(userRole));
      // ------
    } else redirect(getDefaultDashboardRoute(userRole)); // when user just login then call this
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;

    console.log(error);

    return {
      success: false,
      message: process.env.NODE_ENV === "development" ? error.message : "Login failed. You might have entered incorrect email or password.",
    };
  }
};
