# React Native Excel App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile Excel-like spreadsheet app for iOS/Android with local storage, formulas, and Excel import/export.

**Architecture:** Modular monolith with Expo, TypeScript, Zustand for state, AsyncStorage for persistence.

**Tech Stack:** Expo SDK 50+, TypeScript, Zustand, AsyncStorage, formulu (formulas), xlsx (Excel I/O), React Native Paper

---

## Phase 1: Project Setup & Foundation

### Task 1: Initialize Expo Project

**Files:**
- Create: `package.json`, `app.json`, `tsconfig.json`, `babel.config.js`
- Create: `App.tsx`, `app/_layout.tsx`, `app/index.tsx`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "react-native-excel",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "dependencies": {
    "expo": "~50.0.0",
    "expo-router": "~3.4.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-paper": "^5.11.0",
    "zustand": "^4.4.0",
    "@react-native-async-storage/async-storage": "1.21.0",
    "formulu": "^1.0.0",
    "xlsx": "^0.18.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.0",
    "typescript": "^5.1.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "@testing-library/react-native": "^12.0.0"
  }
}
```

- [ ] **Step 2: Create app.json**

```json
{
  "expo": {
    "name": "React Native Excel",
    "slug": "react-native-excel",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#107c41"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.reactnativeexcel.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#107c41"
      },
      "package": "com.reactnativeexcel.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2019"],
    "allowJs": true,
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*", "app/**/*"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create babel.config.js**

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };
};
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`

- [ ] **Step 6: Commit**

```bash
git add package.json app.json tsconfig.json babel.config.js
git commit -m "feat: initialize Expo project with dependencies"
```

---

### Task 2: Create Type Definitions

**Files:**
- Create: `src/types/index.ts`
- Create: `src/types/workbook.ts`
- Create: `src/types/cell.ts`
- Create: `src/types/folder.ts`

- [ ] **Step 1: Create src/types/cell.ts**

```typescript
export type HorizontalAlign = 'left' | 'center' | 'right';
export type VerticalAlign = 'top' | 'center' | 'bottom';
export type BorderStyle = 'none' | 'solid' | 'dashed' | 'dotted';
export type ValidationType = 'whole' | 'decimal' | 'list' | 'date' | 'textLength';

export interface Border {
  color: string;
  style: BorderStyle;
}

export interface CellBorders {
  top: Border;
  right: Border;
  bottom: Border;
  left: Border;
}

export interface CellStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  horizontalAlign: HorizontalAlign;
  verticalAlign: VerticalAlign;
  borders: CellBorders;
  numberFormat: string;
}

export interface DataValidation {
  type: ValidationType;
  criteria: string;
  allowedValues: string[];
  showDropdown: boolean;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
}

export interface Cell {
  value: string | number | null;
  formula: string | null;
  formattedValue: string;
  style: CellStyle;
  validation: DataValidation | null;
  comments: Comment[];
}

export const defaultCellStyle: CellStyle = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  fontSize: 14,
  fontFamily: 'System',
  textColor: '#000000',
  backgroundColor: '#FFFFFF',
  horizontalAlign: 'left',
  verticalAlign: 'top',
  borders: {
    top: { color: '#000000', style: 'none' },
    right: { color: '#000000', style: 'none' },
    bottom: { color: '#000000', style: 'none' },
    left: { color: '#000000', style: 'none' },
  },
  numberFormat: 'general',
};

export function createEmptyCell(): Cell {
  return {
    value: null,
    formula: null,
    formattedValue: '',
    style: { ...defaultCellStyle },
    validation: null,
    comments: [],
  };
}
```

- [ ] **Step 2: Create src/types/workbook.ts**

```typescript
import { Cell } from './cell';

export interface Worksheet {
  id: string;
  name: string;
  cells: Map<string, Cell>;
  columnWidths: Map<string, number>;
  rowHeights: Map<string, number>;
  tabColor?: string;
}

