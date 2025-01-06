import { nBoardCols } from './constants';

export function getRowIdx(idx) {
  return Math.floor(idx / nBoardCols);
}

export function getColIdx(index, cols) {
  return index % cols;
}
