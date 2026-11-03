import { useRef, useState } from "react";
import { UilInfoCircle } from "@iconscout/react-unicons";

// Keep format guidance available to keyboard users without taking permanent form space.
export default function FieldHelp({ id, label, hint, children }) {
  const [open, setOpen] = useState(false);
  const button = useRef();
  return <div className="guidy-input-help" onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }} onKeyDown={(event) => {
    if (event.key === "Escape" && open) { event.stopPropagation(); setOpen(false); button.current?.focus(); }
  }}>
    {children}
    <button ref={button} type="button" className="guidy-format-button" aria-label={label + " format information"}
      aria-expanded={open} aria-controls={id}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onClick={(event) => { event.preventDefault(); setOpen(true); }}>
      <UilInfoCircle size="19" aria-hidden="true" />
    </button>
    <div className="guidy-format-popover" id={id} hidden={!open} role="note">{hint}</div>
  </div>;
}
