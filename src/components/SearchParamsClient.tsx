"use client";

import {useSearchParams} from "next/navigation";

export default function SearchParamsClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return <div>ID: {id}</div>;
}