export interface Workbook {
  id: string;
  name: string;
  folderId: string | null;
  sheets: Worksheet[];
  activeSheetIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export function createEmptyWorksheet(id?: string): Worksheet {
  return {
    id: id || generateId(),
    name: 'Sheet 1',
    cells: new Map(),
    columnWidths: new Map(),
    rowHeights: new Map(),
  };
}

export function createEmptyWorkbook(name?: string): Workbook {
  const now = new Date();
  return {
    id: generateId(),
    name: name || 'Untitled',
    folderId: null,
    sheets: [createEmptyWorksheet()],
    activeSheetIndex: 0,
    createdAt: now,
    updatedAt: now,
  };
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
```

- [ ] **Step 3: Create src/types/folder.ts**

```typescript
export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

export function createFolder(name: string): Folder {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    name,
    createdAt: new Date(),
  };
}
```

- [ ] **Step 4: Create src/types/index.ts**

```typescript
export * from './cell';
export * from './workbook';
export * from './folder';
```

- [ ] **Step 5: Commit**

```bash
git add src/types/
git commit -m "feat: add type definitions for cell, workbook, and folder"
```

---

### Task 3: Setup Zustand Store

**Files:**
- Create: `src/store/workbookStore.ts`
- Create: `src/store/folderStore.ts`
- Create: `src/store/index.ts`

- [ ] **Step 1: Create src/store/workbookStore.ts**

```typescript
import { create } from 'zustand';
import { Workbook, createEmptyWorkbook, Worksheet, createEmptyWorksheet, CellStyle } from '../types';

interface WorkbookStore {
  workbooks: Map<string, Workbook>;
  activeWorkbookId: string | null;
  
  addWorkbook: (workbook?: Workbook) => Workbook;
  removeWorkbook: (id: string) => void;
  updateWorkbook: (id: string, updates: Partial<Workbook>) => void;
  setActiveWorkbook: (id: string | null) => void;
  
  addSheet: (workbookId: string, sheet?: Worksheet) => void;
  removeSheet: (workbookId: string, sheetIndex: number) => void;
  renameSheet: (workbookId: string, sheetIndex: number, name: string) => void;
  setActiveSheet: (workbookId: string, sheetIndex: number) => void;
  
