# Pomodoro App Plan

## Context

Build a Pomodoro web app with three files: index.html, style.css, app.js. Requirements: 25 minute work, 5 minute break, pause, resume, reset, circular progress, sound on transition, session counter saved to localStorage.

## Assumptions

- A session counts when a work period finishes, not a break.
- After a work period ends, the app switches to break and starts it automatically. After a break ends, it switches to work and waits for you to press Start.
- Sound uses the Web Audio API, so no audio file is needed.
- Reset returns the current mode to its full duration and does not clear the session counter.
- No build tools and no libraries. Open index.html in a browser.

## index.html

- Page structure and semantic elements.
- Mode label (Work or Break).
- SVG ring: a background circle and a progress circle.
- Time readout in MM:SS, centered over the ring.
- Buttons: Start/Pause toggle and Reset.
- Session counter text.
- Link style.css and load app.js at the end of body.
- Element ids: mode-label, time-display, ring-progress, toggle-btn, reset-btn, session-count.

## style.css

- Page layout and centering.
- Ring sizing, stroke widths, and rotation so progress starts at the top.
- stroke-dasharray set to the circle circumference. app.js changes stroke-dashoffset.
- Color theme per mode through a class on body (mode-work, mode-break).
- Button styles including hover, focus, and disabled states.
- Tabular numerals for the time readout.
- Small-screen layout.

## app.js

Constants
- WORK_SECONDS = 25 * 60
- BREAK_SECONDS = 5 * 60
- STORAGE_KEY = "pomodoro.sessions"
- RING_CIRCUMFERENCE, computed from the circle radius

State: `{ mode: "work" | "break", remaining: number, running: boolean, endTime: number | null, sessions: number }`

Functions
- `init(): void`
- `getDuration(mode): number`
- `formatTime(totalSeconds): string`
- `render(): void`
- `updateRing(remaining, total): void`
- `start(): void`
- `pause(): void`
- `toggle(): void`
- `reset(): void`
- `tick(): void`
- `completePeriod(): void`
- `switchMode(mode): void`
- `playChime(): void`
- `loadSessions(): number`
- `saveSessions(count): void`

Design choice: tick() derives remaining from endTime and Date.now(). This avoids drift when the browser throttles background tabs.

## Build order

1. index.html static markup and ids.
2. style.css layout and ring.
3. app.js constants, state, formatTime, render.
4. start, pause, toggle, tick.
5. reset.
6. completePeriod and switchMode.
7. loadSessions and saveSessions.
8. playChime.
9. Polish: mode colors, document title, small-screen layout.

## Verification

- Run one full short cycle with shortened durations.
- Pause mid-countdown, wait 10 seconds, resume. Time must not skip.
- Reload the page. Session count must persist.
- Switch tabs during a countdown and return. Time must match the wall clock.
- Restore real durations before finishing.
