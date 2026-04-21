# React Native Excel App - Design Specification

**Date:** 2026-04-21
**Status:** Approved

---

## Overview

A mobile Excel-like spreadsheet application for iOS and Android, built with React Native and Expo. Users can create spreadsheet files, organize them in folders, perform daily data entry, and use advanced formulas. Local-first architecture with no sync (cloud sync can be added later).

---

## Requirements Summary

| Aspect | Decision |
|--------|----------|
| **Platforms** | iOS + Android (Expo) |
| **Use Case** | Business Data Entry (inventory, sales logs, customer data) |
| **UI Style** | Google Sheets Style (green theme, compact grid, formula bar, bottom nav) |
| **Storage** | Local-First with AsyncStorage (no sync for now) |
| **Folders** | Single Level Folders |
| **Formulas** | Advanced (all Excel functions, array formulas, custom functions) |
| **Data Scale** | Large (1000+ rows, 30+ columns with virtual scrolling) |
| **Formula Engine** | Existing library (`formulu`) for production readiness |
| **Charts** | Skip for now (focus on core spreadsheet) |
| **Formatting** | Full Excel (conditional formatting, data validation, drop-downs) |
| **Sheets** | Multiple sheets per workbook |
| **Import/Export** | Full Excel (.xlsx) compatibility |
| **Collaboration** | No (single-user files only) |
| **Accounts** | No (app works immediately, all data on device) |
| **Architecture** | Modular Monolith with AsyncStorage |

---

## Architecture

### Tech Stack

- **Framework:** React Native with Expo (latest SDK)
- **Language:** TypeScript
- **State Management:** Zustand
- **Storage:** @react-native-async-storage/async-storage
- **Formula Engine:** `formulu` (Excel formula parser/evaluator)
- **Excel I/O:** `xlsx` (SheetJS) for import/export
- **UI Components:** React Native Paper
- **Virtual Scrolling:** `react-native-virtualized-view` or `flash-list`

### Project Structure

```
ReactNativeExcel/
├── src/
│   ├── core/              # Business logic
│   │   ├── formula/       # Formula parsing & evaluation
│   │   ├── cell/          # Cell data types, validation
│   │   └── workbook/      # Workbook/worksheet management
│   ├── storage/           # Data persistence
│   │   ├── asyncStorage/  # AsyncStorage wrapper
│   │   ├── excel/         # Excel import/export
│   │   └── fileSystem/    # File/folder operations
│   ├── ui/                # UI-specific logic
│   │   ├── grid/          # Spreadsheet grid component
│   │   ├── formulaBar/    # Formula input bar
│   │   ├── sheetTabs/     # Sheet tab navigation
│   │   └── toolbar/       # Formatting toolbar
│   ├── screens/           # App screens
│   │   ├── HomeScreen/
│   │   ├── FileBrowser/
│   │   ├── FolderView/
│   │   └── SpreadsheetEditor/
│   ├── components/        # Reusable UI components
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
├── app.json               # Expo config
├── package.json
└── tsconfig.json
```

---

## Data Models

### Workbook (one .xlsx file)

```typescript
interface Workbook {
  id: string;
  name: string;
  folderId: string | null;
  sheets: Worksheet[];
  createdAt: Date;
  updatedAt: Date;
}

interface Worksheet {
  id: string;
  name: string;
  cells: Map<string, Cell>; // key = "A1", "B2", etc.
  columnWidths: Map<string, number>;
  rowHeights: Map<string, number>;
}

interface Cell {
  value: string | number | null;
  formula: string | null;
  formattedValue: string;
  style: CellStyle;
  validation: DataValidation | null;
  comments: Comment[];
}

interface CellStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  horizontalAlign: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'center' | 'bottom';
  borders: CellBorders;
  numberFormat: string; // e.g., "currency", "percentage", "0.00"
}

interface CellBorders {
  top: Border;
  right: Border;
  bottom: Border;
  left: Border;
}

interface Border {
  color: string;
  style: 'none' | 'solid' | 'dashed' | 'dotted';
}

interface DataValidation {
  type: 'whole' | 'decimal' | 'list' | 'date' | 'textLength';
  criteria: string;
  allowedValues: string[];
  showDropdown: boolean;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
}

interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}
```

