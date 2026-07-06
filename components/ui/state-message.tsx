import type { LoadingState } from "@/lib/weather/schemas";

type StateMessageProps = {
  state: LoadingState;
  title: string;
  message?: string;
};

const stateLabels: Record<LoadingState, string> = {
  idle: "Ready",
  loading: "Loading",
  success: "Loaded",
  empty: "No results",
  error: "Error",
  disabled: "Disabled",
  "permission-denied": "Permission denied",
};

export function StateMessage({ state, title, message }: StateMessageProps) {
  return (
    <div className={`state-message state-message--${state}`} role={state === "error" ? "alert" : "status"} aria-live="polite">
      <p className="state-message__eyebrow">{stateLabels[state]}</p>
      <h2>{title}</h2>
      {message ? <p>{message}</p> : null}
    </div>
  );
}