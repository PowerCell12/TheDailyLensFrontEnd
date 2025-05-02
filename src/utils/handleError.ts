import { To } from "react-router-dom";

type NavigateFunction =
  (to: To, options?: { replace?: boolean; state?: unknown }) => void
  | ((delta: number) => void);


export default function handleError(error: Error, navigate: NavigateFunction) {
    const status = error.message.split(" - ")[0]
    const statusText = error.message.split(" - ")[1]
    
    navigate(`/error/${status}/${statusText}`)
}
