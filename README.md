# PopTimer

[![CI](https://github.com/ioluas/popcorn/actions/workflows/ci.yml/badge.svg)](https://github.com/ioluas/popcorn/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/ioluas/popcorn/graph/badge.svg?token=DDTHW6QOBH)](https://codecov.io/github/ioluas/popcorn)

A bespoke workout interval timer app built with React Native and Expo for my niece.
PopTimer is inspired by Popcorn, her pet cockatoo bird.

## Screenshots

<p align="center">
  <img src="screenshots/main.jpeg" width="250" alt="Main screen" />
  <img src="screenshots/timer.jpeg" width="250" alt="Timer screen" />
  <img src="screenshots/settings.jpeg" width="250" alt="Settings screen" />
</p>

## Features

- **Customizable intervals**: Set number of sets, work time, background colours and rest time
- **Presets**: Save and load your favorite timer configurations
- **Audio cues**: Beep sounds on phase transitions
- **Haptic feedback**: Vibration feedback for interactions
- **Multi-language support**: English, Swedish, and Arabic (with RTL layout)
- **Dark theme**: Easy on the eyes during workouts
- There's an easter egg there somewhere :)

### Tooling

- Node.js 22.14.0+, npm 11.7+, eas-cli 16.28.0+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

```bash
npm ci
```

### Development

### Running Tests, Linting, Formatting & type checking

```bash
npm run lint
npm run format
npm run typecheck
npm run test
```

## Building

```bash
# production build
eas build \
  --platform android \
  --profile production

# development build
eas build \
  --platform android \
  --profile development
# or using expo go
npm run start
```
