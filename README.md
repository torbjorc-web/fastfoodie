# FastFoodie

FastFoodie is a Phaser.js restaurant game where you play as a cafeteria server trying to satisfy customers by serving the exact amount of food they want. Your goal is to keep the restaurant rating above 1 star, clear 3 waves of customers, and score as many points as possible.

## Features

- Start screen, tutorial screen, gameplay screen, win screen, and lose screen.
- Three progressively harder waves of customers.
- Customer hunger meters and timer bars.
- Three food items:
  - Burger: 5 fullness points
  - Fries: 3 fullness points
  - Shake: 1 fullness point
- Star-based restaurant rating system.
- Sound effects, tweens, color feedback, and camera-based positioning.
- Phaser containers for grouping each customer, meter, and timer together.

## How to Play

1. Press `Enter` on the title screen to continue.
2. Read the tutorial screen.
3. In gameplay:
   - Press `A` to serve a Burger.
   - Press `S` to serve Fries.
   - Press `D` to serve a Shake.
   - Press `Enter` to serve the current customer.
4. Match the customer’s hunger level exactly to earn stars and score points.
5. If the restaurant rating drops to 0 stars, you lose.
6. If you survive all 3 waves, you win.

## Game Goal

Serve customers as accurately as possible to keep the restaurant rating high. Perfect orders increase your score and help you progress through all waves.

## Project Structure

- `index.html` — Game entry point.
- `StartScene.js` — Title screen.
- `TutorialScene.js` — Gameplay instructions.
- `GameScene.js` — Main game logic.
- `WinScene.js` — Win screen.
- `LoseScene.js` — Lose screen.

## Requirements

- A modern web browser.
- Phaser 3.

## Running the Game

1. Open the project in a browser.
2. Make sure all scene files are included in the HTML file.
3. Start the game from the title screen.

## Notes

This project uses Phaser containers, tweens, camera positioning, and grouped game objects to manage customer lines and restaurant UI.

## License

This project is intended for educational use.
