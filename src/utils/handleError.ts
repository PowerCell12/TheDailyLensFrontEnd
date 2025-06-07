import { To } from "react-router-dom";

type NavigateFunction =
  (to: To, options?: { replace?: boolean; state?: unknown }) => void
  | ((delta: number) => void);


export default function handleError(error: Error, navigate: NavigateFunction) {
    const statusText = error.message.split(" - ")[1]
    const status = error.message.split(" - ")[0]
    
    navigate(`/error/${status}/${statusText}`)
}
