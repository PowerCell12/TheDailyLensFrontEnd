import { To } from "react-router-dom";

type NavigateFunction =
  (to: To, options?: { replace?: boolean; state?: unknown }) => void
  | ((delta: number) => void);


export default function handleError(error: Error, navigate: NavigateFunction) {
    const statusText = error.message
    const status = "500"
    
    navigate(`/error/${status}/${statusText}`)
}
