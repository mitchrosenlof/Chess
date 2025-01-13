export const nBoardCols = 8;
export const nBoardRows = 8;

export const PAWN = 1;
export const KNIGHT = 2;
export const BISHOP = 3;
export const ROOK = 4;
export const QUEEN = 5;
export const KING = 6;

export const NOTATION_MAP = {
  1: '',
  2: 'N',
  3: 'B',
  4: 'R',
  5: 'Q',
  6: 'K',
};

// prettier-ignore
export const initialBoard = [
  4, 2, 3, 5, 6, 3, 2, 4, // 0 - empty
  1, 1, 1, 1, 1, 1, 1, 1, // 1 - Pawn
  0, 0, 0, 0, 0, 0, 0, 0, // 2 - Knight
  0, 0, 0, 0, 0, 0, 0, 0, // 3 - Bishop
  4, 0, 0, 0, 1, 6, 0, 0, // 4 - Rook
  0, 0, 0, 0, 0, 0, 0, 0, // 5 - Queen
  1, 1, 1, 1, 1, 1, 1, 1, // 6 - King
  4, 2, 3, 5, 6, 3, 2, 4,
];
// prettier-ignore
export const initialPlayerBoard = [
  2, 2, 2, 2, 2, 2, 2, 2, // 1 - white
  2, 2, 2, 2, 2, 2, 2, 2, // 2 - Black
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1,
];
