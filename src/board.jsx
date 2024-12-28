import React, { useState } from 'react';

const ChessBoard = () => {
    const [boardState, setBoardState] = useState([
        [
            4, 2, 3, 5, 6, 3, 2, 4, // 0 - empty
            1, 1, 1, 1, 1, 1, 1, 1, // 1 - Pawn
            0, 0, 0, 0, 0, 0, 0, 0, // 2 - Knight
            0, 0, 0, 0, 0, 0, 0, 0, // 3 - Bishop
            0, 0, 0, 0, 0, 0, 0, 0, // 4 - Rook
            0, 0, 0, 0, 0, 0, 0, 0, // 5 - Queen
            1, 1, 1, 1, 1, 1, 1, 1, // 6 - King
            4, 2, 3, 5, 6, 3, 2, 4,
        ]
    ]);


    return <div className="grid grid-cols-8">
        {boardState.map((pieceId, idx) => 
          <div key={idx} className={`h-20 w-20 ${idx%2 === 0 ? 'bg-red-100' : 'bg-black'}`}>{pieceId}</div>
        )}
    </div>
}

export default ChessBoard;