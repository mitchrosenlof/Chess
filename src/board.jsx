import React, { useState } from 'react';
import { getRowIdx } from './utils';
import { getPieceIcon } from './board-utils';
import PieceController from './piece-controller';

const ChessBoard = () => {
  const {
    boardState,
    playerBoardState,
    selectedPieceIdx,
    handleClickSquare,
    highlightedValidMoves,
  } = PieceController();
  const colorSquare = (squareIdx) => {
    // Returns tailwind styles for how the square should currently look
    if (getRowIdx(squareIdx, 8) % 2 === 0) {
      if (squareIdx % 2 === 0) {
        return 'bg-teal-100';
      } else {
        return 'bg-gray-400';
      }
    } else {
      if (squareIdx % 2 !== 0) {
        return 'bg-teal-100';
      } else {
        return 'bg-gray-400';
      }
    }
  };

  return (
    <div className="grid grid-cols-8 gap-0 w-[900px] h-[900px]">
      {boardState?.map((pieceId, idx) => (
        <div
          key={idx}
          className={`relative flex justify-center items-center w-full h-full ${colorSquare(
            idx
          )}`}
          onClick={() => handleClickSquare(idx)}
        >
          {idx}
          {highlightedValidMoves?.includes(idx) && (
            <div className="absolute flex justify-center items-center rounded-full bg-gray-600 h-5 w-5"></div>
          )}
          {selectedPieceIdx === idx && <div className="absolute w-full h-full opacity-40 bg-red-400"></div>}
          <div className="h-20 w-20">
            {getPieceIcon(
              pieceId,
              playerBoardState[idx]
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
