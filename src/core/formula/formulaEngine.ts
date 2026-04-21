import { Worksheet } from '../../types';
import { cellIdToPosition, positionToCellId, generateRangeCells } from './cellReference';

export class FormulaEngine {
  evaluate(formula: string, sheet: Worksheet): any {
    if (!formula || !formula.startsWith('=')) {
      return formula;
    }

    const expression = formula.substring(1).trim();

    try {
      return this.evaluateExpression(expression, sheet);
    } catch (error) {
      return '#ERROR';
    }
  }

  private evaluateExpression(expression: string, sheet: Worksheet): any {
    // Check for function calls
    const funcMatch = expression.match(/^([A-Z]+)\((.*)\)$/i);
    if (funcMatch) {
      const funcName = funcMatch[1].toUpperCase();
      const argsStr = funcMatch[2];
      const args = this.parseArguments(argsStr, sheet);
      return this.evaluateFunction(funcName, args, sheet);
    }

    // Handle cell references
    let processed = expression.replace(/[A-Z]+(\d+)/gi, (match) => {
      const cell = sheet.cells.get(match);
      const val = cell?.value;
      if (val === null || val === undefined) return '0';
      if (typeof val === 'string') return `"${val}"`;
      return String(val);
    });

    // Safe math evaluation
    if (/^[0-9+\-*/().\s,"']+$/.test(processed)) {
      try {
        return Function('"use strict";return (' + processed + ')')();
      } catch {
        return '#ERROR';
      }
    }

    // Return as-is if it's a simple value
    return expression;
  }

  private parseArguments(argsStr: string, sheet: Worksheet): any[] {
    const args: any[] = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < argsStr.length; i++) {
      const char = argsStr[i];
      if (char === '(') depth++;
      if (char === ')') depth--;
      if (char === ',' && depth === 0) {
        args.push(this.evaluateArgument(current.trim(), sheet));
        current = '';
      } else {
        current += char;
      }
    }
    if (current.trim()) {
      args.push(this.evaluateArgument(current.trim(), sheet));
    }
    return args;
  }

  private evaluateArgument(arg: string, sheet: Worksheet): any {
    // Range reference
    if (arg.includes(':')) {
      const cells = generateRangeCells(arg);
      return cells.map(cellId => {
        const cell = sheet.cells.get(cellId);
        return cell && cell.value !== null ? Number(cell.value) : 0;
      });
    }

    // Cell reference
    if (/^[A-Z]+(\d+)$/i.test(arg)) {
      const cell = sheet.cells.get(arg);
      return cell && cell.value !== null ? cell.value : 0;
    }

    // Number
    if (!isNaN(Number(arg))) {
      return Number(arg);
    }

    // String
    if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
      return arg.slice(1, -1);
    }

