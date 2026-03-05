import { html } from "lit";
import { icons } from "../icons";

export type LoginProps = {
  loading: boolean;
  error: string | null;
  onLogin: (username: string, password: string) => void;
};

export function renderLogin(props: LoginProps) {
  let usernameInput: HTMLInputElement | null;
  let passwordInput: HTMLInputElement | null;

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (usernameInput && passwordInput) {
      props.onLogin(usernameInput.value, passwordInput.value);
    }
  };

  return html`
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <div class="login-logo">
            <img
              src="https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26"
              alt="Moltbot"
            />
          </div>
          <h1>MOLTBOT</h1>
          <p>Gateway Control Panel</p>
        </div>

        <form @submit=${handleSubmit} class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              autocomplete="username"
              @input=${(e: Event) =>
                ((usernameInput as HTMLInputElement).value = (
                  e.target as HTMLInputElement
                ).value)}
              ?disabled=${props.loading}
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              autocomplete="current-password"
              @input=${(e: Event) =>
                ((passwordInput as HTMLInputElement).value = (
                  e.target as HTMLInputElement
                ).value)}
              ?disabled=${props.loading}
            />
          </div>

          ${props.error
            ? html`<div class="error-message">${props.error}</div>`
            : nothing}

          <button type="submit" class="btn btn-primary" ?disabled=${props.loading}>
            ${props.loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <div class="login-footer">
          <p class="footnote">Moltbot 2026.1.27</p>
          <p class="footnote">Secure Gateway Dashboard</p>
        </div>
      </div>
    </div>

    <style>
      .login-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100vh;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      .login-box {
        background: white;
        border-radius: 12px;
        padding: 48px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }

      .login-header {
        text-align: center;
        margin-bottom: 32px;
      }

      .login-logo {
        width: 80px;
        height: 80px;
        margin: 0 auto 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .login-logo img {
        width: 100%;
        height: 100%;
      }

      .login-header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        color: #1a1a2e;
      }

      .login-header p {
        margin: 8px 0 0;
        font-size: 14px;
        color: #666;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-group label {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .form-group input {
        padding: 10px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        font-family: inherit;
        transition: border-color 0.2s;
      }

      .form-group input:focus {
        outline: none;
        border-color: #0066cc;
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
      }

      .form-group input:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
      }

      .error-message {
        padding: 10px;
        background-color: #fee;
        color: #c00;
        border-radius: 6px;
        font-size: 13px;
        text-align: center;
      }

      .btn {
        padding: 10px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-primary {
        background-color: #0066cc;
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background-color: #0052a3;
      }

      .btn-primary:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }

      .login-footer {
        text-align: center;
        border-top: 1px solid #eee;
        padding-top: 16px;
      }

      .footnote {
        margin: 4px 0;
        font-size: 12px;
        color: #999;
      }
    </style>
  `;
}
