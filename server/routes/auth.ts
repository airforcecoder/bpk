import { Router } from "express";
import { login } from "../services/authService";

const router = Router();

router.post(
  "/api/auth/login",
  async (req, res) => {
    try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/email and password are required.",
      });
    }

    const result = await login(
      usernameOrEmail,
      password
    );

    if (!result.success) {
      return res.status(401).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Authentication service unavailable.",
    });
  }
}
);
export default router;