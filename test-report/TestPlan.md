# OinkCoin Test Plan

How OinkCoin is tested, what each test covers, and how to rerun everything.
The results report (PDF) is generated from the actual run output.

## Suites

| Suite | Tool | Where it runs | Command |
| --- | --- | --- | --- |
| Logic (OC-xxx) | Node's built-in test runner | The Mac | `npm test` |
| UI (UI-xxx) | XCUITest in Xcode | iOS Simulator | Command-U in Xcode, or `xcodebuild test` (below) |

Run the UI tests from the terminal:

```sh
npx vite build --outDir dist && npx cap sync ios
cd ios/App
xcodebuild test -project App.xcodeproj -scheme App \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  -resultBundlePath ../../test-results/Run.xcresult CODE_SIGNING_ALLOWED=NO
```

Open `test-results/Run.xcresult` in Xcode to see every step with screenshots.
Use an **erased** simulator (`xcrun simctl erase <id>`) to test the true first launch.

The app must be built **without** a `.env` file so it runs in local demo mode. With Supabase keys
present, sign up needs real email confirmation and the UI tests cannot complete it.

## Logic tests

| ID | What it checks |
| --- | --- |
| OC-001 | The mock CSV imports every spending row and skips the payroll deposit |
| OC-002 | Merchants land in the right category |
| OC-003 | A file without Date and Amount columns is rejected |
| OC-010 | Wants spending moves the buddy through every mood |
| OC-011 | Needs over plan make the buddy sad at most |
| OC-012 | Spending exactly the budget leaves a clean $0.00 |
| OC-020 | Every money situation has phrases with no unfilled placeholders |
| OC-021 | Spending exactly the budget is not "over by $0.00" |
| OC-030 to OC-038 | Chat answers: balance, money left, coffee spend, what-if, fallback, roast/joke/help, chips, bad input |
| OC-040 | Forecast counts trips as spent instead of scaling them up |
| OC-041 | Exact budget leaves $0, not a tiny negative |
| OC-042 | Safe spending per day |
| OC-043 | Income this month is totalled |
| OC-044 | What-if cuts save the right share |
| OC-045 | Compound interest and goal date |
| I18N-001 to I18N-007 | Every English string has a Spanish translation, with the same placeholders and tags, and no Spain-only words or dashes |
| CHES-001 to CHES-007 | The chat understands Spanish: every suggestion chip, what-if, forecast, balance, no leftover English |
| ES-001 to ES-005 | Mexican bank statements: Spanish headers, DD/MM/YYYY dates, Mexican merchants |

## UI tests

Every UI test first runs `ensureHome()`, which signs up, accepts permissions, builds the buddy and
skips the tour if the app is on a fresh install, logs in if needed, and otherwise does nothing.

| ID | Flow |
| --- | --- |
| UI-001 | Sign up and onboarding from a first launch |
| UI-002 | Home: buddy, bubble with Reply, spending total, Needs and Wants |
| UI-003 | Add an expense and see it listed |
| UI-004 | Reply on the bubble opens the chat |
| UI-005 | Chat: balance, suggestion chip, roast; nothing overflows |
| UI-006 | Forecast: Hardcore preset moves sliders to 50%, plan total shows, Reset returns to 0% |
| UI-007 | All nine menu pages open and show their own content |
| UI-008 | Send to background and return |
| UI-009 | No element extends past the screen edge on seven pages |
| UI-010 | Switch to Spanish: all nine pages show Spanish content, chat answers in Spanish, no English words left, nothing past the screen edge, language remembered after relaunch |

## Translation

English text is the lookup key: `t('Left to spend')`. Spanish lives in `src/lang/es_*.ts`, written to `src/lang/GLOSSARY.md`.
Stored values (categories, goals, moods) stay in English in the data and are translated only when drawn (`src/labels.ts`).
Add a new string by wrapping it in `t()` and adding the Spanish to a dictionary; `npm test` fails until you do.
Text must not be written in CSS `content:` (it cannot be translated); put it in the markup.

## Not covered

Real Supabase accounts and Plaid, a physical iPhone, cloud-backed Friends features, the iOS file
picker for CSV import (the parser itself is tested), VoiceOver, Dynamic Type, Dark Mode, iPad,
offline and load behavior. The Spanish has not had a native speaker review, and the Spanish privacy notice is a courtesy translation without legal review.

## Notes for writing more UI tests

- Look for buttons inside `app.webViews`, not `app.buttons`. iOS puts its own keyboard toolbar in the
  app's hierarchy and it also has a "Next" button.
- Use exact labels for menu items. The top bar's "0 coins, open store" button also contains "store".
- Scroll an element into view before tapping it. The top bar is not sticky.
- A new simulator shows a one time "slide to type" tip on first keyboard use; the tests dismiss it.
