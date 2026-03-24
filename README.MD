# ♞ ChessKids — Learn Real Chess!

ChessKids is a fun, interactive, and educational chess platform designed specifically for children. It features a modern, game-like interface with various modules to help kids master the game, from basic piece movements to advanced tactical patterns.

## 🚀 Getting Started

Simply open `index.html` in your web browser. 

> [!IMPORTANT]
> Because the project uses **ES Modules** (`import`/`export`), you must serve it through a local web server (e.g., VS Code's "Live Server", Python's `http.server`, or Node's `serve`). Opening the file directly via `file://` will not work.

## 📂 Project Structure

The project has been refactored into a modular architecture for better maintainability:

```text
chesskids/
├── index.html           # Main UI structure
├── css/
│   └── style.css        # Global application styles
└── js/
    ├── app.js           # Main entry point & app logic
    ├── utils.js         # Core utilities & shared state
    ├── board.js         # Chess logic & rendering engine
    ├── data.js          # Static game content & data
    └── modules/         # Specialized game feature logic
        ├── bot.js       # Play vs Bot AI
        ├── puzzle.js    # Puzzle Trainer
        ├── dojo.js      # Piece Dojo (Movement practice)
        ├── threat.js    # Threat Spotter
        ├── ...          # And many other modules
```

## 🛠 Features

- **Interactive Lessons:** Structured curriculum from beginner to advanced levels.
- **Game Modules:** Specialized trainers for tactics, endgames, openings, and more.
- **Play vs AI:** A custom-built chess engine with adjustable difficulty.
- **Progress Tracking:** Earn stars and track your improvement across all areas of chess.
- **Premium Features:** Secure access to professional-level masterclass content via redeemable codes.

## 👩‍💻 Development

### Adding a New Module

1.  Create a new file in `js/modules/your-module.js`.
2.  Import shared logic from `../utils.js`, `../board.js`, or `../data.js`.
3.  Export an `initYourModule()` function and any necessary event handlers.
4.  In [app.js](file:///Users/athish/Desktop/Desktop%20-%20Athish’s%20Mac%20mini/cop/chesskids-1/js/app.js), import your module and link it to the global `window` object if needed for HTML events.

### Styling

All styles are managed in [style.css](file:///Users/athish/Desktop/Desktop%20-%20Athish’s%20Mac%20mini/cop/chesskids-1/css/style.css) using a consistent design system of CSS variables for colors, spacing, and animations.

## 📜 License

Created with ❤️ for the next generation of grandmasters.