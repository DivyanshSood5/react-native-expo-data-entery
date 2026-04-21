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
