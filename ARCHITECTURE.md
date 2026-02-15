# Fracta Architecture Documentation

## Overview

Fracta is a single-page React application built with Vite. It uses a component-based architecture with a centralized state management approach through localStorage and React state.

## Architecture Patterns

### 1. Component Structure

The app follows a hierarchical component structure:

```
App (Root)
├── HomeScreen
├── OnboardingScreen
├── LevelMenuScreen
├── GameScreen
├── LevelCompleteScreen
└── SettingsScreen
```

Each screen is a self-contained component that handles its own local state and communicates with the parent `App` component through props and callbacks.

### 2. State Management

#### Global State (App.jsx)
- `screen`: Current active screen
- `language`: Current language preference
- `progress`: User progress data
- `currentLevel`: Currently selected level
- `gameScore`: Score for current game session
- `gameQuestions`: Questions for current game session
- `gameQuestionIndex`: Current question index

#### Local State
Each screen component manages its own local state for UI interactions (dropdowns, form inputs, etc.).

#### Persistent State (localStorage)
- `fm_language`: Language preference
- `fm_progress`: Complete progress object

### 3. Data Flow

```
User Action
    ↓
Screen Component (handles UI)
    ↓
Callback to App.jsx (updates global state)
    ↓
localStorage (persists data)
    ↓
App.jsx (updates progress state)
    ↓
Screen Component (receives updated props)
```

### 4. Utility Modules

#### `storage.js`
Provides synchronous wrappers around localStorage:
- `getStorageItem(key)`: Get string value
- `setStorageItem(key, value)`: Set string value
- `getStorageJSON(key)`: Get and parse JSON
- `setStorageJSON(key, value)`: Stringify and set JSON
- `loadProgress()`: Load progress with defaults
- `saveProgress(progress)`: Save progress object
- `loadLanguage()`: Load language preference
- `saveLanguage(lang)`: Save language preference

**Key Design Decision**: All storage operations are synchronous (no async/await) since localStorage is synchronous. This simplifies the codebase compared to the original Claude.ai storage API.

#### `translations.js`
Centralized translation system:
- `translations` object: Maps language codes to translation objects
- `t(lang, key, params)`: Get translated string with parameter substitution
- `getTranslations(lang)`: Get all translations for a language

**Translation Keys**: All UI text uses translation keys. Question types also use translation keys (e.g., "simplify", "add", "multiply").

#### `questions.js`
Question generation and answer checking:
- `generateQuestion(level, lang)`: Generates a random question for a level
- `checkAnswer(userAnswer, correctAnswer)`: Validates user answer
- `parseFraction(str)`: Parses fraction strings (supports "1/2", "0.5", "3")
- `simplifyFraction(num, den)`: Simplifies fractions using GCD
- `formatFraction(num, den)`: Formats fraction as string
- `normalizeAnswer(str)`: Normalizes answer for comparison

**Question Generation Strategy**:
- Questions are generated on-demand (not pre-generated)
- Difficulty scales with level number
- Question types unlock progressively
- Answers are always simplified fractions

#### `badges.js`
Achievement system:
- `BADGE_DEFINITIONS`: Array of badge configurations
- `checkNewBadges(points, currentBadges)`: Returns newly earned badges
- `getEarnedBadges(points, lang)`: Returns all earned badges with translations

**Badge System**:
- Badges are awarded based on total points
- Each badge has a threshold
- Badges are stored in progress object
- Badge icons use Lucide React icons

## Screen Components

### HomeScreen
**Purpose**: Landing page with logo, stats, and navigation

**Features**:
- Displays logo
- Shows progress stats (points, level, badges)
- Language selector dropdown
- "Continue Playing" or "Start Journey" button
- Settings icon

**State**:
- `showLanguageDropdown`: Controls language dropdown visibility

### OnboardingScreen
**Purpose**: 10-question assessment to determine starting level

**Features**:
- Generates 10 questions of varying difficulty
- Shows progress bar
- Instant feedback on answers
- Calculates starting level based on score

**State**:
- `questions`: Array of generated questions
- `currentQuestionIndex`: Current question
- `userAnswer`: User's input
- `isCorrect`: Answer correctness
- `showResult`: Whether to show result
- `score`: Number of correct answers

**Level Placement Logic**:
- 90%+: Level 6
- 80%+: Level 5
- 70%+: Level 4
- 60%+: Level 3
- 50%+: Level 2
- <50%: Level 1

### LevelMenuScreen
**Purpose**: Display all levels with unlock status and actions

**Features**:
- Grid of 15 level cards
- Shows lock status, stars, completion
- Skip level button (for next locked level)
- Repeat level button
- Progress stats header

**State**: None (uses props only)

