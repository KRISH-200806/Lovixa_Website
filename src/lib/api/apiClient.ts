/**
 * Centralized API Client for external Node.js / Express.js / MongoDB Backend.
 * 
 * Supports:
 * - Environment variable based Base URL (`NEXT_PUBLIC_API_URL`)
 * - JWT / Bearer Token authorization headers
 * - Standardized GET, POST, PUT, PATCH, DELETE methods
 * - Centralized Error handling and response parsing
 */

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  statusCode?: number
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:5000/api')

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '')
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem('lovixa_auth_token')
    } catch {
      return null
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    const token = this.getAuthToken()
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      let responseData: unknown = null
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        responseData = await response.json()
      } else {
        responseData = await response.text()
      }

      if (!response.ok) {
        const errorMessage =
          (responseData as Record<string, unknown>)?.message ||
          (responseData as Record<string, unknown>)?.error ||
          `Request failed with status ${response.status}`
        return {
          success: false,
          error: String(errorMessage),
          statusCode: response.status,
        }
      }

      return {
        success: true,
        data: (responseData as Record<string, unknown>)?.data !== undefined
          ? (responseData as Record<string, unknown>).data as T
          : (responseData as T),
        message: (responseData as Record<string, unknown>)?.message as string | undefined,
        statusCode: response.status,
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Network error. Please try again.'
      return {
        success: false,
        error: errorMsg,
        statusCode: 0,
      }
    }
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  public patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
