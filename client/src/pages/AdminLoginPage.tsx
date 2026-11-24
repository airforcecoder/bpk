import AdminLoginForm from "../components/admin/AdminLoginForm";
import { ApiAuthService } from "../services/authentication/APIAuthService";
import { Navigate } from "react-router";
import { useEffect, useState } from "react";

const authService = new ApiAuthService();

export default function AdminLoginPage() {
  const [checkingSession, setCheckingSession] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(
          "/api/auth/session",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          setAuthenticated(false);
          return;
        }

        const data =
          await response.json();

        setAuthenticated(
          data.authenticated === true
        );
      } catch {
        setAuthenticated(false);
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, []);

  if (checkingSession) {
    return <p>Checking authentication...</p>;
  }

  if (authenticated) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }
  return (
    <AdminLoginForm authService={authService} />
  );
}