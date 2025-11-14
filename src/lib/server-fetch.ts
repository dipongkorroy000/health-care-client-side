import {getCookie} from "@/services/auth/tokenHandler";

const backend_api_url = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

async function server_fetch_helper(endpoint: string, options: RequestInit): Promise<Response> {
  const {headers, ...restOptions} = options;

  const accessToken = await getCookie("accessToken");

  const response = await fetch(`${backend_api_url}${endpoint}`, {
    headers: {
      ...headers,
      // (accessToken ? {"Authorization": `Bearer ${accessToken}`}: {}),
      // (accessToken ? {"Authorization": accessToken}: {}),

      Cookie: accessToken ? `accessToken = ${accessToken}` : "",
    },
    ...restOptions,
  });

  return response;
}

export const server_fetch = {
  get: async (endpoint: string, options: RequestInit): Promise<Response> => server_fetch_helper(endpoint, {...options, method: "GET"}),
  post: async (endpoint: string, options: RequestInit): Promise<Response> => server_fetch_helper(endpoint, {...options, method: "POST"}),
  put: async (endpoint: string, options: RequestInit): Promise<Response> => server_fetch_helper(endpoint, {...options, method: "PUT"}),
  patch: async (endpoint: string, options: RequestInit): Promise<Response> => server_fetch_helper(endpoint, {...options, method: "PATCH"}),
  delete: async (endpoint: string, options: RequestInit): Promise<Response> => server_fetch_helper(endpoint, {...options, method: "DELETE"}),
};

/**
 *
 * server_fetch.get("/auth/me")
 * server_fetch.post("/auth/login", {body : JSON.stringify({})})
 */

/** video - 03 running */
