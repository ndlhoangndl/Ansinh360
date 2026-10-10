import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveDemoEntry } from "../lib/demo-entry";

test("public root stays Home even with an existing in-memory journey", () => {
  for (const state of [null, "JOB_LOSS", "HOUSING_DIFFICULTY", "HAS_CHILD"] as const) {
    assert.equal(resolveDemoEntry(new URLSearchParams(), state).screen, "home");
  }
  assert.equal(resolveDemoEntry(new URLSearchParams("journey=jobloss"), null).screen, "home");
});

test("direct protected screens cannot reconstruct a manual journey from its slug", () => {
  for (const screen of ["analysis", "results", "plan"]) {
    for (const query of [`screen=${screen}`, `journey=jobloss&screen=${screen}`, `journey=child&screen=${screen}`]) {
      const entry = resolveDemoEntry(new URLSearchParams(query), null);
      assert.equal(entry.screen, "home"); assert.equal(entry.normalize, true);
    }
  }
});

test("each manual journey can start questions and continue with matching in-memory state", () => {
  for (const [slug, journey] of [["jobloss", "JOB_LOSS"], ["housing", "HOUSING_DIFFICULTY"], ["child", "HAS_CHILD"]] as const) {
    assert.equal(resolveDemoEntry(new URLSearchParams(`journey=${slug}&screen=questions`), null).screen, "questions");
    for (const screen of ["analysis", "results", "plan"] as const) {
      assert.equal(resolveDemoEntry(new URLSearchParams(`journey=${slug}&screen=${screen}`), journey).screen, screen);
    }
  }
});

test("intentional job demo starts questions and keeps its context on subsequent screens", () => {
  const entry = resolveDemoEntry(new URLSearchParams("demo=jobloss"), null);
  assert.equal(entry.screen, "questions"); assert.equal(entry.journey, "JOB_LOSS"); assert.equal(entry.demoMode, true);
  for (const screen of ["analysis", "results", "plan"]) {
    assert.equal(resolveDemoEntry(new URLSearchParams(`demo=jobloss&journey=jobloss&screen=${screen}`), null).screen, screen);
  }
});

test("invalid and conflicting URL context never leaks job demo answers into another journey", () => {
  for (const query of ["journey=invalid&screen=questions", "journey=constructor&screen=questions", "journey=housing&demo=jobloss&screen=plan", "demo=child&screen=questions", "journey=jobloss&screen=invalid"]) {
    const entry = resolveDemoEntry(new URLSearchParams(query), "JOB_LOSS");
    assert.equal(entry.screen, "home"); assert.equal(entry.normalize, true); assert.equal(entry.demoMode, false);
  }
  assert.equal(resolveDemoEntry(new URLSearchParams("journey=child&screen=results"), "JOB_LOSS").screen, "home");
});

test("returning to clean root removes demo mode and requires a new manual context", () => {
  const home = resolveDemoEntry(new URLSearchParams(), null);
  assert.equal(home.screen, "home"); assert.equal(home.demoMode, false);
  assert.equal(resolveDemoEntry(new URLSearchParams("journey=jobloss&screen=plan"), null).screen, "home");
});
