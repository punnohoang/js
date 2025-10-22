"use client"

import { useState, useCallback } from "react"
import type { ApiResponse } from "@/lib/api-client"

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void,
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    const response = await apiCall()

    if (response.success && response.data) {
      setData(response.data)
      onSuccess?.(response.data)
    } else {
      const errorMsg = response.error || "An error occurred"
      setError(errorMsg)
      onError?.(errorMsg)
    }

    setLoading(false)
  }, [apiCall, onSuccess, onError])

  return { data, loading, error, execute }
}
