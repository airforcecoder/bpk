import { useState } from "react";

import type { LoginService } from "../../services/authentication/auth.interface";

import { validateLogin } from "../../utils/loginValidation";

import "./AdminLoginForm.css";

interface Props {
  authService: LoginService;
}

export default function AdminLoginForm({
  authService,
}: Props) {
  const [usernameOrEmail, setUsernameOrEmail] =
    useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    usernameOrEmail?: string;
    password?: string;
  }>({});

  const [message, setMessage] = useState("");

  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setMessage("");
    setSuccess(false);

    const credentials = {
      usernameOrEmail,
      password,
    };

    const validationErrors = validateLogin(credentials);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const result = await authService.login(credentials);

      setSuccess(result.success);
      setMessage(result.message);
    } catch {
      setSuccess(false);
      setMessage(
        "Unable to process the demonstration login. Please try again."
      );
    } finally {
      setLoading(false);
      setPassword("");
    }
  }

  return (
    <section className="admin-login-container">
      <div className="admin-login-card">

        <div className="admin-login-header">
          <h1>Admin Sign In</h1>

          <p>
            Enter your credentials to continue.
          </p>
        </div>

        <div className="demo-notice" role="note">
          Demonstration only. This login does not
          provide real administrator access.
        </div>

        <form onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label htmlFor="usernameOrEmail">
              Username or Email
            </label>

            <input
              id="usernameOrEmail"
              name="usernameOrEmail"
              type="text"
              autoComplete="username"
              placeholder="Enter username or email"
              value={usernameOrEmail}
              disabled={loading}
              aria-invalid={Boolean(errors.usernameOrEmail)}
              aria-describedby={
                errors.usernameOrEmail
                  ? "username-error"
                  : undefined
              }
              onChange={(event) => {
                setUsernameOrEmail(event.target.value);
                setErrors((previous) => ({
                  ...previous,
                  usernameOrEmail: undefined,
                }));
              }}
            />

            {errors.usernameOrEmail && (
              <p
                id="username-error"
                className="error-message"
                role="alert"
              >
                {errors.usernameOrEmail}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                disabled={loading}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password
                    ? "password-error"
                    : undefined
                }
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    password: undefined,
                  }));
                }}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <p
                id="password-error"
                className="error-message"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {loading && (
            <p className="loading-message" role="status">
              Processing demonstration login...
            </p>
          )}

          {message && (
            <div
              className={
                success
                  ? "success-message"
                  : "failure-message"
              }
              role="status"
            >
              {message}
            </div>
          )}

        </form>

        <footer className="admin-login-footer">
          <p>
            Admin authentication will be implemented
            in Sprint 4 (BPK-86).
          </p>
        </footer>

      </div>
    </section>
  );
}