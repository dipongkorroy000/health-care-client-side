"use server";

import {server_fetch} from "@/lib/server-fetch";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function initiatePayment(appointmentId: string) {
  try {
    const response = await server_fetch.post(`/appointment/${appointmentId}/initiate-payment`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    return result;
  } catch (error: any) {
    console.error("Error initiating payment:", error);

    return {
      success: false,
      message: process.env.NODE_ENV === "development" ? error.message : "Failed to initiate payment",
    };
  }
}

export async function getPaymentStatus(appointmentId: string) {
  try {
    const response = await server_fetch.get(`/payment/status/${appointmentId}`);
    const result = await response.json();

    return result;
  } catch (error: any) {
    console.error("Error fetching payment status:", error);

    return {
      success: false,
      message: process.env.NODE_ENV === "development" ? error.message : "Failed to fetch payment status",
    };
  }
}
