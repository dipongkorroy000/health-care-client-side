/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {server_fetch} from "@/lib/server-fetch";
import {zodValidator} from "@/lib/zodValidator";
import {IDoctor} from "@/types/doctor.interface";
import {createDoctorZodSchema, updateDoctorZodSchema} from "@/zod/doctors.validation";

export async function createDoctor(_prevState: any, formData: FormData) {
  // Parse specialties array
  const specialtiesString = formData.get("specialties") as string;

  let specialties: string[] = [];
  if (specialtiesString) {
    try {
      specialties = JSON.parse(specialtiesString);
      if (!Array.isArray(specialties)) specialties = [];
    } catch {
      specialties = [];
    }
  }

  const experienceValue = formData.get("experience");
  const appointmentFeeValue = formData.get("appointmentFee");

  const payload: IDoctor = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    contactNumber: formData.get("contactNumber") as string,
    address: formData.get("address") as string,
    registrationNumber: formData.get("registrationNumber") as string,
    experience: experienceValue ? Number(experienceValue) : 0,
    gender: formData.get("gender") as "MALE" | "FEMALE",
    appointmentFee: appointmentFeeValue ? Number(appointmentFeeValue) : 0,
    qualification: formData.get("qualification") as string,
    currentWorkingPlace: formData.get("currentWorkingPlace") as string,
    designation: formData.get("designation") as string,
    password: formData.get("password") as string,
    specialties: specialties,
    profilePhoto: formData.get("file") as File,
  };
  // if (zodValidator(payload, createDoctorZodSchema).success === false) return zodValidator(payload, createDoctorZodSchema);

  const validatedPayload = zodValidator(payload, createDoctorZodSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: validatedPayload.success,
      message: "Validation failed",
      formData: payload,
      errors: validatedPayload.errors,
    };
  }

  if (!validatedPayload.data) return {success: false, message: "Validation failed", formData: payload};

  const newPayload = {
    password: validatedPayload.data.password,
    doctor: {
      name: validatedPayload.data.name,
      email: validatedPayload.data.email,
      contactNumber: validatedPayload.data.contactNumber,
      address: validatedPayload.data.address,
      registrationNumber: validatedPayload.data.registrationNumber,
      experience: validatedPayload.data.experience,
      gender: validatedPayload.data.gender,
      appointmentFee: validatedPayload.data.appointmentFee,
      qualification: validatedPayload.data.qualification,
      currentWorkingPlace: validatedPayload.data.currentWorkingPlace,
      designation: validatedPayload.data.designation,
      specialties: validatedPayload.data.specialties,
    },
  };

  const newFormData = new FormData();
  newFormData.append("data", JSON.stringify(newPayload));
  newFormData.append("file", formData.get("file") as Blob);

  try {
    const response = await server_fetch.post("/user/create-doctor", {body: newFormData});

    return await response.json();
  } catch (error: any) {
    console.log(error);

    return {success: false, message: `${process.env.NODE_ENV === "development" ? error.message : "Something went wrong"}`};
  }
}

export async function getDoctors(queryString?: string) {
  try {
    const response = await server_fetch.get(`/doctors${queryString ? `?${queryString}` : ""}`);

    return await response.json();
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Something went wrong"}`,
    };
  }
}

export async function getDoctorById(id: string) {
  try {
    const response = await server_fetch.get(`/doctors/${id}`);

    return await response.json();
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Something went wrong"}`,
    };
  }
}

export async function updateDoctor(id: string, _prevState: any, formData: FormData) {
  try {
    const payload: Partial<IDoctor> = {
      name: formData.get("name") as string,
      contactNumber: formData.get("contactNumber") as string,
      address: formData.get("address") as string,
      registrationNumber: formData.get("registrationNumber") as string,
      experience: Number(formData.get("experience") as string),
      gender: formData.get("gender") as "MALE" | "FEMALE",
      appointmentFee: Number(formData.get("appointmentFee") as string),
      qualification: formData.get("qualification") as string,
      currentWorkingPlace: formData.get("currentWorkingPlace") as string,
      designation: formData.get("designation") as string,
    };

    const validatedPayload = zodValidator(payload, updateDoctorZodSchema).data;

    const response = await server_fetch.patch(`/doctors/${id}`, {
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(validatedPayload),
    });

    return await response.json();
  } catch (error: any) {
    console.log(error);

    return {success: false, message: `${process.env.NODE_ENV === "development" ? error.message : "Something went wrong"}`};
  }
}

export async function softDeleteDoctor(id: string) {
  try {
    const response = await server_fetch.delete(`/doctors/${id}`);

    return await response.json();
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Something went wrong"}`,
    };
  }
}

export async function deleteDoctor(id: string) {
  try {
    const response = await server_fetch.delete(`/doctors/${id}`);

    return await response.json();
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Something went wrong"}`,
    };
  }
}
