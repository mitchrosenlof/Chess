import React from 'react';
import { NOTATION_MAP } from './constants';
import { getColIdx, getDestSquareNotation, getRowIdx } from './board-utils';

const MoveManager = (boardState) => {
  const [moveHistory, setMoveHistory] = useState([]);

  const logMove = (pieceIdx, destIdx) => {
    const pieceKind = NOTATION_MAP[boardState[pieceIdx]];
    const destNotation = getDestSquareNotation(
      getRowIdx(destIdx),
      getColIdx(destIdx)
    );
  };
  return {};
};
