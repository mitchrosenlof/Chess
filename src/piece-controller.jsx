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
  initialBoard,
  initialPlayerBoard,
} from './constants';
import { getRowIdx, getColIdx } from './board-utils';
import useMoveManager from './move-manager';

const usePieceController = () => {
  // State of the location of the pieces of the board.
  const [boardState, setBoardState] = useState(initialBoard);
  // state of which player owns which pieces
  const [playerBoardState, setPlayerBoardState] = useState(initialPlayerBoard);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [selectedPieceIdx, setSelectedPieceIdx] = useState(null);
  const [highlightedValidMoves, setHighlightedValidMoves] = useState([]);
  const [playerCanCastle, setPlayerCanCastle] = useState({
    1: true,
    2: true,
  });
  const [promoteIdx, setPromoteIdx] = useState(null);

  const {
    isInCheck,
    setIsInCheck,
    isCheckmate,
    setIsCheckmate,
    checkAttackerIdx,
    setCheckAttackerIdx,
  } = useMoveManager();

  useEffect(() => {
    if (selectedPieceIdx !== null) {
      const moves = getValidMoves(
        selectedPieceIdx,
        boardState,
        playerBoardState
      );
      setHighlightedValidMoves(moves);
    }
  }, [selectedPieceIdx]);

  const findKingIdx = (player, board, playerState) => {
    const kingIdx = board.findIndex(
      (piece, idx) => piece === KING && playerState[idx] === player
    );

    if (kingIdx === -1) {
      throw new Error('King not found for the specified player.');
    }

    return kingIdx;
  };

  const getPieceAttackers = (pieceIdx, player, board, playerState) => {
    const attackers = [];

    // Pawn attackers
    const direction = player === 1 ? -1 : 1;
    const leftDiag = pieceIdx - 1 + nBoardCols * direction;
    const rightDiag = pieceIdx + 1 + nBoardCols * direction;
    if (board[leftDiag] === PAWN && playerState[leftDiag] !== player) {
      attackers.push(leftDiag);
    }
    if (board[rightDiag] === PAWN && playerState[rightDiag] !== player) {
      attackers.push(rightDiag);
    }

    const diagonalKingAttackCheckIdxs = getAllValidBishopMoves(
      pieceIdx,
      board,
      playerState
    );
    const vertAndHorizKingAttackCheckIdxs = getAllValidRookMoves(
      pieceIdx,
      board,
      playerState
    );
    const knightAttackCheckIdxs = getAllValidKnightMoves(
      pieceIdx,
      board,
      playerState
    );

    for (let i = 0; i < diagonalKingAttackCheckIdxs.length; i++) {
      const attackerIdx = diagonalKingAttackCheckIdxs[i];
      const piece = board[attackerIdx];
      if (
        (piece === BISHOP || piece === QUEEN) &&
        playerState[attackerIdx] !== player
      ) {
        attackers.push(attackerIdx);
      }
    }
    for (let i = 0; i < vertAndHorizKingAttackCheckIdxs.length; i++) {
      const attackerIdx = vertAndHorizKingAttackCheckIdxs[i];
      const piece = board[attackerIdx];
      if (
        (piece === ROOK || piece === QUEEN) &&
        playerState[attackerIdx] !== player
      ) {
        attackers.push(attackerIdx);
      }
    }
    for (let i = 0; i < knightAttackCheckIdxs.length; i++) {
      const attackerIdx = knightAttackCheckIdxs[i];
      const piece = board[attackerIdx];
      if (piece === KNIGHT && playerState[attackerIdx] !== player) {
        attackers.push(attackerIdx);
      }
    }

    return attackers;
  };

  const filterIllegalMoves = (pieceIdx, moves, player) => {
    const filteredMoves = moves.filter((move) => {
      const newBoardState = [...boardState];
      const newPlayerBoardState = [...playerBoardState];

      newBoardState[move] = boardState[pieceIdx];
      newPlayerBoardState[move] = playerBoardState[pieceIdx];
      newBoardState[pieceIdx] = 0;
      newPlayerBoardState[pieceIdx] = 0;

      const kingIdx = findKingIdx(player, newBoardState, newPlayerBoardState);
      return (
        !getPieceAttackers(kingIdx, player, newBoardState, newPlayerBoardState)
          .length > 0
      );
    });

    return filteredMoves;
  };

  const getValidMoves = (pieceIdx, board, playerState) => {
    const piece = board[pieceIdx];
    let moves = [];

    switch (piece) {
      case PAWN:
        moves = getAllValidPawnMoves(pieceIdx, board, playerState);
        break;
      case KNIGHT:
        moves = getAllValidKnightMoves(pieceIdx, board, playerState);
        break;
      case BISHOP:
        moves = getAllValidBishopMoves(pieceIdx, board, playerState);
        break;
      case ROOK:
        moves = getAllValidRookMoves(pieceIdx, board, playerState);
        break;
      case QUEEN:
        moves = getAllValidQueenMoves(pieceIdx, board, playerState);
        break;
      case KING:
        moves = getAllValidKingMoves(pieceIdx, board, playerState);
        break;
      default:
        console.error(
          `Unrecognized piece '${piece}' when getting valid moves.`
        );
        break;
    }

    // console.log(moves);

    return filterIllegalMoves(pieceIdx, moves, playerTurn);
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
      (isOpponent(pieceIdx, upLeft, playerBoard) || board[upLeft] === 0)
    ) {
      moves.push(upLeft);
    }
    const upRight = pieceIdx - 2 * nBoardRows + 1;
    if (
      isInBounds(upRight) &&
      getRowIdx(upRight) === pieceRowIdx - 2 &&
      (isOpponent(pieceIdx, upRight, playerBoard) || board[upRight] === 0)
    ) {
      moves.push(upRight);
    }
    const leftUp = pieceIdx - 2 - nBoardRows;
    if (
      isInBounds(leftUp) &&
      getRowIdx(leftUp) === pieceRowIdx - 1 &&
      (isOpponent(pieceIdx, leftUp, playerBoard) || board[leftUp] === 0)
    ) {
      moves.push(leftUp);
    }
    const leftDown = pieceIdx - 2 + nBoardRows;
    if (
      isInBounds(leftDown) &&
      getRowIdx(leftDown) === pieceRowIdx + 1 &&
      (isOpponent(pieceIdx, leftDown, playerBoard) || board[leftDown] === 0)
    ) {
      moves.push(leftDown);
    }
    const downLeft = pieceIdx + 2 * nBoardRows - 1;
    if (
      isInBounds(downLeft) &&
      getRowIdx(downLeft) === pieceRowIdx + 2 &&
      (isOpponent(pieceIdx, downLeft, playerBoard) || board[downLeft] === 0)
    ) {
      moves.push(downLeft);
    }
    const downRight = pieceIdx + 2 * nBoardRows + 1;
    if (
      isInBounds(downRight) &&
      getRowIdx(downRight) === pieceRowIdx + 2 &&
      (isOpponent(pieceIdx, downRight, playerBoard) || board[downRight] === 0)
    ) {
      moves.push(downRight);
    }
    const rightUp = pieceIdx + 2 - nBoardRows;
    if (
      isInBounds(rightUp) &&
      getRowIdx(rightUp) === pieceRowIdx - 1 &&
      (isOpponent(pieceIdx, rightUp, playerBoard) || board[rightUp] === 0)
    ) {
      moves.push(rightUp);
    }
    const rightDown = pieceIdx + 2 + nBoardRows;
    if (
      isInBounds(rightDown) &&
      getRowIdx(rightDown) === pieceRowIdx + 1 &&
      (isOpponent(pieceIdx, rightDown, playerBoard) || board[rightDown] === 0)
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

    // castle
    if (playerCanCastle[playerTurn]) {
      // left
      let canLeftCastle = true;
      for (let offset = 1; offset < 4; offset++) {
        const currentIdx = pieceIdx - offset;
        if (board[currentIdx] === 0) {
          const newBoard = [...board];
          const newPlayerBoard = [...playerBoard];

          newBoard[currentIdx] = board[pieceIdx];
          newBoard[pieceIdx] = 0;
          newPlayerBoard[currentIdx] = playerBoard[pieceIdx];
          newPlayerBoard[pieceIdx] = 0;

          const kingIdx = findKingIdx(playerTurn, board, playerState);
          if (
            getPieceAttackers(kingIdx, playerTurn, newBoard, newPlayerBoard)
              .length > 0
          ) {
            canLeftCastle = false;
          }
        } else {
          canLeftCastle = false;
        }
      }
      // right
      let canRightCastle = true;
      for (let offset = 1; offset < 3; offset++) {
        const currentIdx = pieceIdx + offset;
        if (board[currentIdx] === 0) {
          const newBoard = [...board];
          const newPlayerBoard = [...playerBoard];

          newBoard[currentIdx] = board[pieceIdx];
          newBoard[pieceIdx] = 0;
          newPlayerBoard[currentIdx] = playerBoard[pieceIdx];
          newPlayerBoard[pieceIdx] = 0;

          const kingIdx = findKingIdx(playerTurn, board, playerState);
          if (
            getPieceAttackers(kingIdx, playerTurn, newBoard, newPlayerBoard)
              .length > 0
          ) {
            canRightCastle = false;
          }
        } else {
          canRightCastle = false;
        }
      }

      if (canLeftCastle) moves.push(pieceIdx - 2);
      if (canRightCastle) moves.push(pieceIdx + 2);
    }

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

    /* Valid move logic lives in piece selection function */
    newBoard[moveToIdx] = piece;
    newBoard[selectedPieceIdx] = 0;

    return newBoard;
  };

  const handleClickSquare = (clickedBoardIdx) => {
    const piece = boardState[clickedBoardIdx];
    if (playerTurn === playerBoardState[clickedBoardIdx]) {
      if (isInCheck && piece !== KING) {
        // need to kill check attacker else king must be moved
        const moves = getValidMoves(
          clickedBoardIdx,
          boardState,
          playerBoardState
        );
        const kingIdx = findKingIdx(playerTurn, boardState, playerBoardState);
        const checkers = getPieceAttackers(
          kingIdx,
          playerTurn,
          boardState,
          playerBoardState
        );
        console.log(checkers);
        console.log(moves);
        if (checkers.length === 1 && moves.includes(checkers[0])) {
          setSelectedPieceIdx(clickedBoardIdx);
        }
        return;
      }
      setSelectedPieceIdx(clickedBoardIdx);
    } else if (highlightedValidMoves?.includes(clickedBoardIdx)) {
      // pawn promotion?
      const rowIdx = getRowIdx(clickedBoardIdx);
      if (
        boardState[selectedPieceIdx] === PAWN &&
        (rowIdx === 0 || rowIdx === 7)
      ) {
        setPromoteIdx(clickedBoardIdx);
        return;
      }

      // move the piece
      setBoardState((prevBoard) => {
        const newBoard = handleUpdateBoardState(prevBoard, clickedBoardIdx);

        // update player color array
        const newPlayerState = handleUpdateBoardState(
          playerBoardState,
          clickedBoardIdx
        );

        // did put opponent in "check"?
        const kingIdx = findKingIdx(
          playerTurn === 1 ? 2 : 1,
          newBoard,
          newPlayerState
        );
        const checkers = getPieceAttackers(
          kingIdx,
          playerTurn === 1 ? 2 : 1,
          newBoard,
          newPlayerState
        );
        setIsInCheck(checkers.length > 0);

        if (checkers.length > 0) {
          // is checkmate?
          const kingMoves = getValidMoves(kingIdx, newBoard, newPlayerState);
          console.log(kingMoves, checkers);
          if (checkers.length > 1) {
            setIsCheckmate(kingMoves.length < 1);
          } else {
            setIsCheckmate(
              !getPieceAttackers(
                checkers[0],
                playerTurn,
                newBoard,
                newPlayerState
              ).length > 0
            );
          }
        }

        // check if move is a castle
        if (boardState[selectedPieceIdx] === KING) {
          if (clickedBoardIdx + 2 === selectedPieceIdx) {
            // castle left, move corner rook
            newBoard[selectedPieceIdx - 1] = prevBoard[selectedPieceIdx - 4];
            newBoard[selectedPieceIdx - 4] = 0;
            newPlayerState[selectedPieceIdx - 1] =
              playerBoardState[selectedPieceIdx - 4];
            newPlayerState[selectedPieceIdx - 4] = 0;
          } else if (clickedBoardIdx - 2 === selectedPieceIdx) {
            // castle right, move corner rook
            newBoard[selectedPieceIdx + 1] = prevBoard[selectedPieceIdx + 3];
            newBoard[selectedPieceIdx + 3] = 0;
            newPlayerState[selectedPieceIdx + 1] =
              playerBoardState[selectedPieceIdx + 3];
            newPlayerState[selectedPieceIdx + 3] = 0;
          }

          setPlayerCanCastle((prev) => ({ ...prev, [playerTurn]: false }));
        }

        setPlayerBoardState(newPlayerState);
        return newBoard;
      });

      completeTurn();
    }
  };

  const completeTurn = () => {
    setPlayerTurn((prev) => (prev === 1 ? 2 : 1));
    setSelectedPieceIdx(null);
    setHighlightedValidMoves(null);
    setCheckAttackerIdx(null);
    setIsInCheck(false);
  };

  const onSelectPromotion = (piece) => {
    setBoardState((prevBoard) => {
      const newBoard = [...prevBoard];
      const newPlayerState = [...playerBoardState];

      newBoard[promoteIdx] = piece;
      newBoard[selectedPieceIdx] = 0;
      newPlayerState[promoteIdx] = playerTurn;
      newPlayerState[selectedPieceIdx] = 0;

      const kingIdx = findKingIdx(player, board, playerState);
      setIsInCheck(
        getPieceAttackers(
          kingIdx,
          playerTurn === 1 ? 2 : 1,
          newBoard,
          newPlayerState
        ).length > 0
      );

      setPlayerBoardState(newPlayerState);

      completeTurn();

      setPromoteIdx(null);

      return newBoard;
    });
  };

  const resetBoard = () => {
    setBoardState(initialBoard);
    setPlayerBoardState(initialPlayerBoard);
    setIsCheckmate(false);
    setIsInCheck(false);
    setPlayerTurn(1);
  };

  return {
    boardState,
    setBoardState,
    playerBoardState,
    setPlayerBoardState,
    selectedPieceIdx,
    highlightedValidMoves,
    handleClickSquare,
    isPromoting: promoteIdx !== null,
    onSelectPromotion,
    playerTurn,
    isCheckmate,
    setIsCheckmate,
    resetBoard,
  };
};

export default usePieceController;