**Level Card States**:
- Locked: Gray, shows lock icon
- Completed: Blue border, shows stars
- Available: White, clickable

### GameScreen
**Purpose**: Main gameplay interface

**Features**:
- Displays current question
- Answer input field
- Progress bar (visual indicators)
- Instant feedback
- Score display
- Navigation controls

**State**:
- `currentQuestionIndex`: Current question
- `userAnswer`: User input
- `isCorrect`: Answer correctness
- `showResult`: Show result state
- `score`: Current score
- `answeredQuestions`: Array tracking correct/incorrect

**Question Flow**:
1. User sees question
2. User enters answer
3. User submits
4. Result shown (correct/incorrect)
5. User clicks next
6. Repeat until all questions answered
7. Navigate to completion screen

### LevelCompleteScreen
**Purpose**: Show results and recommendations

**Features**:
- Score display
- Star rating (1-3 stars)
- New badge notifications
- Recommendations (try again or next level)
- Action buttons

**State**:
- `stars`: Calculated stars
- `newBadges`: Array of newly earned badges
- `hasUpdatedProgress`: Flag to prevent double-update

**Star Calculation**:
- Based on percentage: 80%+ = 3, 60%+ = 2, 40%+ = 1

**Progress Update**:
- Updates total points
- Records completion in `completedLevels`
- Unlocks next level
- Checks for new badges
- Saves to localStorage

### SettingsScreen
**Purpose**: App settings and configuration

**Features**:
- Language selector
- Badge display
- Progress reset (with confirmation)

**State**:
- `showLanguageDropdown`: Language dropdown visibility
- `showResetConfirm`: Reset confirmation dialog

## Routing System

Fracta uses a simple state-based routing system (no React Router):

```javascript
// In App.jsx
const [screen, setScreen] = useState('home');

// Navigation
const navigateTo = (screenName, data = {}) => {
  setScreen(screenName);
  // Handle navigation data...
};

// Render
const renderScreen = () => {
  switch (screen) {
    case 'home': return <HomeScreen ... />;
    case 'onboarding': return <OnboardingScreen ... />;
    // etc.
  }
};
```

**Screen Names**:
- `'home'`: HomeScreen
- `'onboarding'`: OnboardingScreen
- `'levels'`: LevelMenuScreen
- `'game'`: GameScreen
- `'complete'`: LevelCompleteScreen
- `'settings'`: SettingsScreen

## Styling Architecture

### Tailwind CSS
- Utility-first CSS framework
- Custom color palette: blue (#4A90E2), pink (#E91E63), yellow (#FFD700)
- Gradient backgrounds: `bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50`
- Rounded corners: `rounded-xl`, `rounded-3xl`
- Responsive: Mobile-first approach with `md:` breakpoints

### Design System
- **Cards**: White background, rounded-xl, shadow-xl
- **Buttons**: Gradient backgrounds (blue to pink), rounded-xl
- **Inputs**: Gray border, rounded-lg, focus ring
- **Colors**:
  - Blue: Progress, primary actions
  - Pink: Secondary actions, accents
  - Purple: Badges, special elements
  - Yellow: Stars, highlights
  - Gray: Text, borders, disabled states

## Error Handling

### Storage Errors
- Try-catch blocks in storage utilities
- Console error logging
- Graceful fallbacks (return null/defaults)

### Question Generation
- Fallback to simple questions if generation fails
- Validation of fraction parsing
- Safe defaults for edge cases

### User Input
- Input validation before submission
- Normalized answer comparison
- Support for multiple answer formats

## Performance Considerations

1. **Question Generation**: Questions generated on-demand (not pre-generated) to save memory
2. **localStorage**: Synchronous operations are fast for small data
3. **Component Re-renders**: Minimal re-renders through proper state management
4. **Image Loading**: Logo loaded from public folder (optimized by Vite)

## Future Enhancements

Potential improvements:
1. Add React Router for proper URL routing
2. Add unit tests for question generation and answer checking
3. Add analytics tracking
4. Add sound effects
5. Add animations/transitions
6. Add more question types
7. Add multiplayer/leaderboard features
8. Add export/import progress functionality

## Security Considerations

- All data stored locally (no server)
- No user authentication needed
- No external API calls
- Input sanitization for fraction parsing
- XSS protection through React's built-in escaping

## Browser Compatibility

- Modern browsers with ES6+ support
- localStorage support required
- CSS Grid and Flexbox support required
- No polyfills needed for target browsers

## Build Process

1. **Development**: `npm run dev` - Vite dev server with HMR
2. **Production**: `npm run build` - Vite builds optimized bundle
3. **Preview**: `npm run preview` - Preview production build locally

## Deployment

The `dist` folder contains static files that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

No server-side code required.

