/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { parse } from "cookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/auth-utils";

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

    // console.log("setCookie", accessTokenObj["Max-Age"], refreshTokenObj);

    if (!accessTokenObj || !refreshTokenObj) throw new Error("No Set-Cookie header found");

    (await cookies()).set("accessToken", accessTokenObj.accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(accessTokenObj["Max-Age"] || 1000 * 60 * 60 * 24),
      path: accessTokenObj.Path || "/",
      sameSite: accessTokenObj.SameSite || "none",
    });

    (await cookies()).set("refreshToken", refreshTokenObj.refreshToken, {
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

    if (redirectTo) {
      const requestedPath = redirectTo.toString();

      if (isValidRedirectForRole(requestedPath, userRole)) redirect(requestedPath);
      else redirect(getDefaultDashboardRoute(userRole));
    }
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;

    console.log(error);

    return { error: "Login failed" };
  }
};
