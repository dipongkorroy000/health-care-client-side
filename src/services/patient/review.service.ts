"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {server_fetch} from "@/lib/server-fetch";
import {IReviewFormData} from "@/types/review.interface";

export async function getReviews(queryString?: string) {
  try {
    const url = queryString ? `/review?${queryString}` : "/review";

    const response = await server_fetch.get(url);
    const result = await response.json();

    return {success: true, data: result.data, meta: result.meta};
  } catch (error: any) {
    console.error("Get reviews error:", error);

    return {success: false, message: error.message || "Failed to fetch reviews", data: null};
  }
}

export async function createReview(data: IReviewFormData) {
  try {
    const response = await server_fetch.post("/review", {
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"},
    });
    const result = await response.json();

    return result;
  } catch (error: any) {
    console.error("Error creating review:", error);

    return {success: false, message: process.env.NODE_ENV === "development" ? error.message : "Failed to create review"};
  }
}
