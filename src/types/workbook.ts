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

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
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
