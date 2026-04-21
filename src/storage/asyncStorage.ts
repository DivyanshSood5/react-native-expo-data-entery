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