---

## UI/UX Design

### Main Navigation (Bottom Tab Bar)

```
┌─────────────────────────────────┐
│  📊 Sheets    📁 Files    ⚙️ Settings  │
└─────────────────────────────────┘
```

### Screen 1: File Browser (Home)

- **Top bar:** App title + "New" button + Search
- **Folder section:** "My Folders" with folder icons (single-level)
- **Recent files:** List of recently opened workbooks
- **All files:** Full list view with options to switch to grid view
- **Long press:** Rename, delete, move to folder, export

### Screen 2: Spreadsheet Editor (Main Feature)

```
┌─────────────────────────────────┐
│ ← Sheet1.xlsx            📤 ⋮   │  ← Header
├─────────────────────────────────┤
│ fx  =SUM(B2:B10)              ✓ │  ← Formula bar
├─────────────────────────────────┤
│ B  I  U  🎨  📊  ⬅️ ➡️ ⬆️ ⬇️    │  ← Toolbar (scrollable)
├─────────────────────────────────┤
│   │ A    B    C    D    E  ... │  ← Column headers
│──┼─────────────────────────────│
│ 1│ Date | Item | Qty | Price  │
│ 2│ Jan 1| Apples| 10 | $2.50  │
│ 3│ Jan 2| Bananas| 5  | $1.20 │
│ ...                              │
│    ┌─────────────────────────┐  │
│    │ Sheet1  Sheet2  Sheet3 │  │  ← Sheet tabs
│    └─────────────────────────┘  │
└─────────────────────────────────┘
```

**Key Interactions:**
- **Tap cell:** Select and show edit indicator
- **Long press cell:** Edit mode with keyboard
- **Swipe row:** Quick duplicate/delete
- **Pinch:** Zoom grid (optional)
- **Pull down:** Undo, pull up: Redo

### Screen 3: Folder View

- List of folders with file count
- Tap folder to see files inside
- "New Folder" button
- Back button to return to all files

---

## Formula Engine

### Library

`formulu` - Excel-compatible formula parser and evaluator

### Supported Formulas (Phased Rollout)

**Phase 1 - Core (MVP):**
- Math: `+`, `-`, `*`, `/`, `^`, `%`
- Aggregation: `SUM`, `AVERAGE`, `MIN`, `MAX`, `COUNT`, `COUNTA`
- Logical: `IF`, `AND`, `OR`, `NOT`
- Reference: Cell refs (`A1`, `$A$1`, `A$1`), Range refs (`A1:B10`)

**Phase 2 - Business Essential:**
- Lookup: `VLOOKUP`, `HLOOKUP`, `INDEX`, `MATCH`
- Text: `CONCATENATE`, `LEFT`, `RIGHT`, `MID`, `LEN`, `TRIM`
- Date: `TODAY`, `NOW`, `DATE`, `DAY`, `MONTH`, `YEAR`, `DATEDIF`
- Conditional: `SUMIF`, `COUNTIF`, `AVERAGEIF`

**Phase 3 - Advanced (Future):**
- Array formulas
- `XLOOKUP`, `FILTER`, `UNIQUE`
- Custom functions

### Formula Evaluation Strategy

1. User enters formula in cell
2. Parse formula → dependency graph
3. Evaluate in correct order (topological sort)
4. Update all dependent cells
5. Cache results, invalidate on change

---

## Features

### Cell Editing

- Tap to select, long-press to edit
- On-screen keyboard with number pad option
- Formula autocomplete as user types
- Error detection (`#DIV/0!`, `#VALUE!`, `#REF!`, `#NAME?`)

