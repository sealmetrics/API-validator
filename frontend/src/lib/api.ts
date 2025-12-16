const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function validateToken(apiToken: string) {
  const response = await fetch(`${API_BASE}/validate/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_token: apiToken }),
  })
  return response.json()
}

export async function getEndpoints() {
  const response = await fetch(`${API_BASE}/endpoints`)
  return response.json()
}

export async function validateEndpoint(
  apiToken: string,
  endpointId: string,
  parameters: Record<string, unknown>
) {
  const response = await fetch(`${API_BASE}/validate/endpoint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_token: apiToken,
      endpoint_id: endpointId,
      parameters,
    }),
  })
  return response.json()
}

export async function runHealthCheck(apiToken: string, accountId: string) {
  const response = await fetch(`${API_BASE}/validate/health-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_token: apiToken,
      account_id: accountId,
    }),
  })
  return response.json()
}
