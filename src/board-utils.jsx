import { nBoardCols } from './constants';

export function getRowIdx(idx) {
  return Math.floor(idx / nBoardCols);
}

export function getColIdx(index, cols) {
  return index % cols;
}

export function getPieceIcon(pieceId, playerColor) {
  switch (pieceId) {
    case 1:
      return <img src={`/pieces/${playerColor === 1 ? 'w' : 'b'}P.svg`} />;
    case 2:
      return <img src={`/pieces/${playerColor === 1 ? 'w' : 'b'}N.svg`} />;
    case 3:
      return <img src={`/pieces/${playerColor === 1 ? 'w' : 'b'}B.svg`} />;
    case 4:
      return <img src={`/pieces/${playerColor === 1 ? 'w' : 'b'}R.svg`} />;
    case 5:
      return <img src={`/pieces/${playerColor === 1 ? 'w' : 'b'}Q.svg`} />;
    case 6:
      return <img src={`/pieces/${playerColor === 1 ? 'w' : 'b'}K.svg`} />;
    default:
      return <></>;
  }
}

export function getDestSquareNotation(rowIdx, colIdx) {
  const colNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return colNames[colIdx] + `${rowIdx + 1}`;
}
