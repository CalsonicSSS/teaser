// from home page to send api to process user query in the backend

export async function sendUserQueryApi(userQuery: string): Promise<Response> {
  console.log("http://chainn-publi-wuqhol69ne6p-2038441586.us-east-1.elb.amazonaws.com/query");

  const response = await fetch("http://chainn-publi-wuqhol69ne6p-2038441586.us-east-1.elb.amazonaws.com/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userQuery: userQuery }),
  });
  return response;
}
