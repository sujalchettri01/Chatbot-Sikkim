type RunChatAgentInput = {
  message: string;
};

type LamaticGraphQLResponse = {
  data?: {
    executeWorkflow?: {
      status?: string;
      result?: unknown;
    };
  };
  errors?: Array<{
    message?: string;
  }>;
};

export async function runChatAgent({ message }: RunChatAgentInput) {
  const apiUrl = process.env.LAMATIC_API_URL;
  const apiKey = process.env.LAMATIC_API_KEY;
  const projectId = process.env.LAMATIC_PROJECT_ID;
  const workflowId = process.env.CHATBOT_FLOW_ID;

  if (!apiUrl) {
    throw new Error("Missing LAMATIC_API_URL in .env");
  }

  if (!apiKey) {
    throw new Error("Missing LAMATIC_API_KEY in .env");
  }

  if (!projectId) {
    throw new Error("Missing LAMATIC_PROJECT_ID in .env");
  }

  if (!workflowId) {
    throw new Error("Missing CHATBOT_FLOW_ID in .env");
  }

  const query = `
    query Execute($workflowId: String!, $payload: JSON!) {
      executeWorkflow(workflowId: $workflowId, payload: $payload) {
        status
        result
      }
    }
  `;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "x-project-id": projectId,
    },
    body: JSON.stringify({
      query,
      variables: {
        workflowId,
        payload: {
          message,
        },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(`Lamatic request failed: ${response.status} ${raw}`);
  }

  const data = (await response.json()) as LamaticGraphQLResponse;

  if (data.errors?.length) {
    throw new Error(data.errors[0]?.message || "Lamatic GraphQL error");
  }

  const executeWorkflow = data.data?.executeWorkflow;

  if (!executeWorkflow) {
    throw new Error("No workflow response received from Lamatic");
  }

  return executeWorkflow.result;
}