// from home page to send api to process user query in the backend

export async function sendUserQueryApi(userQuery: string): Promise<Response> {
  const response = await fetch("https://api.chainnect.ai/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userQuery: userQuery }),
  });
  return response;
}
