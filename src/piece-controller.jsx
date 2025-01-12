import React, { useState, useEffect } from 'react';
import {
  PAWN,
  KNIGHT,
  BISHOP,
  ROOK,
  QUEEN,
  KING,
  nBoardCols,
  nBoardRows,
} from './constants';
import { getRowIdx, getColIdx } from './utils';

const PieceController = () => {
  // State of the location of the pieces of the board.
  // prettier-ignore
  const [boardState, setBoardState] = useState([
    4, 2, 3, 5, 6, 3, 2, 4, // 0 - empty
    1, 1, 1, 1, 1, 1, 1, 1, // 1 - Pawn
    0, 0, 0, 0, 0, 0, 0, 0, // 2 - Knight
    0, 0, 0, 0, 0, 0, 0, 0, // 3 - Bishop
    4, 0, 0, 0, 1, 6, 0, 0, // 4 - Rook
    0, 0, 0, 0, 0, 0, 0, 0, // 5 - Queen
    1, 1, 1, 1, 1, 1, 1, 1, // 6 - King
    4, 2, 3, 5, 6, 3, 2, 4,
  ]);
  // state of which player owns which pieces
  // prettier-ignore
  const [playerBoardState, setPlayerBoardState] = useState([
    2, 2, 2, 2, 2, 2, 2, 2, // 1 - white
    2, 2, 2, 2, 2, 2, 2, 2, // 2 - Black
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    2, 0, 0, 0, 1, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
  ]);

  const [playerTurn, setPlayerTurn] = useState(1);
  // states for clicking and moving pieces
  const [selectedPieceIdx, setSelectedPieceIdx] = useState(null);
  const [highlightedValidMoves, setHighlightedValidMoves] = useState([]);

  useEffect(() => {
    if (selectedPieceIdx !== null) {
      const moves = getValidMoves(selectedPieceIdx);
      setHighlightedValidMoves(moves);
    }
  }, [selectedPieceIdx]);

  const isKingInCheck = (player, board, playerState) => {
    const kingIdx = board.findIndex(
      (piece, idx) => piece === KING && playerState[idx] === player
    );

    if (kingIdx === -1) {
      throw new Error('King not found for the specified player.');
    }

    const diagonalKingAttackCheckIdxs = getAllValidBishopMoves(
      kingIdx,
      board,
      playerState
    );
    const vertAndHorizKingAttackCheckIdxs = getAllValidRookMoves(
      kingIdx,
      board,
      playerState
    );

    for (let i = 0; i < diagonalKingAttackCheckIdxs.length; i++) {
      const piece = board[diagonalKingAttackCheckIdxs[i]];
      if ((piece === BISHOP || piece === QUEEN) && playerState[i] !== player) {
        return true;
      }
    }
    for (let i = 0; i < vertAndHorizKingAttackCheckIdxs.length; i++) {
      const piece = board[vertAndHorizKingAttackCheckIdxs[i]];
      if ((piece === ROOK || piece === QUEEN) && playerState[i] !== player) {
        return true;
      }
    }
    return false;
  };

  const filterPinnedPieceMoves = (pieceIdx, moves, player) => {
    const filteredMoves = moves.filter((move) => {
      const newBoardState = [...boardState];
      const newPlayerBoardState = [...playerBoardState];

      newBoardState[move] = boardState[pieceIdx];
      newPlayerBoardState[move] = playerBoardState[pieceIdx];
      newBoardState[pieceIdx] = 0;
      newPlayerBoardState[pieceIdx] = 0;

      return !isKingInCheck(player, newBoardState, newPlayerBoardState);
    });

    return filteredMoves;
  };

  const getValidMoves = (pieceIdx) => {
    const piece = boardState[pieceIdx];
    let moves = [];

    switch (piece) {
      case PAWN:
        moves = getAllValidPawnMoves(pieceIdx, boardState, playerBoardState);
        break;
      case KNIGHT:
        moves = getAllValidKnightMoves(pieceIdx, boardState, playerBoardState);
        break;
      case BISHOP:
        moves = getAllValidBishopMoves(pieceIdx, boardState, playerBoardState);
        break;
      case ROOK:
        moves = getAllValidRookMoves(pieceIdx, boardState, playerBoardState);
        break;
      case QUEEN:
        moves = getAllValidQueenMoves(pieceIdx, boardState, playerBoardState);
        break;
      case KING:
        moves = getAllValidKingMoves(pieceIdx, boardState, playerBoardState);
        break;
      default:
        console.error(
          `Unrecognized piece '${piece}' when getting valid moves.`
        );
        break;
    }

    console.log(moves);

    return filterPinnedPieceMoves(pieceIdx, moves, playerTurn);
  };

  const getAllValidPawnMoves = (pieceIdx, board, playerBoard) => {
    const row = getRowIdx(pieceIdx, nBoardCols);
    const col = getColIdx(pieceIdx, nBoardCols);
    const moves = [];
    const direction = playerBoardState[pieceIdx] === 1 ? -1 : 1;

    // Move one square forward if empty
    const oneStepForward = pieceIdx + nBoardCols * direction;
    if (board[oneStepForward] === 0) {
      moves.push(oneStepForward);

      // On starting row, move two squares forward if both are empty
      const startingRow = direction === -1 ? 6 : 1;
      if (row === startingRow) {
        const twoStepsForward = pieceIdx + nBoardCols * direction * 2;
        if (board[twoStepsForward] === 0) {
          moves.push(twoStepsForward);
        }
      }
    }

    // Capture diagonally
    const diagonalLeft = oneStepForward - 1;
    const diagonalRight = oneStepForward + 1;
    if (
      col > 0 &&
      board[diagonalLeft] !== 0 &&
      isOpponent(pieceIdx, diagonalLeft, playerBoard)
    ) {
      moves.push(diagonalLeft);
    }
    if (
      col < nBoardCols - 1 &&
      board[diagonalRight] !== 0 &&
      isOpponent(pieceIdx, diagonalRight, playerBoard)
    ) {
      moves.push(diagonalRight);
    }

    return moves;
  };

  const getAllValidKnightMoves = (pieceIdx, board, playerBoard) => {
    const moves = [];

    const pieceRowIdx = getRowIdx(pieceIdx);

    const upLeft = pieceIdx - 2 * nBoardRows - 1;
    if (
      isInBounds(upLeft) &&
      getRowIdx(upLeft) === pieceRowIdx - 2 &&
      (isOpponent(upLeft, playerBoard) || board[upLeft] === 0)
    ) {
      moves.push(upLeft);
    }
    const upRight = pieceIdx - 2 * nBoardRows + 1;
    if (
      isInBounds(upRight) &&
      getRowIdx(upRight) === pieceRowIdx - 2 &&
      (isOpponent(upRight, playerBoard) || board[upRight] === 0)
    ) {
      moves.push(upRight);
    }
    const leftUp = pieceIdx - 2 - nBoardRows;
    if (
      isInBounds(leftUp) &&
      getRowIdx(leftUp) === pieceRowIdx - 1 &&
      (isOpponent(leftUp, playerBoard) || board[leftUp] === 0)
    ) {
      moves.push(leftUp);
    }
    const leftDown = pieceIdx - 2 + nBoardRows;
    if (
      isInBounds(leftDown) &&
      getRowIdx(leftDown) === pieceRowIdx + 1 &&
      (isOpponent(leftDown, playerBoard) || board[leftDown] === 0)
    ) {
      moves.push(leftDown);
    }
    const downLeft = pieceIdx + 2 * nBoardRows - 1;
    if (
      isInBounds(downLeft) &&
      getRowIdx(downLeft) === pieceRowIdx + 2 &&
      (isOpponent(downLeft, playerBoard) || board[downLeft] === 0)
    ) {
      moves.push(downLeft);
    }
    const downRight = pieceIdx + 2 * nBoardRows + 1;
    if (
      isInBounds(downRight) &&
      getRowIdx(downRight) === pieceRowIdx + 2 &&
      (isOpponent(downRight, playerBoard) || board[downRight] === 0)
    ) {
      moves.push(downRight);
    }
    const rightUp = pieceIdx + 2 - nBoardRows;
    if (
      isInBounds(rightUp) &&
      getRowIdx(rightUp) === pieceRowIdx - 1 &&
      (isOpponent(rightUp, playerBoard) || board[rightUp] === 0)
    ) {
      moves.push(rightUp);
    }
    const rightDown = pieceIdx + 2 + nBoardRows;
    if (
      isInBounds(rightDown) &&
      getRowIdx(rightDown) === pieceRowIdx + 1 &&
      (isOpponent(rightDown, playerBoard) || board[rightDown] === 0)
    ) {
      moves.push(rightDown);
    }
    return moves;
  };

  const getAllValidBishopMoves = (pieceIdx, board, playerBoard) => {
    const moves = [];

    const directions = [
      -1 - nBoardRows, // up left
      -1 + nBoardRows, // down left
      1 - nBoardRows, // up right
      1 + nBoardRows, // down right
    ];
    directions.forEach((direction) => {
      let currentIdx = pieceIdx + direction;
      while (board[currentIdx] === 0) {
        moves.push(currentIdx);
        currentIdx += direction;

        if (currentIdx % nBoardCols === 0) {
          break;
        }
      }

      if (
        isInBounds(currentIdx) &&
        isOpponent(pieceIdx, currentIdx, playerBoard) &&
        currentIdx % nBoardCols !== 0
      ) {
        moves.push(currentIdx);
      }
    });

    return moves;
  };

  const getAllValidRookMoves = (pieceIdx, board, playerBoard) => {
    const moves = [];
    const directions = [-nBoardCols, nBoardCols, -1, 1]; // Up, Down, Left, Right
    const pieceRowIdx = getRowIdx(pieceIdx);

    directions.forEach((direction) => {
      let currentIdx = pieceIdx + direction;
      while (isInBounds(currentIdx) && board[currentIdx] === 0) {
        if (
          (direction === -1 || direction === 1) &&
          pieceRowIdx !== getRowIdx(currentIdx)
        ) {
          break;
        }

        moves.push(currentIdx);
        currentIdx += direction;
      }

      if (
        isInBounds(currentIdx) &&
        isOpponent(pieceIdx, currentIdx, playerBoard) &&
        currentIdx % nBoardCols !== 0
      ) {
        moves.push(currentIdx);
      }
    });

    return moves;
  };

  const getAllValidQueenMoves = (pieceIdx, board, playerBoard) => {
    return getAllValidBishopMoves(pieceIdx, board, playerBoard).concat(
      getAllValidRookMoves(pieceIdx, board, playerBoard)
    );
  };

  const getAllValidKingMoves = (pieceIdx, board, playerBoard) => {
    const moves = [];
    const directions = [
      -1 - nBoardRows, // top row
      -nBoardRows,
      1 - nBoardRows,
      -1, // left and right
      1,
      -1 + nBoardRows, // bottom row
      nBoardRows,
      1 + nBoardRows,
    ];

    directions.forEach((direction) => {
      const targetIdx = pieceIdx + direction;
      if (
        isInBounds(targetIdx) &&
        (board[targetIdx] === 0 || isOpponent(pieceIdx, targetIdx, playerBoard))
      ) {
        moves.push(targetIdx);
      }
    });

    // TODO: Handle blocking illegal moves that put king in "check"

    return moves;
  };

  const isInBounds = (index) => index >= 0 && index < 64;

  const isOpponent = (pieceIdx, targetIdx, playerBoard) => {
    return (
      playerBoard[targetIdx] !== 0 &&
      playerBoard[pieceIdx] !== playerBoard[targetIdx]
    );
  };

  const handleUpdateBoardState = (prevBoardState, moveToIdx) => {
    const piece = prevBoardState[selectedPieceIdx];
    const newBoard = [...prevBoardState];

    // valid move logic lives in piece selection function
    newBoard[moveToIdx] = piece;
    newBoard[selectedPieceIdx] = 0;

    return newBoard;
  };

  const handleClickSquare = (clickedBoardIdx) => {
    if (playerTurn === playerBoardState[clickedBoardIdx]) {
      setSelectedPieceIdx(clickedBoardIdx);
    } else if (highlightedValidMoves?.includes(clickedBoardIdx)) {
      // move the piece
      setBoardState((prev) => handleUpdateBoardState(prev, clickedBoardIdx));

      // update player color array
      setPlayerBoardState((prev) =>
        handleUpdateBoardState(prev, clickedBoardIdx)
      );

      // update visuals and change turns
      setSelectedPieceIdx(null);
      setPlayerTurn((prev) => (prev === 1 ? 2 : 1));
      setHighlightedValidMoves(null);
    }
  };

  return {
    boardState,
    playerBoardState,
    selectedPieceIdx,
    highlightedValidMoves,
    handleClickSquare,
  };
};

export default PieceController;