  setCellValue: (workbookId: string, sheetIndex: number, cellId: string, value: string | number | null) => void;
  setCellFormula: (workbookId: string, sheetIndex: number, cellId: string, formula: string) => void;
  setCellStyle: (workbookId: string, sheetIndex: number, cellId: string, style: Partial<CellStyle>) => void;
  getActiveWorkbook: () => Workbook | undefined;
  getActiveSheet: (workbookId: string) => Worksheet | undefined;
}

export const useWorkbookStore = create<WorkbookStore>((set, get) => ({
  workbooks: new Map(),
  activeWorkbookId: null,

  addWorkbook: (workbook) => {
    const newWorkbook = workbook || createEmptyWorkbook();
    set((state) => ({
      workbooks: new Map(state.workbooks).set(newWorkbook.id, newWorkbook),
      activeWorkbookId: newWorkbook.id,
    }));
    return newWorkbook;
  },

  removeWorkbook: (id) => {
    set((state) => {
      const newWorkbooks = new Map(state.workbooks);
      newWorkbooks.delete(id);
      return {
        workbooks: newWorkbooks,
        activeWorkbookId: state.activeWorkbookId === id ? null : state.activeWorkbookId,
      };
    });
  },

  updateWorkbook: (id, updates) => {
    set((state) => {
      const workbook = state.workbooks.get(id);
      if (!workbook) return state;
      return {
        workbooks: new Map(state.workbooks).set(id, {
          ...workbook,
          ...updates,
          updatedAt: new Date(),
        }),
      };
    });
  },

  setActiveWorkbook: (id) => {
    set({ activeWorkbookId: id });
  },

  addSheet: (workbookId) => {
    set((state) => {
      const workbook = state.workbooks.get(workbookId);
      if (!workbook) return state;
      const newSheet = createEmptyWorksheet();
      newSheet.name = `Sheet ${workbook.sheets.length + 1}`;
      return {
        workbooks: new Map(state.workbooks).set(workbookId, {
          ...workbook,
          sheets: [...workbook.sheets, newSheet],
          updatedAt: new Date(),
        }),
      };
    });
  },

  removeSheet: (workbookId, sheetIndex) => {
    set((state) => {
      const workbook = state.workbooks.get(workbookId);
      if (!workbook || workbook.sheets.length <= 1) return state;
      const newSheets = workbook.sheets.filter((_, i) => i !== sheetIndex);
      return {
        workbooks: new Map(state.workbooks).set(workbookId, {
          ...workbook,
          sheets: newSheets,
          activeSheetIndex: Math.min(workbook.activeSheetIndex, newSheets.length - 1),
          updatedAt: new Date(),
        }),
      };
    });
  },

  renameSheet: (workbookId, sheetIndex, name) => {
    set((state) => {
      const workbook = state.workbooks.get(workbookId);
      if (!workbook) return state;
      const newSheets = workbook.sheets.map((s, i) =>
        i === sheetIndex ? { ...s, name } : s
      );
      return {
        workbooks: new Map(state.workbooks).set(workbookId, {
          ...workbook,
          sheets: newSheets,
          updatedAt: new Date(),
        }),
      };
    });
  },

  setActiveSheet: (workbookId, sheetIndex) => {
    set((state) => {
      const workbook = state.workbooks.get(workbookId);
      if (!workbook) return state;
      return {
        workbooks: new Map(state.workbooks).set(workbookId, {
          ...workbook,
          activeSheetIndex: sheetIndex,
        }),
      };
    });
  },

  setCellValue: (workbookId, sheetIndex, cellId, value) => {
    set((state) => {
      const workbook = state.workbooks.get(workbookId);
      if (!workbook) return state;
      const sheet = workbook.sheets[sheetIndex];
      if (!sheet) return state;
      
      const existingCell = sheet.cells.get(cellId);
      const updatedCell = {
        ...existingCell,
        value,
        formula: null,
        formattedValue: value?.toString() || '',
      };
      
      sheet.cells.set(cellId, updatedCell);
      
      return {
        workbooks: new Map(state.workbooks).set(workbookId, {
          ...workbook,
          updatedAt: new Date(),
        }),
      };
    });
  },

  setCellFormula: (workbookId, sheetIndex, cellId, formula) => {
    set((state) => {
      const workbook = state.workbooks.get(workbookId);
      if (!workbook) return state;
      const sheet = workbook.sheets[sheetIndex];
      if (!sheet) return state;
      
      const existingCell = sheet.cells.get(cellId);
      const updatedCell = {
        ...existingCell,
        formula,
      };
      
      sheet.cells.set(cellId, updatedCell);
      
      return {
        workbooks: new Map(state.workbooks).set(workbookId, {
          ...workbook,
          updatedAt: new Date(),
        }),
      };
    });
  },

  setCellStyle: (workbookId, sheetIndex, cellId, style) => {
    set((state) => {
      const workbook = state.workbooks.get(workbookId);
      if (!workbook) return state;
      const sheet = workbook.sheets[sheetIndex];
      if (!sheet) return state;
      
      const cell = sheet.cells.get(cellId);
      if (!cell) return state;
      
      sheet.cells.set(cellId, {
        ...cell,
        style: { ...cell.style, ...style },
      });
      
      return {
        workbooks: new Map(state.workbooks).set(workbookId, {
          ...workbook,
          updatedAt: new Date(),
        }),
      };
    });
  },

  getActiveWorkbook: () => {
    const { workbooks, activeWorkbookId } = get();
    return activeWorkbookId ? workbooks.get(activeWorkbookId) : undefined;
  },

  getActiveSheet: (workbookId) => {
    const workbook = get().workbooks.get(workbookId);
    if (!workbook) return undefined;
    return workbook.sheets[workbook.activeSheetIndex];
  },
}));
```

- [ ] **Step 2: Create src/store/folderStore.ts**

```typescript
import { create } from 'zustand';
import { Folder, createFolder } from '../types';

interface FolderStore {
  folders: Folder[];
  
  addFolder: (name: string) => Folder;
  removeFolder: (id: string) => void;
  renameFolder: (id: string, name: string) => void;
  getFolder: (id: string) => Folder | undefined;
}

export const useFolderStore = create<FolderStore>((set, get) => ({
  folders: [],

  addFolder: (name) => {
    const folder = createFolder(name);
    set((state) => ({ folders: [...state.folders, folder] }));
    return folder;
  },

  removeFolder: (id) => {
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
    }));
  },

  renameFolder: (id, name) => {
    set((state) => ({
      folders: state.folders.map((f) =>
        f.id === id ? { ...f, name } : f
      ),
    }));
  },

