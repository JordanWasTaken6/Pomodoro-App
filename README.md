# Pomodoro App

A browser-based Pomodoro timer by Jordan Chia. Built with plain HTML, CSS, and JavaScript. No frameworks, no build step.

## Features

- 25 minute work timer and 5 minute break timer.
- Start, pause, resume, and reset controls.
- Automatic switch from work to break and from break to work.
- Circular progress ring that fills as time passes.
- Chime on every transition.
- Session counter saved in `localStorage`, so it survives a page reload.

## Run it

1. Download or clone this repository.
2. Open `index.html` in a browser.

No install is needed.

## Use it

1. Press **Start** to begin a 25 minute work period.
2. Press **Pause** to stop the clock and **Start** to continue.
3. Press **Reset** to return the current period to its full length.
4. When a work period ends, the chime plays, the session counter goes up by one, and the break starts on its own.
5. When the break ends, the next work period starts on its own.

## Notes

- The chime needs one click on **Start** first. Browsers block audio before the first click on a page.
- **Reset** does not clear the session counter.
- The timer reads the system clock, so it stays correct when the tab runs in the background.
- To clear the saved count, delete the `pomodoro.sessions` key in your browser's local storage.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure |
| `style.css` | Layout, ring, and colors |
| `app.js` | Timer logic, sound, and storage |
| `plan.md` | Original build plan |
| `CLAUDE.md` | Coding rules for this project |

## Customize

Change the durations at the top of `app.js`:

```js
const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;
```
