import Logo from "../assets/images/Logo.svg";

export default function LoadingState({ fullPage = false, label = "Loading…" }) {
  return (
    <div className={fullPage ? "guidy-loading-screen" : "guidy-loading-inline"} role="status" aria-live="polite">
      {fullPage && <img src={Logo} alt="Guidy" className="guidy-loading-logo" />}
      <span className="guidy-loading-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
