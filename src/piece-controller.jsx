import React, { useState, useEffect } from 'react';
import { nBoardCols, nBoardRows } from './constants';
import { getRowIdx, getColIdx } from './utils';

const PieceController = () => {
  // state of the location of the pieces of the board
  // prettier-ignore
  const [boardState, setBoardState] = useState([
    4, 2, 3, 5, 6, 3, 2, 4, // 0 - empty
    1, 1, 1, 1, 1, 1, 1, 1, // 1 - Pawn
    0, 0, 4, 0, 0, 0, 0, 0, // 2 - Knight
    0, 0, 0, 0, 0, 0, 0, 0, // 3 - Bishop
    2, 0, 5, 5, 0, 6, 3, 5, // 4 - Rook
    0, 0, 0, 0, 0, 0, 0, 0, // 5 - Queen
    1, 1, 1, 1, 1, 1, 1, 1, // 6 - King
    4, 2, 3, 5, 6, 3, 2, 4,
  ]);
  // state of which player owns which pieces
  // prettier-ignore
  const [playerColorBoardState, setPlayerColorBoardState] = useState([
    2, 2, 2, 2, 2, 2, 2, 2, // 1 - white
    2, 2, 2, 2, 2, 2, 2, 2, // 2 - Black
    0, 0, 2, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    2, 0, 2, 1, 0, 1, 2, 2,
    0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
  ]);
  // states for clicking and moving pieces
  const [selectedPieceIdx, setSelectedPieceIdx] = useState(null);
  const [highlightedValidMoves, setHighlightedValidMoves] = useState([]);

  useEffect(() => {
    if (selectedPieceIdx !== null) {
      const moves = getValidMoves(selectedPieceIdx);
      console.log(moves);
      setHighlightedValidMoves(moves);
    } else {
      setHighlightedValidMoves([]);
    }
  }, [selectedPieceIdx]);

  // const onClickPiece = (idx) => {
  //   // highlight piece and legal moves
  //   setSelectedPieceIdx(idx);
  //   // determine kind of piece
  //   const pieceId = boardState[idx];
  //   // determine valid moves
  //   const validMoves = getValidMoves(boardState, idx);
  //   // set clicked piece state
  // };

  const getValidMoves = (pieceIdx) => {
    const piece = boardState[pieceIdx];
    let validMoves = [];

    switch (piece) {
      case 1: // Pawn
        validMoves = getAllValidPawnMoves(pieceIdx);
        break;
      case 2: // Knight
        validMoves = getAllValidKnightMoves(pieceIdx);
        break;
      case 3: // Bishop
        validMoves = getAllValidBishopMoves(pieceIdx);
        break;
      case 4: // Rook
        validMoves = getAllValidRookMoves(pieceIdx);
        break;
      case 5: // Queen
        validMoves = getAllValidQueenMoves(pieceIdx);
        break;
      case 6: // King
        validMoves = getAllValidKingMoves(pieceIdx);
      default:
        break;
    }

    return validMoves;
  };

  const getAllValidPawnMoves = (pieceIdx) => {
    const row = getRowIdx(pieceIdx, nBoardCols);
    const col = getColIdx(pieceIdx, nBoardCols);
    const moves = [];
    const direction = playerColorBoardState[pieceIdx] === 1 ? -1 : 1;

    // Move one square forward if empty
    const oneStepForward = pieceIdx + nBoardCols * direction;
    if (boardState[oneStepForward] === 0) {
      moves.push(oneStepForward);

      // On starting row, move two squares forward if both are empty
      const startingRow = direction === -1 ? 6 : 1;
      if (row === startingRow) {
        const twoStepsForward = pieceIdx + nBoardCols * direction * 2;
        if (boardState[twoStepsForward] === 0) {
          moves.push(twoStepsForward);
        }
      }
    }

    // Capture diagonally
    const diagonalLeft = oneStepForward - 1;
    const diagonalRight = oneStepForward + 1;
    if (
      col > 0 &&
      boardState[diagonalLeft] !== 0 &&
      isOpponent(pieceIdx, diagonalLeft)
    ) {
      moves.push(diagonalLeft);
    }
    if (
      col < nBoardCols - 1 &&
      boardState[diagonalRight] !== 0 &&
      isOpponent(pieceIdx, diagonalRight)
    ) {
      moves.push(diagonalRight);
    }

    return moves;
  };

  const getAllValidKnightMoves = (pieceIdx) => {
    const moves = [];

    const pieceRowIdx = getRowIdx(pieceIdx);

    const upLeft = pieceIdx - 2 * nBoardRows - 1;
    if (isInBounds(upLeft) && getRowIdx(upLeft) === pieceRowIdx - 2) {
      moves.push(upLeft);
    }
    const upRight = pieceIdx - 2 * nBoardRows + 1;
    if (isInBounds(upRight) && getRowIdx(upRight) === pieceRowIdx - 2) {
      moves.push(upRight);
    }
    const leftUp = pieceIdx - 2 - nBoardRows;
    if (isInBounds(leftUp) && getRowIdx(leftUp) === pieceRowIdx - 1) {
      moves.push(leftUp);
    }
    const leftDown = pieceIdx - 2 + nBoardRows;
    if (isInBounds(leftDown) && getRowIdx(leftDown) === pieceRowIdx + 1) {
      moves.push(leftDown);
    }
    const downLeft = pieceIdx + 2 * nBoardRows - 1;
    if (isInBounds(downLeft) && getRowIdx(downLeft) === pieceRowIdx + 2) {
      moves.push(downLeft);
    }
    const downRight = pieceIdx + 2 * nBoardRows + 1;
    if (isInBounds(downRight) && getRowIdx(downRight) === pieceRowIdx + 2) {
      moves.push(downRight);
    }
    const rightUp = pieceIdx + 2 - nBoardRows;
    if (isInBounds(rightUp) && getRowIdx(rightUp) === pieceRowIdx - 1) {
      moves.push(rightUp);
    }
    const rightDown = pieceIdx + 2 + nBoardRows;
    if (isInBounds(rightDown) && getRowIdx(rightDown) === pieceRowIdx + 1) {
      moves.push(rightDown);
    }
    return moves;
  };

  const getAllValidBishopMoves = (pieceIdx) => {
    const moves = [];

    const directions = [
      -1 - nBoardRows, // up left
      -1 + nBoardRows, // down left
       1 - nBoardRows, // up right
       1 + nBoardRows, // down right
    ]
    directions.forEach(direction => {
      let currentIdx = pieceIdx + direction;
      while (isInBounds(currentIdx) && boardState[currentIdx] === 0) {
        moves.push(currentIdx);
        currentIdx += direction;

        console.log(currentIdx, currentIdx % nBoardCols)
        if (currentIdx % nBoardCols === 0) {
          break;
        }
      }

      if (isOpponent(pieceIdx, currentIdx) && currentIdx % nBoardCols !== 0) {
        moves.push(currentIdx);
      }
    });
    
    return moves;
  }

  const getAllValidRookMoves = (pieceIdx) => {
    const moves = [];
    const directions = [-nBoardCols, nBoardCols, -1, 1]; // Up, Down, Left, Right
    const pieceRowIdx = getRowIdx(pieceIdx);

    directions.forEach((direction) => {
      let currentIdx = pieceIdx + direction;
      while (isInBounds(currentIdx) && boardState[currentIdx] === 0) {
        if (
          (direction === -1 || direction === 1) &&
          pieceRowIdx !== getRowIdx(currentIdx)
        ) {
          break;
        }

        moves.push(currentIdx);
        currentIdx += direction;
      }

      if (isOpponent(pieceIdx, currentIdx)) {
        moves.push(currentIdx);
      }
    });

    return moves;
  };

  const getAllValidQueenMoves = (pieceIdx) => {
    return [...getAllValidBishopMoves(pieceIdx), ...getAllValidRookMoves(pieceIdx)];
  }

  const getAllValidKingMoves = (pieceIdx) => {
    const moves = [];
    const directions = [
      -1 - nBoardRows, -nBoardRows, 1 - nBoardRows, // top row
      -1, 1,                                        // left and right
      -1 + nBoardRows, nBoardRows, 1 + nBoardRows   // bottom row
    ]
    directions.forEach(direction => {
      const targetIdx = pieceIdx + direction;
      if (boardState[targetIdx] === 0 || isOpponent(pieceIdx, targetIdx)) {
        moves.push(targetIdx);
      }
    });

    // TODO: Handle blocking illegal moves that put king in "check"

    return moves;
  }

  const isInBounds = (index) => index >= 0 && index < 64;

  const isOpponent = (pieceIdx, targetIdx) => {
    return (
      playerColorBoardState[targetIdx] !== 0 &&
      playerColorBoardState[pieceIdx] !== playerColorBoardState[targetIdx]
    );
  };

  return {
    boardState,
    playerColorBoardState,
    selectedPieceIdx,
    setSelectedPieceIdx,
    highlightedValidMoves,
  };
};

export default PieceController;