  getFolder: (id) => {
    return get().folders.find((f) => f.id === id);
  },
}));
```

- [ ] **Step 3: Create src/store/index.ts**

```typescript
export { useWorkbookStore } from './workbookStore';
export { useFolderStore } from './folderStore';
```

- [ ] **Step 4: Commit**

```bash
git add src/store/
git commit -m "feat: add Zustand stores for workbook and folder management"
```

---

## Phase 2: Storage Layer

### Task 4: AsyncStorage Integration

**Files:**
- Create: `src/storage/asyncStorage.ts`
- Create: `src/storage/index.ts`

- [ ] **Step 1: Create src/storage/asyncStorage.ts**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workbook, Folder } from '../types';

const WORKBOOKS_KEY = 'excel_workbooks';
const FOLDERS_KEY = 'excel_folders';
const RECENT_FILES_KEY = 'excel_recent_files';

export class StorageService {
  // Workbooks
  async saveWorkbook(workbook: Workbook): Promise<void> {
    try {
      const workbooks = await this.getAllWorkbooks();
      workbooks[workbook.id] = this.serializeWorkbook(workbook);
      await AsyncStorage.setItem(WORKBOOKS_KEY, JSON.stringify(workbooks));
    } catch (error) {
      console.error('Error saving workbook:', error);
      throw error;
    }
  }

  async getAllWorkbooks(): Promise<Record<string, Workbook>> {
    try {
      const data = await AsyncStorage.getItem(WORKBOOKS_KEY);
      return data ? JSON.parse(data, this.reviveWorkbook) : {};
    } catch (error) {
      console.error('Error getting workbooks:', error);
      return {};
    }
  }

  async getWorkbook(id: string): Promise<Workbook | null> {
    try {
      const workbooks = await this.getAllWorkbooks();
      return workbooks[id] || null;
    } catch (error) {
      console.error('Error getting workbook:', error);
      return null;
    }
  }

  async deleteWorkbook(id: string): Promise<void> {
    try {
      const workbooks = await this.getAllWorkbooks();
      delete workbooks[id];
      await AsyncStorage.setItem(WORKBOOKS_KEY, JSON.stringify(workbooks));
    } catch (error) {
      console.error('Error deleting workbook:', error);
      throw error;
    }
  }

  // Folders
  async saveFolders(folders: Folder[]): Promise<void> {
    try {
      await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
    } catch (error) {
      console.error('Error saving folders:', error);
      throw error;
    }
  }

  async getFolders(): Promise<Folder[]> {
    try {
      const data = await AsyncStorage.getItem(FOLDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting folders:', error);
      return [];
    }
  }

  // Recent files
  async addRecentFile(workbookId: string): Promise<void> {
    try {
      const recent = await this.getRecentFiles();
      const filtered = recent.filter(id => id !== workbookId);
      filtered.unshift(workbookId);
      await AsyncStorage.setItem(RECENT_FILES_KEY, JSON.stringify(filtered.slice(0, 10)));
    } catch (error) {
      console.error('Error adding recent file:', error);
    }
  }

  async getRecentFiles(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(RECENT_FILES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting recent files:', error);
      return [];
    }
  }

  // Serializers
  private serializeWorkbook(workbook: Workbook): Workbook {
    return {
      ...workbook,
      sheets: workbook.sheets.map(sheet => ({
        ...sheet,
        cells: Object.fromEntries(sheet.cells),
        columnWidths: Object.fromEntries(sheet.columnWidths),
        rowHeights: Object.fromEntries(sheet.rowHeights),
      })),
    };
  }

  private reviveWorkbook(key: string, value: any): any {
    if (key === 'cells' || key === 'columnWidths' || key === 'rowHeights') {
      return new Map(Object.entries(value));
    }
    if (key === 'createdAt' || key === 'updatedAt') {
      return new Date(value);
    }
    return value;
  }
}

export const storageService = new StorageService();
```

- [ ] **Step 2: Create src/storage/index.ts**

```typescript
export { StorageService, storageService } from './asyncStorage';
```

- [ ] **Step 3: Commit**

```bash
git add src/storage/
git commit -m "feat: add AsyncStorage service for persistence"
```

---

## Phase 3: Formula Engine

### Task 5: Formula Evaluation

**Files:**
- Create: `src/core/formula/formulaEngine.ts`
- Create: `src/core/formula/cellReference.ts`
- Create: `src/core/formula/index.ts`

- [ ] **Step 1: Create src/core/formula/cellReference.ts**

