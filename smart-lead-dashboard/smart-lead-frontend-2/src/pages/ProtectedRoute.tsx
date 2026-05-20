import {
  Navigate,
} from "react-router-dom";
import { useAuth } from "../components/provider/AuthProvider";


interface Props {
  children:
    React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  /**
   * Auth hydration loading
   */
  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  /**
   * Not authenticated
   */
  if (
    !isAuthenticated
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /**
   * Authenticated
   */
  return children;
}