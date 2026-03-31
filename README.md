# Snake Game

A browser-based Snake Game built with plain HTML, CSS, and JavaScript.

## Overview

This project is a simple arcade-style snake game with:

- Start, pause, and game over screens
- Score and timer tracking
- High score saved with `localStorage`
- Keyboard controls for desktop
- Swipe controls for touch devices
- Sound toggle support
- Responsive layout for smaller screens

## Tech Stack

- `HTML`
- `CSS`
- `JavaScript`
- Browser `localStorage` for saved score state

## Project Structure

```text
.
|-- index.html
|-- gamePage.html
|-- pausePage.html
|-- gameOver.html
|-- style.css
|-- script.js
|-- img/
|-- audio/
```

## Pages

- `index.html`: Start screen
- `gamePage.html`: Main gameplay screen
- `pausePage.html`: Pause screen with current stats
- `gameOver.html`: Final score, high score, and restart screen

## How To Run

1. Download or clone the project.
2. Open `index.html` in your browser.

No build step or package installation is required.

## Controls

### Desktop

- `Arrow Keys` or `W A S D`: Move the snake
- `Space` or `Enter`: Start, pause, resume, or restart depending on the page
- `M`: Mute or unmute sound

### Mobile

- Swipe on the screen to change direction

## Gameplay

- Eat the red food to increase your score.
- Each food item adds a new snake segment.
- The game ends if the snake hits the wall or collides with itself.
- The current score and timer are shown during gameplay.
- The highest score is stored in the browser and shown on pause/game over screens.

## Saved Data

This game uses `localStorage` to keep:

- `score`
- `highScore`
- `duration`
- snake position and direction
- snake length
- mute state

## Assets

- `img/`: icons and game visuals
- `audio/`: background and game sound effects

## Notes

- This project runs entirely on the frontend.
- High score is browser-specific because it is stored locally.
- If you clear browser storage, saved high score and active game state will reset.
