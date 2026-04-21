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
