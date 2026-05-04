# Maestro smoke tests

End-to-end UI tests for the four critical flows: log in, log a meal, log a weight, switch language, log out. If these pass, the app isn't fundamentally broken. They're meant to run before every TestFlight submission.

## Install

```bash
brew install --cask maestro
```

(or, without Homebrew: `curl -Ls "https://get.maestro.mobile.dev" | bash`)

Verify: `maestro --version`.

## Prerequisites

- A built `.app` (simulator) or `.ipa` (device) installed on the target. Maestro doesn't build — it drives the existing app.
- A real **test account** on the backend you're targeting (staging or prod). Don't reuse a personal account: the destructive tests create real food-log and weight-log rows.
- The simulator/device locale set to **English**. Tests assert against English strings; running with a Georgian locale will fail.

## Run

```bash
# All non-destructive smoke checks (default; doesn't mutate backend)
maestro test \
  --env TEST_EMAIL=test@forma.app \
  --env TEST_PASSWORD=YourTestPassword \
  --include-tags smoke \
  .maestro/

# Run a single flow
maestro test \
  --env TEST_EMAIL=test@forma.app \
  --env TEST_PASSWORD=YourTestPassword \
  .maestro/smoke.yaml

# Destructive flows (creates real food-log + weight-log rows on the test account)
maestro test \
  --env TEST_EMAIL=test@forma.app \
  --env TEST_PASSWORD=YourTestPassword \
  --env TEST_FOOD_NAME="Apple" \
  --include-tags destructive \
  .maestro/
```

`TEST_FOOD_NAME` should match a food name that actually exists in the test account's database. The app's food database is Georgian, so for staging you'll typically want something like `"ვაშლი"` (apple) — set it to whatever your seed data contains.

A clean run takes ~90s.

## Files

| File                   | What it covers                                                                | Tag           |
| ---------------------- | ----------------------------------------------------------------------------- | ------------- |
| `smoke.yaml`           | Login → Home → Add tab → switch lang ka→en→ka → logout. No backend mutations. | `smoke`       |
| `login.yaml`           | Reusable sub-flow: clear state, launch, sign in. Called by other flows.       | (sub)         |
| `language-switch.yaml` | Login + switch language and verify UI flips.                                  | `smoke`       |
| `logout.yaml`          | Login + log out.                                                              | `smoke`       |
| `log-meal.yaml`        | Login + tap into Add tab + log first food. **Creates a real entry.**          | `destructive` |
| `log-weight.yaml`      | Login + log a weight value. **Creates a real entry.**                         | `destructive` |

## Authoring conventions

- Use **visible English text** as selectors where possible. Tests assume the device is English-locale.
- For tabs, Expo Router exposes the navigator `title` as the accessibility label, so `tapOn: "Add"` taps the Add tab even though no text is rendered next to the icon.
- Don't hardcode credentials — read from `${TEST_EMAIL}` / `${TEST_PASSWORD}` env vars.
- New flows that mutate backend state (create entries, edit profile) **must** be tagged `destructive`. Default test runs should never mutate.

## What to do when a test breaks

1. **First:** check whether the locale is English on the device. ~50% of "broken tests" are wrong-locale runs.
2. If a UI label changed: update the matcher in the YAML.
3. If the _flow_ changed (e.g. login moved from /Login to /Welcome): update the steps and consider whether the change was intentional.
4. If timing-related (element appears late): increase the `extendedWaitUntil` timeout.

## Adding new flows

Copy `language-switch.yaml` as a starting template — it's the smallest end-to-end example. Tag every new flow as either `smoke` or `destructive`.

## CI

Not wired yet. When ready, GitHub Actions can run Maestro Cloud (free tier, 100 runs/month) on PR. See https://cloud.mobile.dev/ for setup.
