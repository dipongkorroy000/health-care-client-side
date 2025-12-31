/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import {server_fetch} from "@/lib/server-fetch";
import {zodValidator} from "@/lib/zodValidator";
import {createSpecialtyZodSchema} from "@/zod/specialties.validation";
import {revalidateTag} from "next/cache";

export async function createSpecialty(_prevState: any, formData: FormData) {
  try {
    const payload = {title: formData.get("title") as string}; // from data using

    if (zodValidator(payload, createSpecialtyZodSchema).success === false) return zodValidator(payload, createSpecialtyZodSchema);

    const validatedPayload = zodValidator(payload, createSpecialtyZodSchema).data; // zod validator safeParse

    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(validatedPayload));

    if (formData.get("file")) newFormData.append("file", formData.get("file") as Blob);

    const response = await server_fetch.post("/specialties", {body: newFormData});

    const result = await response.json();
    
    if (result.success) {
      revalidateTag("specialties-list", {expire: 0});
    }

    return result;
  } catch (error: any) {
    console.log(error);

    return {success: false, message: `${process.env.NODE_ENV === "development" ? error.message : "Something went wrong"}`};
  }
}

export async function getSpecialties() {
  try {
    const response = await server_fetch.get("/specialties", {
      next: {
        tags: ["specialties-list"],
        revalidate: 600, // 10 minutes - specialties rarely change
      },
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

export async function deleteSpecialty(id: string) {
  try {
    const response = await server_fetch.delete(`/specialties/${id}`);
    const result = await response.json();

    if (result.success) {
      revalidateTag("specialties-list", {expire: 0});
      revalidateTag(`specialty-${id}`, {expire: 0});
      revalidateTag("doctors-list", {expire: 0}); // Doctors have
    }

    return result;
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Something went wrong"}`,
    };
  }
}
