import { create } from 'zustand';
import { Workbook, createEmptyWorkbook, Worksheet, createEmptyWorksheet, CellStyle } from '../types';

interface WorkbookStore {
  workbooks: Map<string, Workbook>;
  activeWorkbookId: string | null;

  addWorkbook: (workbook?: Workbook) => Workbook;
  removeWorkbook: (id: string) => void;
  updateWorkbook: (id: string, updates: Partial<Workbook>) => void;
  setActiveWorkbook: (id: string | null) => void;

  addSheet: (workbookId: string) => void;
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
