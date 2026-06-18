type ErrorResponse = {        // response body padhna
  json: () => Promise<unknown>; 
  status: number;   // 404,500 
  statusText: string;   // not found,"internal server error"
};

export async function getErrorMessage(response: ErrorResponse) {
  try {
    const data = (await response.json()) as { error?: string };
    if (typeof data.error === "string" && data.error.length > 0) {
      return data.error;
    }
  } catch {
    // Ignore invalid error payloads and fall back to the status text below.
  }

  return response.statusText || `Request failed with status ${response.status}`;
};
