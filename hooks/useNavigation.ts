import { useCallback } from "react"

export function useNavigation() {
  const navigate = useCallback((path: string) => {
    window.location.href = path
  }, [])

  return { navigate }
}

