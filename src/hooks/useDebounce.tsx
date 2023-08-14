import { useRef } from 'react'

const useDebounce = (
  functionToDebounce: Function,
  timeInMS: number
) => {
  const timerRef = useRef<NodeJS.Timeout | number | null>(null)

  const debouncedFunction = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    timerRef.current = setTimeout(functionToDebounce, timeInMS)
  }

  return debouncedFunction
}

export default useDebounce
