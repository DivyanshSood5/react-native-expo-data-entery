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
  const match = cellId.match(/^([A-Za-z]+)(\d+)$/);
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