```typescript
export interface CellPosition {
  col: number;
  row: number;
}

export function colToLetter(col: number): string {
  let letter = '';
  while (col > 0) {
    col--;
    letter = String.fromCharCode(65 + (col % 26)) + letter;
    col = Math.floor(col / 26);
  }
  return letter;
}

export function letterToCol(letter: string): number {
  let col = 0;
  for (let i = 0; i < letter.length; i++) {
    col = col * 26 + (letter.charCodeAt(i) - 64);
  }
  return col;
}

export function cellIdToPosition(cellId: string): CellPosition {
  const match = cellId.match(/^([A-Z]+)(\d+)$/i);
  if (!match) throw new Error(`Invalid cell ID: ${cellId}`);
  return {
    col: letterToCol(match[1].toUpperCase()),
    row: parseInt(match[2], 10),
  };
}

export function positionToCellId(pos: CellPosition): string {
  return colToLetter(pos.col) + pos.row;
}

export function parseRange(range: string): { start: CellPosition; end: CellPosition } {
  const [start, end] = range.split(':');
  return {
    start: cellIdToPosition(start),
    end: cellIdToPosition(end),
  };
}

export function generateRangeCells(range: string): string[] {
  const { start, end } = parseRange(range);
  const cells: string[] = [];
  for (let row = start.row; row <= end.row; row++) {
    for (let col = start.col; col <= end.col; col++) {
      cells.push(positionToCellId({ col, row }));
    }
  }
  return cells;
}
```

- [ ] **Step 2: Create src/core/formula/formulaEngine.ts**

```typescript
import { Worksheet } from '../../types';
import { cellIdToPosition, positionToCellId, generateRangeCells } from './cellReference';

export class FormulaEngine {
  evaluate(formula: string, sheet: Worksheet): any {
    if (!formula || !formula.startsWith('=')) {
      return formula;
    }

    const expression = formula.substring(1).toUpperCase();
    
    try {
      return this.evaluateExpression(expression, sheet);
    } catch (error) {
      return '#ERROR';
    }
  }

  private evaluateExpression(expression: string, sheet: Worksheet): any {
    // Handle cell references
    expression = expression.replace(/[A-Z]+(\d+)/g, (match) => {
      const cell = sheet.cells.get(match);
      return cell?.value !== null ? String(cell?.value) : '0';
    });

    // Handle ranges in functions
    expression = expression.replace(/\b([A-Z]+)([A-Z]+:\d+)\b/g, (match, func, range) => {
      const cells = generateRangeCells(range);
      const values = cells.map(cellId => {
        const cell = sheet.cells.get(cellId);
        return cell?.value !== null ? Number(cell.value) : 0;
      });
      return this.evaluateFunction(func, values);
    });

    // Safe math evaluation
    if (/^[0-9+\-*/().\s]+$/.test(expression)) {
      try {
        return Function('"use strict";return (' + expression + ')')();
      } catch {
        return '#ERROR';
      }
    }

    return '#ERROR';
  }

  private evaluateFunction(func: string, args: number[]): any {
    switch (func) {
      case 'SUM':
        return args.reduce((a, b) => a + b, 0);
      case 'AVERAGE':
        return args.length > 0 ? args.reduce((a, b) => a + b, 0) / args.length : 0;
      case 'MIN':
        return args.length > 0 ? Math.min(...args) : 0;
      case 'MAX':
        return args.length > 0 ? Math.max(...args) : 0;
      case 'COUNT':
        return args.filter(a => typeof a === 'number').length;
      default:
        return '#NAME?';
    }
  }

  getDependencies(formula: string): string[] {
    const deps: string[] = [];
    const cellRegex = /[A-Z]+(\d+)/gi;
    const rangeRegex = /([A-Z]+)(\d+):([A-Z]+)(\d+)/gi;
    
    let match;
    while ((match = rangeRegex.exec(formula)) !== null) {
      deps.push(...generateRangeCells(match[0]));
    }
    
    while ((match = cellRegex.exec(formula)) !== null) {
      if (!deps.includes(match[0])) {
        deps.push(match[0]);
      }
    }
    
    return deps;
  }
}

export const formulaEngine = new FormulaEngine();
```

- [ ] **Step 3: Create src/core/formula/index.ts**

