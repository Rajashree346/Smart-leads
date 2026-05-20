import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  type ReactNode,
  useState,
} from "react";
import type { UserResponse } from "../../api/generated/model";
import { useGetApiV1AuthMe } from "../../api/generated/authentication/authentication";



interface AuthContextType {
  user: UserResponse | null;

  isLoading: boolean;

  isAuthenticated: boolean;

  login: (
    token: string
  ) => void;

  logout: () => void;

  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [token, setToken] = useState(
  localStorage.getItem("token")
);

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetApiV1AuthMe({
    query: {
      enabled: !!token,
      retry: false,
    },
  });

  const user = response?.data ?? null;
  console.log(response);

  const refetchUser = useCallback(() => {
    refetch();
  }, [refetch]);

  const login = useCallback((newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    refetchUser();
  }, [refetchUser]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
  }, [refetchUser]);

  const isAuthenticated = useMemo(() => {
    return !!token && !isLoading && !!user;
  }, [token, isLoading, user]);

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      refetchUser,
    }),
    [user, isLoading, isAuthenticated, login, logout, refetchUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}