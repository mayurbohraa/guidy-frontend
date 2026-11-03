import AuthBranding from "./AuthBranding";

export default function AuthLayout({ children }) {
  return (
    <main className="guidy-login guidy-signup guidy-recovery">
      <AuthBranding />
      <div className="login-form">{children}</div>
    </main>
  );
}
