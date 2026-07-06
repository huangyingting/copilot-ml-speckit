import { WeatherMapShell } from "@/components/weather-map/weather-map-shell";

export const revalidate = 3600;

export default function Page() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-header__eyebrow">Option B · point weather markers</p>
        <h1>World Weather Map</h1>
      </header>
      <WeatherMapShell />
    </main>
  );
}