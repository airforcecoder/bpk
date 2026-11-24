import { Router } from "express";
import { login } from "../services/authService";
import { removeSession, getSessionUser } from "../services/sessionService";

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

    res.cookie(
      "sessionId",
      result.sessionId,
      {
        httpOnly: true,
        sameSite: "strict",
      }
    );

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

router.post("/api/auth/logout", (req, res) => {
  const sessionId = req.cookies?.sessionId;

  if (sessionId) {
    removeSession(sessionId);
  }

  res.clearCookie("sessionId");

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

router.get("/api/auth/session",
  (req, res) => {
    const sessionId =
      req.cookies?.sessionId;
    if (!sessionId) {
      return res.status(401).json({
        authenticated: false,
      });
    }

    const userId =
      getSessionUser(sessionId);

    if (!userId) {
      return res
        .status(401)
        .json({
          authenticated: false,
        });
    }

    return res.status(200).json({
      authenticated: true,
    });
  }
);
export default router;