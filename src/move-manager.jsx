import React, { useState } from 'react';
import { NOTATION_MAP } from './constants';
import { getColIdx, getDestSquareNotation, getRowIdx } from './board-utils';

const useMoveManager = (boardState, playerState) => {
  const [moveHistory, setMoveHistory] = useState([]);
  const [isInCheck, setIsInCheck] = useState(false);
  const [checkAttackerIdx, setCheckAttackerIdx] = useState(null);

  const logMove = (pieceIdx, destIdx) => {
    const pieceKind = NOTATION_MAP[boardState[pieceIdx]];
    const destNotation = getDestSquareNotation(
      getRowIdx(destIdx),
      getColIdx(destIdx)
    );
  };
  return {
    isInCheck,
    setIsInCheck,
    checkAttackerIdx,
    setCheckAttackerIdx,
  };
};

export default useMoveManager;
