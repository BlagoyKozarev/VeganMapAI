import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const login = async () => {
    // Redirect to Replit Auth
    window.location.href = '/auth/replit';
  };

  const logout = async () => {
    // Logout endpoint
    window.location.href = '/auth/logout';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };
}
