import { Cell } from '../../types';

export interface ConditionalFormatRule {
  id: string;
  type: 'greaterThan' | 'lessThan' | 'between' | 'equals' | 'containsText' | 'topN' | 'dataBar' | 'colorScale';
  condition?: string;
  value1?: number | string;
  value2?: number | string;
  format: {
    backgroundColor?: string;
    textColor?: string;
    bold?: boolean;
  };
}

export class ConditionalFormattingEngine {
  private rules: Map<string, ConditionalFormatRule[]> = new Map();

  addRule(range: string, rule: ConditionalFormatRule): void {
    if (!this.rules.has(range)) {
      this.rules.set(range, []);
    }
    this.rules.get(range)!.push(rule);
  }

  removeRule(range: string, ruleId: string): void {
    const rules = this.rules.get(range);
    if (rules) {
      this.rules.set(range, rules.filter((r) => r.id !== ruleId));
    }
  }

  getRulesForCell(cellId: string): ConditionalFormatRule[] {
    const matchingRules: ConditionalFormatRule[] = [];
    for (const [range, rules] of this.rules.entries()) {
      if (this.isCellInRange(cellId, range)) {
        matchingRules.push(...rules);
      }
    }
    return matchingRules;
  }

  applyConditionalFormatting(
    cell: Cell,
    cellId: string
  ): { backgroundColor?: string; textColor?: string; bold?: boolean } {
    const rules = this.getRulesForCell(cellId);
    const value = this.getCellValue(cell);

    for (const rule of rules) {
      if (this.evaluateRule(rule, value)) {
        return rule.format;
      }
    }
    return {};
  }

  private getCellValue(cell: Cell): number | string {
    if (cell.value !== null && cell.value !== undefined) {
      const num = Number(cell.value);
      return isNaN(num) ? String(cell.value) : num;
    }
    return '';
  }

  private evaluateRule(rule: ConditionalFormatRule, value: number | string): boolean {
    switch (rule.type) {
      case 'greaterThan':
        return typeof value === 'number' && value > Number(rule.value1 || 0);
      case 'lessThan':
        return typeof value === 'number' && value < Number(rule.value1 || 0);
      case 'between':
        return (
          typeof value === 'number' &&
          value >= Number(rule.value1 || 0) &&
          value <= Number(rule.value2 || 0)
        );
      case 'equals':
        return value === rule.value1;
      case 'containsText':
        return typeof value === 'string' && value.includes(String(rule.value1 || ''));
      case 'topN':
        return false; // TODO: Implement
      case 'dataBar':
        return false; // TODO: Implement
      case 'colorScale':
        return false; // TODO: Implement
      default:
        return false;
    }
  }

  private isCellInRange(cellId: string, range: string): boolean {
    if (!range.includes(':')) {
      return cellId === range;
    }

    const [start, end] = range.split(':');
    const cellMatch = cellId.match(/^([A-Z]+)(\d+)$/i);
    const startMatch = start.match(/^([A-Z]+)(\d+)$/i);
    const endMatch = end.match(/^([A-Z]+)(\d+)$/i);

    if (!cellMatch || !startMatch || !endMatch) return false;

    const cellCol = this.letterToCol(cellMatch[1].toUpperCase());
    const cellRow = parseInt(cellMatch[2], 10);
    const startCol = this.letterToCol(startMatch[1].toUpperCase());
    const startRow = parseInt(startMatch[2], 10);
    const endCol = this.letterToCol(endMatch[1].toUpperCase());
    const endRow = parseInt(endMatch[2], 10);

    return (
      cellCol >= startCol &&
      cellCol <= endCol &&
      cellRow >= startRow &&
      cellRow <= endRow
    );
  }

  private letterToCol(letter: string): number {
    let col = 0;
    for (let i = 0; i < letter.length; i++) {
      col = col * 26 + (letter.charCodeAt(i) - 64);
    }
    return col;
  }

  clearAllRules(): void {
    this.rules.clear();
  }
}

export const conditionalFormattingEngine = new ConditionalFormattingEngine();
