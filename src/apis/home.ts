// from home page to send api to process user query in the backend

import { local, prod } from "@/constants/apiDomain";

export async function sendUserQueryApi(userQuery: string): Promise<Response> {
  const response = await fetch(`${prod}/query/teaser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userQuery: userQuery }),
  });
  return response;
}
