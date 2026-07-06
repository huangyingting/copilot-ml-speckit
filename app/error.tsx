"use client";

import { StateMessage } from "@/components/ui/state-message";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="app-shell">
      <StateMessage state="error" title="Map data unavailable" message={error.message} />
      <button className="primary-button" type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}