    return arg;
  }

  private evaluateFunction(func: string, args: any[], sheet: Worksheet): any {
    switch (func) {
      // Math functions
      case 'SUM':
        return this.sum(args);
      case 'AVERAGE':
      case 'AVG':
        return this.average(args);
      case 'MIN':
        return this.min(args);
      case 'MAX':
        return this.max(args);
      case 'COUNT':
        return this.count(args);
      case 'COUNTA':
        return this.countA(args);

      // Logical functions
      case 'IF':
        return this.ifFunc(args);
      case 'AND':
        return args.every(v => this.toBoolean(v));
      case 'OR':
        return args.some(v => this.toBoolean(v));
      case 'NOT':
        return !this.toBoolean(args[0]);

      // Text functions
      case 'CONCAT':
      case 'CONCATENATE':
        return args.map(a => String(a)).join('');
      case 'LEFT':
        return this.left(args);
      case 'RIGHT':
        return this.right(args);
      case 'MID':
        return this.mid(args);
      case 'LEN':
        return String(args[0] || '').length;
      case 'TRIM':
        return String(args[0] || '').trim();
      case 'UPPER':
        return String(args[0] || '').toUpperCase();
      case 'LOWER':
        return String(args[0] || '').toLowerCase();

      // Date functions
      case 'TODAY':
        return new Date().toISOString().split('T')[0];
      case 'NOW':
        return new Date();
      case 'YEAR':
        return this.year(args);
      case 'MONTH':
        return this.month(args);
      case 'DAY':
        return this.day(args);

      // Lookup functions
      case 'VLOOKUP':
        return this.vlookup(args, sheet);
      case 'HLOOKUP':
        return this.hlookup(args, sheet);
      case 'INDEX':
        return this.index(args, sheet);
      case 'MATCH':
        return this.match(args);

      // Conditional aggregation
      case 'SUMIF':
        return this.sumif(args, sheet);
      case 'COUNTIF':
        return this.countif(args, sheet);

      default:
        return '#NAME?';
    }
  }

  // Math functions
  private sum(args: any[]): number {
    return this.flatten(args).reduce((a, b) => a + Number(b) || 0, 0);
  }

  private average(args: any[]): number {
    const flat = this.flatten(args).filter(v => !isNaN(Number(v)));
    return flat.length > 0 ? flat.reduce((a, b) => a + Number(b), 0) / flat.length : 0;
  }

  private min(args: any[]): number {
    const flat = this.flatten(args).filter(v => !isNaN(Number(v)));
    return flat.length > 0 ? Math.min(...flat.map(Number)) : 0;
  }

  private max(args: any[]): number {
    const flat = this.flatten(args).filter(v => !isNaN(Number(v)));
    return flat.length > 0 ? Math.max(...flat.map(Number)) : 0;
  }

  private count(args: any[]): number {
    return this.flatten(args).filter(v => typeof v === 'number' || !isNaN(Number(v))).length;
  }

  private countA(args: any[]): number {
    return this.flatten(args).filter(v => v != null && v !== '').length;
  }

  // Logical functions
  private ifFunc(args: any[]): any {
    if (args.length < 2) return '#ERROR';
    const condition = this.toBoolean(args[0]);
    return condition ? args[1] : (args[2] ?? '');
  }

  private toBoolean(val: any): boolean {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    if (typeof val === 'string') return val.toLowerCase() === 'true';
    return !!val;
  }

  // Text functions
  private left(args: any[]): string {
    const str = String(args[0] || '');
    const len = args[1] ? Number(args[1]) : 1;
    return str.slice(0, len);
  }

  private right(args: any[]): string {
    const str = String(args[0] || '');
    const len = args[1] ? Number(args[1]) : 1;
    return str.slice(-len);
  }

  private mid(args: any[]): string {
    const str = String(args[0] || '');
    const start = Number(args[1]) || 0;
    const len = args[2] ? Number(args[2]) : str.length - start;
    return str.slice(start, start + len);
  }

  // Date functions
  private year(args: any[]): number {
    const date = this.parseDate(args[0]);
    return date ? date.getFullYear() : 0;
  }

  private month(args: any[]): number {
    const date = this.parseDate(args[0]);
    return date ? date.getMonth() + 1 : 0;
  }

  private day(args: any[]): number {
    const date = this.parseDate(args[0]);
    return date ? date.getDate() : 0;
  }

  private parseDate(val: any): Date | null {
    if (val instanceof Date) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }

  // Lookup functions
  private vlookup(args: any[], sheet: Worksheet): any {
    if (args.length < 3) return '#ERROR';
    const lookupValue = args[0];
    const rangeStr = Array.isArray(args[1]) ? args[1][0] : args[1];
    const colIndex = Number(args[2]) || 1;
    const approximate = args[3] !== false;

    // Parse range
    const cells = Array.isArray(rangeStr) ? [] : generateRangeCells(String(rangeStr));
    if (cells.length === 0) return '#ERROR';

    // Get unique rows from range
    const rows = new Set(cells.map(c => c.slice(1)));
    const rowArray = Array.from(rows).map(r => parseInt(r));

    // Find matching row
    for (const row of rowArray) {
      const cellVal = sheet.cells.get(`A${row}`)?.value ?? 0;
      if (cellVal === lookupValue || (approximate && Number(cellVal) <= Number(lookupValue))) {
        const colLetter = String.fromCharCode(64 + colIndex);
        return sheet.cells.get(`${colLetter}${row}`)?.value ?? '';
      }
    }
    return '#N/A';
  }

  private hlookup(_args: any[], _sheet: Worksheet): any {
    return '#N/A'; // TODO: Implement
  }

  private index(args: any[], sheet: Worksheet): any {
    if (args.length < 2) return '#ERROR';
    const rangeStr = String(args[0]);
    const row = Number(args[1]);
    const col = args[2] ? Number(args[2]) : 1;

    const cells = generateRangeCells(rangeStr);
    if (cells.length === 0) return '#ERROR';

    const targetIdx = (row - 1) * col + (col - 1);
    if (targetIdx >= cells.length) return '#REF!';

    return sheet.cells.get(cells[targetIdx])?.value || '';
  }

  private match(args: any[]): number | string {
    if (args.length < 2) return '#ERROR';
    const lookupValue = args[0];
    const lookupArray = Array.isArray(args[1]) ? args[1] : [args[1]];
    const matchType = args[2] ?? 1;

    for (let i = 0; i < lookupArray.length; i++) {
      if (matchType === 0 && lookupArray[i] === lookupValue) {
        return i + 1;
      }
      if (matchType === 1 && Number(lookupArray[i]) >= Number(lookupValue)) {
        return i + 1;
      }
    }
    return '#N/A';
  }

  // Conditional aggregation
  private sumif(args: any[], sheet: Worksheet): number {
    if (args.length < 2) return 0;
    const rangeStr = String(args[0]);
    const criteria = args[1];
    const sumRange = args[2] ? String(args[2]) : rangeStr;

    const cells = generateRangeCells(rangeStr);
    let sum = 0;

    for (const cellId of cells) {
      const cell = sheet.cells.get(cellId);
      if (cell && this.meetsCriteria(cell.value, criteria)) {
        const sumCell = sheet.cells.get(sumRange) || cell;
        sum += Number(sumCell?.value) || 0;
      }
    }
    return sum;
  }

  private countif(args: any[], sheet: Worksheet): number {
    if (args.length < 2) return 0;
    const rangeStr = String(args[0]);
    const criteria = args[1];

    const cells = generateRangeCells(rangeStr);
    let count = 0;

    for (const cellId of cells) {
      const cell = sheet.cells.get(cellId);
      if (cell && this.meetsCriteria(cell.value, criteria)) {
        count++;
      }
    }
    return count;
  }

  private meetsCriteria(value: any, criteria: any): boolean {
    if (typeof criteria === 'string') {
      if (criteria.startsWith('>=')) return Number(value) >= Number(criteria.slice(2));
      if (criteria.startsWith('<=')) return Number(value) <= Number(criteria.slice(2));
      if (criteria.startsWith('>')) return Number(value) > Number(criteria.slice(1));
      if (criteria.startsWith('<')) return Number(value) < Number(criteria.slice(1));
      if (criteria.startsWith('<>')) return value != criteria.slice(2);
      if (criteria.startsWith('=')) return value == criteria.slice(1);
    }
    return value == criteria;
  }

  private flatten(args: any[]): any[] {
    return args.reduce((acc: any[], val) => {
      return acc.concat(Array.isArray(val) ? val : [val]);
    }, []);
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
