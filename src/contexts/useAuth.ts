import { useContext } from "react";
import { AuthContext } from "./AuthContext"; // Adjust the path if needed

export const useAuth = () => useContext(AuthContext)