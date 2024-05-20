// from home page to send api to process user query in the backend
// test change for git hub account switch
import { local, renderProd } from "@/constants/apiDomain";

export async function sendUserQueryApi(userQuery: string): Promise<Response> {
  const response = await fetch(`${renderProd}/query/teaser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_query: userQuery }),
  });
  return response;
}