```typescript
export { FormulaEngine, formulaEngine } from './formulaEngine';
export {
  colToLetter,
  letterToCol,
  cellIdToPosition,
  positionToCellId,
  parseRange,
  generateRangeCells,
} from './cellReference';
export type { CellPosition } from './cellReference';
```

- [ ] **Step 4: Commit**

```bash
git add src/core/formula/
git commit -m "feat: add formula engine with basic functions"
```

---

## Phase 4: UI Components

### Task 6: Spreadsheet Grid Component

**Files:**
- Create: `src/ui/grid/SpreadsheetGrid.tsx`
- Create: `src/ui/grid/Cell.tsx`
- Create: `src/ui/grid/index.ts`

- [ ] **Step 1: Create src/ui/grid/Cell.tsx**

```typescript
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Cell as CellType } from '../../types';

interface CellProps {
  cellId: string;
  cellData: CellType | null;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

export const Cell: React.FC<CellProps> = ({
  cellId,
  cellData,
  isSelected,
  onPress,
  onLongPress,
}) => {
  const style = cellData?.style;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.cell,
        isSelected && styles.selectedCell,
        style && {
          backgroundColor: style.backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.cellText,
          style && {
            color: style.textColor,
            fontWeight: style.bold ? 'bold' : 'normal',
            fontStyle: style.italic ? 'italic' : 'normal',
            textDecorationLine: style.underline ? 'underline' : 'none',
            fontSize: style.fontSize,
            textAlign: style.horizontalAlign,
          },
        ]}
      >
        {cellData?.formattedValue || ''}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    minWidth: 80,
    height: 40,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  selectedCell: {
    borderColor: '#2196f3',
    borderWidth: 2,
  },
  cellText: {
    fontSize: 14,
    color: '#000000',
  },
});
```

- [ ] **Step 2: Create src/ui/grid/SpreadsheetGrid.tsx**

```typescript
import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Worksheet } from '../../types';
import { Cell } from './Cell';
import { colToLetter } from '../../core/formula';

interface SpreadsheetGridProps {
  sheet: Worksheet;
  selectedCell: string | null;
  onCellPress: (cellId: string) => void;
  onCellLongPress: (cellId: string) => void;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  sheet,
  selectedCell,
  onCellPress,
  onCellLongPress,
}) => {
  const maxColumns = 26; // A-Z
  const maxRows = 100;

  const columnHeaders = useMemo(() => {
    return Array.from({ length: maxColumns }, (_, i) => colToLetter(i + 1));
  }, []);

  const rowNumbers = useMemo(() => {
    return Array.from({ length: maxRows }, (_, i) => i + 1);
  }, []);

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <View style={styles.cornerCell} />
      {columnHeaders.map((col) => (
        <View key={col} style={styles.columnHeader}>
          <Text style={styles.columnHeaderText}>{col}</Text>
        </View>
      ))}
    </View>
  );

  const renderRow = ({ item: rowIndex }) => (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowHeaderText}>{rowIndex}</Text>
      </View>
      {columnHeaders.map((col) => {
        const cellId = col + rowIndex;
        const cellData = sheet.cells.get(cellId) || null;
        return (
          <Cell
            key={cellId}
            cellId={cellId}
            cellData={cellData}
            isSelected={selectedCell === cellId}
            onPress={() => onCellPress(cellId)}
            onLongPress={() => onCellLongPress(cellId)}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={rowNumbers}
        renderItem={renderRow}
        keyExtractor={(item) => item.toString()}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderColor: '#e0e0e0',
  },
  cornerCell: {
    width: 50,
    height: 40,
    borderBottomWidth: 2,
    borderColor: '#e0e0e0',
  },
  columnHeader: {
    flex: 1,
    minWidth: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },
  columnHeaderText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  rowHeader: {
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRightWidth: 2,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  rowHeaderText: {
    fontSize: 12,
    color: '#666666',
  },
});
```

- [ ] **Step 3: Create src/ui/grid/index.ts**

```typescript
export { SpreadsheetGrid } from './SpreadsheetGrid';
export { Cell } from './Cell';
```

- [ ] **Step 4: Commit**

```bash
git add src/ui/grid/
git commit -m "feat: add spreadsheet grid and cell components"
```

---

## Phase 5: Screens

### Task 7: Spreadsheet Editor Screen

