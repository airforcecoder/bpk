import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useEffect(() => {
    async function validateSession() {
      try {
        const response = await fetch(
          "/api/auth/session",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          setIsAuthenticated(false);
          return;
        }

        const data = await response.json();

        setIsAuthenticated(
          data.authenticated === true
        );
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    validateSession();
  }, []);

  if (isLoading) {
    return <p>Checking authentication...</p>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <>{children}</>;
}