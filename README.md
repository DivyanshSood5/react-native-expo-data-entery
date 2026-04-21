# React Native Excel

A mobile Excel-like spreadsheet application for iOS and Android, built with React Native and Expo.

## Features

- Create and manage spreadsheet workbooks
- Organize files in folders
- Multiple sheets per workbook
- Cell editing with text, numbers, and formulas
- Basic formula support (SUM, AVERAGE, MIN, MAX, COUNT)
- Cell formatting (bold, italic, underline, colors, alignment)
- Excel file import/export (.xlsx)
- Local storage with auto-save

## Tech Stack

- **Framework:** React Native with Expo SDK 50
- **Language:** TypeScript
- **State Management:** Zustand
- **Storage:** AsyncStorage
- **Formula Engine:** Custom implementation with mathjs
- **Excel I/O:** xlsx (SheetJS)
- **UI Components:** React Native Paper

## Project Structure

```
ReactNativeExcel/
├── src/
│   ├── core/              # Business logic
│   │   └── formula/       # Formula parsing & evaluation
│   ├── storage/           # Data persistence
│   │   └── asyncStorage/  # AsyncStorage wrapper
│   ├── ui/                # UI components
│   │   ├── grid/          # Spreadsheet grid
│   │   ├── formulaBar/    # Formula input bar
│   │   └── sheetTabs/     # Sheet tab navigation
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript types
│   └── ...
├── app/                   # Expo Router screens
│   ├── _layout.tsx
│   ├── index.tsx          # Home screen
│   └── editor/            # Spreadsheet editor
├── docs/
│   ├── superpowers/
│   │   ├── specs/         # Design specifications
│   │   └── plans/         # Implementation plans
├── package.json
├── app.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ReactNativeExcel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your device:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator

### Troubleshooting

**EMFILE: too many open files error (macOS)**

If you see `Error: EMFILE: too many open files, watch`:

```bash
# Option 1: Run with clear cache
npm start

# Option 2: Use a different port
npx expo start --port 8083

# Option 3: Increase file descriptor limit (if needed)
launchctl limit maxfiles 65536 65536
```

## Roadmap

### Phase 1 - MVP
- [x] Basic grid with virtual scrolling
- [x] Cell editing (text, numbers)
- [x] Basic formulas (SUM, AVERAGE, math)
- [x] AsyncStorage save/load
- [x] File browser

### Phase 2 - Core Features
- [x] Multiple sheets per workbook
- [x] Full formula set (VLOOKUP, IF, date, text, logical functions)
- [x] Cell formatting (bold, italic, underline, alignment)
- [x] Excel import/export service
- [x] Formatting toolbar

### Phase 3 - Advanced
- [ ] Data validation with dropdowns
- [ ] Conditional formatting
- [ ] Cell borders and fill colors
- [ ] Number format presets (currency, percentage, date)
- [ ] Performance optimizations for large grids
- [ ] Folder organization

## License

MIT
