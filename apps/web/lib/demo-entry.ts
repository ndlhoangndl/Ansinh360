import type { Journey, Screen } from "./demo";

type Query = { get: (key: string) => string | null };
const journeys: Record<string, Journey> = {
  jobloss: "JOB_LOSS", housing: "HOUSING_DIFFICULTY", child: "HAS_CHILD",
};

// URL state selects a screen, but cannot restore answers from an earlier visit.
export function resolveDemoEntry(params: Query, activeJourney: Journey | null) {
  const slug = params.get("journey");
  const demo = params.get("demo");
  const demoMode = demo === "jobloss" && (slug === null || slug === "jobloss");
  const journey = slug === null ? demoMode ? "JOB_LOSS" : null : Object.hasOwn(journeys, slug) ? journeys[slug] : null;
  const requested = params.get("screen") ?? (demoMode ? "questions" : "home");
  const home = (normalize: boolean) => ({ screen: "home" as Screen, journey: "JOB_LOSS" as Journey, demoMode: false, normalize });

  if (requested === "home") return home(demo !== null);
  if (!journey || (demo !== null && !demoMode)) return home(true);
  if (requested === "questions") return { screen: "questions" as Screen, journey, demoMode, normalize: false };
  if (["analysis", "results", "plan"].includes(requested) && (demoMode || activeJourney === journey)) {
    return { screen: requested as Screen, journey, demoMode, normalize: false };
  }
  return home(true);
}