### Formatting

- **Text:** Bold, Italic, Underline, Strikethrough
- **Font:** Size, Color
- **Alignment:** Horizontal (left/center/right), Vertical (top/middle/bottom)
- **Number formats:** General, Currency, Percentage, Date, Custom
- **Borders:** All sides, color, style
- **Fill color**

### Data Validation

- Whole numbers, decimals, lists, dates, text length
- Drop-down lists from cell range or manual entry
- Custom error messages

### Conditional Formatting

- Highlight cells greater/less than value
- Highlight top/bottom N values
- Color scales (2-color, 3-color gradients)
- Icon sets (arrows, traffic lights, ratings)

### Sheet Operations

- Add, remove, rename sheets
- Copy/move sheets between workbooks
- Tab colors for organization

### File Operations

- Create new workbook
- Open existing file
- Save (auto-save every 30 seconds)
- Export to .xlsx
- Import from .xlsx or .csv
- Duplicate workbook

---

## Storage Layer

### AsyncStorage Schema

```
workbooks/
  ├── {workbookId}/
  │   ├── metadata.json    # name, folderId, createdAt, updatedAt
  │   └── sheets.json      # all sheet data
folders/
  └── folders.json         # [{id, name, createdAt}]
settings/
  └── settings.json        # app preferences
```

### Auto-Save Strategy

- Debounced save: 2 seconds after last edit
- Background save: Every 30 seconds if app is active
- Manual save: User can trigger via menu
- Save on app blur/pause

### File Size Limits

- Warn at 5MB
- Hard limit at 20MB (AsyncStorage default)
- Suggest export/archival for large files

---

## Error Handling

### Formula Errors

| Error | Cause | User Message |
|-------|-------|--------------|
| `#DIV/0!` | Division by zero | "Cannot divide by zero" |
| `#VALUE!` | Wrong argument type | "Invalid value for this function" |
| `#REF!` | Invalid cell reference | "Cell reference is invalid" |
| `#NAME?` | Unknown function | "Function name not recognized" |
| `#NUM!` | Invalid number | "Number is too large/small" |
| `#N/A` | Value not available | "Value not found" |

### App Errors

- **Storage full:** Show warning, offer cleanup
- **Import fails:** Show which file, suggest re-export from source
- **App crash:** Auto-recover last save on restart

---

## Testing Strategy

### Unit Tests (Jest)

- Formula evaluation
- Cell validation
- Data type conversions
- Storage operations

### Component Tests (React Native Testing Library)

- Grid rendering
- Cell selection/editing
- Toolbar interactions

### E2E Tests (Detox)

- Create new workbook
- Enter data and formulas
- Save and reopen
- Import/export Excel files

---

## Implementation Phases

### Phase 1 - MVP (Weeks 1-3)

- Basic grid with virtual scrolling
- Cell editing (text, numbers)
- Basic formulas (SUM, AVERAGE, math)
- Single sheet per workbook
- AsyncStorage save/load
- File browser

### Phase 2 - Core Features (Weeks 4-6)

- Multiple sheets
- Full formula set (VLOOKUP, IF, date functions)
- Cell formatting (bold, italic, colors, alignment)
- Number formats (currency, percentage, date)
- Excel import/export
- Folders

### Phase 3 - Advanced (Weeks 7-9)

- Data validation
- Conditional formatting
- Borders and fill colors
- Chart placeholders (for future)
- Performance optimizations

---

## Open Questions / Future Considerations

1. **Cloud sync:** Can be added later with migration to WatermelonDB + Firebase/Supabase
2. **Charts:** Deferred to future version
3. **Real-time collaboration:** Not in scope
4. **Custom formulas:** Can be added in Phase 3+
5. **Macros/Scripts:** Not planned

---

## Approval

- [x] Design reviewed and approved by user
- [ ] Implementation plan to be created via `superpowers:writing-plans` skill
