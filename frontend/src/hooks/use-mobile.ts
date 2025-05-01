import * as React from "react"

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
}

type Breakpoint = keyof typeof breakpoints

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoints.md - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoints.md)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < breakpoints.md)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useBreakpoint(breakpoint: Breakpoint) {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoints[breakpoint] - 1}px)`)
    const onChange = () => {
      setIsBelow(window.innerWidth < breakpoints[breakpoint])
    }
    mql.addEventListener("change", onChange)
    setIsBelow(window.innerWidth < breakpoints[breakpoint])
    return () => mql.removeEventListener("change", onChange)
  }, [breakpoint])

  return !!isBelow
}
