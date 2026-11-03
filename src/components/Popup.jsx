import React, { useEffect, useRef } from "react";

const Popup = ({
  content,
  handleClose,
  compact = false,
  label = "Details",
  className = "",
}) => {
  const dialogRef = useRef();
  const closeRef = useRef(handleClose);
  useEffect(() => { closeRef.current = handleClose; }, [handleClose]);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    const initialInput = dialog.querySelector("input:not(:disabled), textarea:not(:disabled)");
    (initialInput || dialog).focus();

    // Keep keyboard focus inside the dialog and return it to the opener on close.
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab") return;
      const controls = dialog.querySelectorAll(
        'button, a[href], input, select, textarea, [tabindex="0"]',
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || document.activeElement === dialog)
      ) {
        event.preventDefault();
        first?.focus();
      }
    };
    dialog.addEventListener("keydown", onKeyDown);
    return () => {
      dialog.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, []);
  return (
    <div
      className={
        (compact ? "popup-box2" : "popup-box") + " guidy-modal " + className
      }
    >
      <div
        className={compact ? "box2" : "box"}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
      >
        <button
          type="button"
          className="close-icon"
          aria-label="Close dialog"
          onClick={handleClose}
        >
          x
        </button>
        {content}
      </div>
    </div>
  );
};
export default Popup;
