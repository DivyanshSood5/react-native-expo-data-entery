import * as XLSX from 'xlsx';
import { Workbook, Worksheet, Cell } from '../../types';

export class ExcelService {
  // Export workbook to XLSX buffer
  exportWorkbook(workbook: Workbook): Buffer {
    const wb = XLSX.utils.book_new();

    workbook.sheets.forEach((sheet) => {
      const wsData = this.worksheetToSheetData(sheet);
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, sheet.name);
    });

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return wbout;
  }

  // Import workbook from XLSX buffer
  importWorkbook(buffer: Buffer | Arraybuffer): Workbook {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const workbooks: Workbook[] = [];

    wb.SheetNames.forEach((sheetName, index) => {
      const ws = wb.Sheets[sheetName];
      const worksheet = this.sheetToWorksheet(ws, sheetName);

      const workbook: Workbook = {
        id: `imported-${Date.now()}-${index}`,
        name: sheetName.replace('.xlsx', ''),
        folderId: null,
        sheets: [worksheet],
        activeSheetIndex: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      workbooks.push(workbook);
    });

    return workbooks[0];
  }

  // Export to CSV
  exportToCSV(workbook: Workbook, sheetIndex: number = 0): string {
    const sheet = workbook.sheets[sheetIndex];
    const wsData = this.worksheetToSheetData(sheet);
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    return XLSX.utils.sheet_to_csv(ws);
  }

  // Import from CSV
  importFromCSV(csv: string): Workbook {
    const ws = XLSX.utils.read_csv(csv);
    const worksheet = this.sheetToWorksheet(ws, 'Imported');

    return {
      id: `imported-${Date.now()}`,
      name: 'Imported from CSV',
      folderId: null,
      sheets: [worksheet],
      activeSheetIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private worksheetToSheetData(worksheet: Worksheet): any[][] {
    const data: any[][] = [];
    const maxRow = 100;
    const maxCol = 26; // A-Z

    for (let row = 1; row <= maxRow; row++) {
      const rowData: any[] = [];
      for (let col = 0; col < maxCol; col++) {
        const colLetter = String.fromCharCode(65 + col);
        const cellId = `${colLetter}${row}`;
        const cell = worksheet.cells.get(cellId);
        rowData.push(cell?.formattedValue || cell?.value || '');
      }
      // Check if row has any data
      if (rowData.some((cell) => cell !== '' && cell !== null && cell !== 0)) {
        data.push(rowData);
      }
    }

    return data;
  }

  private sheetToWorksheet(ws: XLSX.WorkSheet, name: string): Worksheet {
    const worksheet: Worksheet = {
      id: `sheet-${Date.now()}`,
      name,
      cells: new Map(),
      columnWidths: new Map(),
      rowHeights: new Map(),
    };

    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellAddress];

        if (cell) {
          const colLetter = String.fromCharCode(65 + C);
          const rowNumber = R + 1;
          const cellId = `${colLetter}${rowNumber}`;

          let value: string | number | null = null;
          if (cell.v !== undefined && cell.v !== null) {
            if (typeof cell.v === 'string' && cell.v.includes('T') && cell.v.includes(':')) {
              // Handle date values
              value = cell.v;
            } else if (typeof cell.f === 'string') {
              // Has formula
              value = this.convertExcelValue(cell.v);
            } else {
              value = this.convertExcelValue(cell.v);
            }
          }

          worksheet.cells.set(cellId, {
            value,
            formula: cell.f || null,
            formattedValue: value?.toString() || '',
            style: {
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
            },
            validation: null,
            comments: [],
          });
        }
      }
    }

    return worksheet;
  }

  private convertExcelValue(value: any): string | number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return value;
    if (typeof value === 'boolean') return value;
    return String(value);
  }
}

export const excelService = new ExcelService();
