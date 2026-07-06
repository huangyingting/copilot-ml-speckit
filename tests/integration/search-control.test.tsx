import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchControl } from "@/components/weather-map/search-control";
import { paris, sanFrancisco } from "../fixtures/weather";

describe("SearchControl", () => {
  it("submits queries and renders distinguishable results", async () => {
    const onSearch = vi.fn(() => {
      return Promise.resolve();
    });
    const onSelectLocation = vi.fn();
    render(
      <SearchControl
        loadingState="success"
        results={[paris, { ...sanFrancisco, name: "Paris", id: "paris-us" }]}
        onSearch={onSearch}
        onSelectLocation={onSelectLocation}
      />,
    );

    fireEvent.change(screen.getByRole("searchbox", { name: /search location/i }), { target: { value: "Paris" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith("Paris");
    });
    expect(screen.getByRole("button", { name: /paris, france/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /paris, united states/i })).toBeInTheDocument();
  });

  it("shows empty, error, disabled, and keyboard-selectable states", () => {
    const onSelectLocation = vi.fn();
    const { rerender } = render(<SearchControl loadingState="empty" results={[]} onSearch={vi.fn()} onSelectLocation={onSelectLocation} />);
    expect(screen.getByText(/no matching locations/i)).toBeInTheDocument();

    rerender(<SearchControl loadingState="error" results={[]} onSearch={vi.fn()} onSelectLocation={onSelectLocation} />);
    expect(screen.getByText(/search unavailable/i)).toBeInTheDocument();

    rerender(<SearchControl loadingState="disabled" results={[]} onSearch={vi.fn()} onSelectLocation={onSelectLocation} />);
    expect(screen.getByRole("searchbox", { name: /search location/i })).toBeDisabled();

    rerender(<SearchControl loadingState="success" results={[paris]} onSearch={vi.fn()} onSelectLocation={onSelectLocation} />);
    fireEvent.keyDown(screen.getByRole("button", { name: /paris, france/i }), { key: "Enter" });
    expect(onSelectLocation).toHaveBeenCalledWith(paris);
  });
});