**Files:**
- Create: `app/editor/[workbookId].tsx`
- Create: `src/ui/formulaBar/FormulaBar.tsx`
- Create: `src/ui/sheetTabs/SheetTabs.tsx`

- [ ] **Step 1: Create src/ui/formulaBar/FormulaBar.tsx**

```typescript
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

interface FormulaBarProps {
  selectedCell: string | null;
  formula: string | null;
  onFormulaChange: (formula: string) => void;
}

export const FormulaBar: React.FC<FormulaBarProps> = ({
  selectedCell,
  formula,
  onFormulaChange,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [localFormula, setLocalFormula] = useState('');

  const handleFocus = () => {
    setEditMode(true);
    setLocalFormula(formula || '');
  };

  const handleBlur = () => {
    setEditMode(false);
    onFormulaChange(localFormula);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cellIndicator}>
        <Text style={styles.cellIndicatorText}>fx</Text>
      </View>
      <TextInput
        style={styles.input}
        value={editMode ? localFormula : (formula || '')}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Enter value or formula"
        placeholderTextColor="#999999"
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  cellIndicator: {
    width: 40,
    height: 36,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cellIndicatorText: {
    fontSize: 12,
    color: '#666666',
  },
  input: {
    flex: 1,
    height: 36,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 14,
  },
});
```

- [ ] **Step 2: Create src/ui/sheetTabs/SheetTabs.tsx**

```typescript
import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Worksheet } from '../../types';

interface SheetTabsProps {
  sheets: Worksheet[];
  activeSheetIndex: number;
  onSheetPress: (index: number) => void;
  onAddSheet: () => void;
}

export const SheetTabs: React.FC<SheetTabsProps> = ({
  sheets,
  activeSheetIndex,
  onSheetPress,
  onAddSheet,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {sheets.map((sheet, index) => (
          <TouchableOpacity
            key={sheet.id}
            style={[
              styles.tab,
              index === activeSheetIndex && styles.activeTab,
            ]}
            onPress={() => onSheetPress(index)}
          >
            <Text
              style={[
                styles.tabText,
                index === activeSheetIndex && styles.activeTabText,
              ]}
            >
              {sheet.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addTab} onPress={onAddSheet}>
          <Text style={styles.addTabText}>+</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    height: 40,
  },
  tab: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: '#107c41',
  },
  tabText: {
    fontSize: 13,
    color: '#666666',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  addTab: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTabText: {
    fontSize: 20,
    color: '#107c41',
  },
});
```

- [ ] **Step 3: Create app/editor/[workbookId].tsx**

```typescript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Header, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkbookStore } from '../../src/store';
import { SpreadsheetGrid } from '../../src/ui/grid';
import { FormulaBar } from '../../src/ui/formulaBar/FormulaBar';
import { SheetTabs } from '../../src/ui/sheetTabs/SheetTabs';

export default function EditorScreen() {
  const { workbookId } = useLocalSearchParams();
  const router = useRouter();
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const workbook = useWorkbookStore((s) => s.workbooks.get(workbookId as string));
  const activeSheetIndex = useWorkbookStore((s) => s.activeSheetIndex);
  const setActiveSheet = useWorkbookStore((s) => s.setActiveSheet);
  const addSheet = useWorkbookStore((s) => s.addSheet);
  const setCellValue = useWorkbookStore((s) => s.setCellValue);
  const setCellFormula = useWorkbookStore((s) => s.setCellFormula);

  const activeSheet = workbook?.sheets[activeSheetIndex];

  const handleFormulaChange = (formula: string) => {
    if (!workbookId || !selectedCell) return;
    
    if (formula.startsWith('=')) {
      setCellFormula(workbookId, activeSheetIndex, selectedCell, formula);
    } else {
      setCellValue(workbookId, activeSheetIndex, selectedCell, formula || null);
    }
  };

  const currentFormula = selectedCell && activeSheet?.cells.get(selectedCell)?.formula;

  if (!workbook || !activeSheet) {
    return <View style={styles.container}><Text>Workbook not found</Text></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#107c41" />
      <Header
        left={() => (
          <IconButton icon="arrow-left" onPress={() => router.back()} />
        )}
        title={workbook.name}
        right={() => (
          <IconButton icon="share-variant" onPress={() => {}} />
        )}
        style={styles.header}
        textStyle={styles.headerTitle}
      />
      <FormulaBar
        selectedCell={selectedCell}
        formula={currentFormula}
        onFormulaChange={handleFormulaChange}
      />
      <SpreadsheetGrid
        sheet={activeSheet}
        selectedCell={selectedCell}
        onCellPress={setSelectedCell}
        onCellLongPress={setSelectedCell}
      />
      <SheetTabs
        sheets={workbook.sheets}
        activeSheetIndex={activeSheetIndex}
        onSheetPress={(index) => setActiveSheet(workbookId, index)}
        onAddSheet={() => addSheet(workbookId)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#107c41',
  },
  headerTitle: {
    color: '#ffffff',
  },
});
```

