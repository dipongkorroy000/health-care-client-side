/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { parse } from "cookie";
import { cookies } from "next/headers";
import z from "zod";

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

    const result = await res.json();

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
      maxAge: parseInt(accessTokenObj["Max-Age"]),
      path: accessTokenObj.Path || "/",
      sameSite: accessTokenObj.SameSite,
    });

    (await cookies()).set("refreshToken", refreshTokenObj.refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(refreshTokenObj["Max-Age"]),
      path: refreshTokenObj.Path || "/",
      sameSite: refreshTokenObj.SameSite,
    });

    return result;
  } catch (error) {
    console.log(error);

    return { error: "Login failed" };
  }
};
