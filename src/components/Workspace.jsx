import LoadingState from "./LoadingState";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function useWorkspaceData(load) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ status: "loading" });

  useEffect(() => {
    let active = true;
    setResult({ status: "loading" });
    Promise.resolve().then(load).then((data) => {
      if (active) setResult({ status: "ready", data });
    }).catch((error) => {
      if (active) setResult({ status: "error", unauthorized: error.response?.status === 401 });
    });
    // Ignore responses from a previous selection or an unmounted panel.
    return () => { active = false; };
  }, [load, attempt]);

  return { ...result, retry: () => setAttempt((value) => value + 1) };
}

export function Panel({ title, link, action, children, wide = false }) {
  return (
    <section className={wide ? "workspace-panel workspace-wide" : "workspace-panel"}>
      <header className="workspace-panel-header">
        <h2>{title}</h2>
        {link && <Link to={link}>{action}</Link>}
      </header>
      {children}
    </section>
  );
}

export function PanelState({ request, empty, children }) {
  if (request.status === "loading") return <LoadingState />;
  if (request.status === "error") {
    return (
      <div className="workspace-state" role="alert">
        <p>{request.unauthorized ? "Your session has expired. Sign in to continue." : "This information could not be loaded."}</p>
        {request.unauthorized
          ? <Link className="workspace-button" to="/">Sign in</Link>
          : <button className="workspace-button" type="button" onClick={request.retry}>Try again</button>}
      </div>
    );
  }
  return empty ? <p className="workspace-state">{empty}</p> : children;
}

export function Workspace({ title, description, children, action }) {
  return (
    <main className="workspace">
      <header className="workspace-heading">
        <div className="workspace-heading-row"><h1>{title}</h1>{action}</div>
        <p>{description}</p>
      </header>
      <div className="workspace-grid">{children}</div>
    </main>
  );
}


export function Summary({ children }) {
  return <div className="workspace-summary workspace-wide">{children}</div>;
}

// A missing metric stays unavailable; a confirmed empty list can still show zero.
export function Metric({ label, value }) {
  return (
    <article className="workspace-metric" aria-label={label}>
      <p>{label}</p>
      <strong>{value == null ? "—" : value}</strong>
    </article>
  );
}

export function Breakdown({ rows, total }) {
  return (
    <ul className="workspace-breakdown">
      {rows.map(({ label, count }) => (
        <li key={label}>
          <div><span>{label}</span><strong>{count}</strong></div>
          <progress value={count} max={Math.max(total, 1)} aria-label={label + ": " + count + " of " + total} />
        </li>
      ))}
    </ul>
  );
}