- [ ] **Step 4: Commit**

```bash
git add app/editor/ src/ui/formulaBar/ src/ui/sheetTabs/
git commit -m "feat: add spreadsheet editor screen with formula bar and sheet tabs"
```

---

## Phase 6: File Browser

### Task 8: Home Screen with File List

**Files:**
- Create: `app/index.tsx`
- Create: `app/_layout.tsx`

- [ ] **Step 1: Create app/_layout.tsx**

```typescript
import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#107c41',
    background: '#ffffff',
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="editor/[workbookId]" options={{ presentation: 'card' }} />
      </Stack>
    </PaperProvider>
  );
}
```

- [ ] **Step 2: Create app/index.tsx**

```typescript
import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { Button, FAB, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useWorkbookStore, useFolderStore } from '../src/store';
import { createEmptyWorkbook } from '../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const workbooks = useWorkbookStore((s) => Array.from(s.workbooks.values()));
  const folders = useFolderStore((s) => s.folders);
  const addWorkbook = useWorkbookStore((s) => s.addWorkbook);
  const setActiveWorkbook = useWorkbookStore((s) => s.setActiveWorkbook);
  const addFolder = useFolderStore((s) => s.addFolder);

  const handleCreateWorkbook = () => {
    const workbook = addWorkbook(createEmptyWorkbook('Untitled Workbook'));
    router.push(`/editor/${workbook.id}`);
  };

  const handleOpenWorkbook = (workbookId: string) => {
    setActiveWorkbook(workbookId);
    router.push(`/editor/${workbookId}`);
  };

  const handleDeleteWorkbook = (workbookId: string) => {
    Alert.alert(
      'Delete Workbook',
      'Are you sure you want to delete this workbook?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Delete logic here
          },
        },
      ]
    );
  };

  const handleCreateFolder = () => {
    addFolder('New Folder');
  };

  const renderWorkbook = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.fileItem}
      onPress={() => handleOpenWorkbook(item.id)}
      onLongPress={() => handleDeleteWorkbook(item.id)}
    >
      <View style={styles.fileIcon}>
        <Text style={styles.fileIconText}>📊</Text>
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{item.name}</Text>
        <Text style={styles.fileDate}>
          {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Workbooks</Text>
      </View>
      
      {folders.length > 0 && (
        <View style={styles.folderSection}>
          <Text style={styles.sectionTitle}>Folders</Text>
          {folders.map((folder) => (
            <Chip key={folder.id} icon="folder">{folder.name}</Chip>
          ))}
        </View>
      )}

      <FlatList
        data={workbooks}
        renderItem={renderWorkbook}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No workbooks yet</Text>
            <Text style={styles.emptySubtext}>Create your first workbook to get started</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateWorkbook}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#107c41',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  folderSection: {
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileIconText: {
    fontSize: 24,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  fileDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#107c41',
  },
});
```

- [ ] **Step 3: Commit**

```bash
git add app/index.tsx app/_layout.tsx
git commit -m "feat: add home screen with file browser"
```

---

## Summary

This plan covers Phase 1 (MVP) of the React Native Excel app:

1. **Project Setup** - Expo initialization with TypeScript
2. **Type Definitions** - Cell, Workbook, Folder types
3. **State Management** - Zustand stores
4. **Storage** - AsyncStorage persistence
5. **Formula Engine** - Basic formula evaluation
6. **UI Components** - Spreadsheet grid, cells
7. **Screens** - Editor and file browser

**Next phases** (to be added in future plans):
- Phase 2: Full formula support, formatting, Excel import/export
- Phase 3: Data validation, conditional formatting, advanced features

---

Plan complete. Ready for implementation via subagent-driven development or inline execution.
