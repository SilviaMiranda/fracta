# Fracta - Fraction Learning Game

Fracta is an engaging educational math game designed for students aged 12-18 to practice fractions. The game features progressive difficulty levels, interactive gameplay, and a clean, modern design that appeals to mature learners.

## Features

- **15 Progressive Levels**: Gradually increasing difficulty from basic fraction introduction to advanced operations
- **Onboarding Assessment**: 10-question quiz to determine the appropriate starting level
- **Interactive Gameplay**: 8 questions per level with instant feedback
- **Multi-language Support**: English, Catalan, German, and Spanish
- **Achievement System**: 
  - Star ratings (1-3 stars per level based on performance)
  - 5 achievement badges at different point thresholds
  - Progress tracking
- **Persistent Storage**: All progress saved in browser localStorage
- **Level Management**:
  - Skip level option (if unlocked)
  - Repeat level option
  - Automatic level unlocking upon completion

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **localStorage** - Persistent storage

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fracta
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build with:

```bash
npm run preview
```

## Project Structure

```
fracta/
├── public/
│   ├── fracta-logo_gran.png    # Logo image
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   └── Logo.jsx           # Logo component
│   ├── screens/
│   │   ├── HomeScreen.jsx     # Landing page
│   │   ├── OnboardingScreen.jsx  # Assessment quiz
│   │   ├── LevelMenuScreen.jsx   # Level selection
│   │   ├── GameScreen.jsx     # Gameplay
│   │   ├── LevelCompleteScreen.jsx  # Results screen
│   │   └── SettingsScreen.jsx  # Settings
│   ├── utils/
│   │   ├── storage.js         # localStorage utilities
│   │   ├── translations.js    # Translation system
│   │   ├── questions.js        # Question generation
│   │   └── badges.js          # Badge system
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Game Mechanics

### Scoring System

- **Points**: 10 points per correct answer (maximum 80 points per level)
- **Stars**: 
  - 3 stars: 80%+ (64+ points)
  - 2 stars: 60%+ (48+ points)
  - 1 star: 40%+ (32+ points)
  - 0 stars: Below 40%

### Level Unlocking

- Completing a level unlocks the next level
- Skip option available for the next locked level
- Onboarding quiz determines starting level (1-6)

### Badges

Badges are earned at specific point thresholds:
- **First Steps**: 0 points (starting badge)
- **Fraction Master**: 200 points
- **Perfect Score**: 400 points
- **Speed Demon**: 600 points
- **Persistence**: 800 points

### Question Types

Questions are generated programmatically based on level:
- **Level 1-2**: Simplification, comparison
- **Level 3**: Simplification
- **Level 4**: Addition, subtraction
- **Level 6**: Multiplication
- **Level 7**: Division
- **Level 9+**: Decimal conversion, mixed operations

## Language Support

The app supports 4 languages:
- **English (en)**
- **Catalan (ca)** - Default
- **German (de)**
- **Spanish (es)**

All UI text, question templates, and placeholders are fully localized.

## Data Storage

Progress is stored in browser localStorage with the following keys:
- `fm_language`: Current language preference
- `fm_progress`: JSON object containing:
  - `currentLevel`: Current level number
  - `highestUnlockedLevel`: Highest unlocked level
  - `totalPoints`: Total points earned
  - `completedLevels`: Object mapping level numbers to completion data
  - `badges`: Array of earned badges
  - `onboardingComplete`: Boolean flag

## Development

### Code Style

- Follow React best practices
- Use functional components with hooks
- Keep components focused and reusable
- Comment code for clarity
- Follow DRY principles

### Adding New Features

1. Create new components in `src/components/`
2. Add new screens in `src/screens/`
3. Add utility functions in `src/utils/`
4. Update translations in `src/utils/translations.js`
5. Update this README if needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

[Add your license here]

## Contributing

[Add contribution guidelines if applicable]

## Acknowledgments

Built with React, Vite, and Tailwind CSS.

