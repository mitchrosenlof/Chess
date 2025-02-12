import React from 'react';

const GameOverMenu = ({ winner, resetBoard }) => {
  return (
    <div className="rounded border-black border bg-teal-500 p-10">
      <h1>{winner === 1 ? 'White' : 'Black'} wins!</h1>
      <button className="p-1 bg-gray-300 rounded" onClick={resetBoard}>
        New Game
      </button>
    </div>
  );
};

export default GameOverMenu;
