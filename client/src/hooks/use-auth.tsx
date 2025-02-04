import { ReactNode, createContext, useContext } from "react";
import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import type { User } from "@db/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: ReturnType<typeof useLogin>;
  logoutMutation: ReturnType<typeof useLogout>;
  registerMutation: ReturnType<typeof useRegister>;
};

type LoginData = Pick<User, "username"> & { password: string };
type RegisterData = LoginData & { isAdmin?: boolean };

function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
    },
  });
}

function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
    },
  });
}

function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", data);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
    },
  });
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User>({
    queryKey: ["/api/user"],
    retry: false,
  });

  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error: error as Error | null,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
