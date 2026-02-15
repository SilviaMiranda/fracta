# Changelog

All notable changes to Fracta will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-15

### Added
- **Enhanced Badge System** with 20 total badges
  - 5 milestone badges (point-based achievements)
  - 15 level-specific badges (earned with 2+ stars per level)
- **Custom Badge Designs** - Beautiful 44x44px PNG badges
- **Clickable Badge Modal** - View all badges in a grid display
- **Badge Detail View** - Click badges to see them enlarged (128x128px)
- **Dual Badge Types**:
  - Point badges: Earned at 0, 200, 400, 600, 800 points
  - Level badges: Earned when completing levels with 2+ stars
- **Multi-language Support** for all badge names (EN, CA, DE, ES)
- **Badge Count Display** on Home and Level Menu screens
- **Locked/Unlocked States** with visual indicators

### Changed
- Badge count now shows total earned (point + level badges)
- Settings screen now displays badge images instead of icons

### Fixed
- Catalan translation: "Insígnia guanyada" (singular) vs "Insígnies guanyades" (plural)

## [1.0.0] - 2026-02-15

### Added
- Initial release of Fracta
- 15 progressive levels for fraction practice
- Onboarding assessment quiz
- Interactive visual fraction representation
- Multi-language support (EN, CA, DE, ES)
- Achievement system with 5 badges
- Star rating system (1-3 stars per level)
- Level unlocking and progression
- LocalStorage-based progress tracking
- Comprehensive test suite with Vitest

### Features
- React 18 + Vite for fast development
- Tailwind CSS for beautiful styling
- Lucide React icons
- Mobile-responsive design
- Clean, modern UI/UX

[1.1.0]: https://github.com/SilviaMiranda/fracta/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/SilviaMiranda/fracta/releases/tag/v1.0.0
