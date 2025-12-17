export interface EndpointParameter {
  name: string
  type: string
  required: boolean
  description: string
  options?: string[]
  default?: string | number | boolean
}

export interface Endpoint {
  id: string
  name: string
  description: string
  method: string
  path: string
  category: 'authentication' | 'reports' | 'events'
  parameters: EndpointParameter[]
}

export interface ValidationResult {
  endpoint_id: string
  endpoint_name: string
  success: boolean
  status_code: number
  response_time_ms: number
  timestamp: string
  request_url: string
  request_params: Record<string, unknown>
  response_data?: unknown
  error_message?: string
  data_count?: number
  latest_data_date?: string
}

export interface HealthCheckResult {
  overall_status: 'healthy' | 'degraded' | 'unhealthy'
  total_endpoints: number
  successful: number
  failed: number
  total_time_ms: number
  timestamp: string
  results: ValidationResult[]
}

export interface Account {
  id: string
  name: string
  [key: string]: unknown
}

export interface TokenValidation {
  valid: boolean
  accounts: Account[]
  error?: string
}
