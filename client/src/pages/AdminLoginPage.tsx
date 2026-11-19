import AdminLoginForm from "../components/admin/AdminLoginForm";
import { ApiAuthService } from "../services/authentication/APIAuthService";
import { Navigate } from "react-router";
import { isAuthenticated } from "../services/authentication/authStorage";

const authService = new ApiAuthService();

export default function AdminLoginPage() {
  if (isAuthenticated()) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return (
    <AdminLoginForm authService={authService} />
  );
}