import AdminLoginForm from "../components/admin/AdminLoginForm";
import { MockAuthService } from "../services/authentication/MockAuthService";

const authService = new MockAuthService();

export default function AdminLoginPage() {
  return (
    <AdminLoginForm authService={authService} />
  );
}