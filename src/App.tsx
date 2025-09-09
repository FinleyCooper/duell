import React, { useState, useCallback } from 'react';
import Board from './engine/Board';
import BoardElement from './components/BoardElement';

import './App.css';

const App: React.FC = () => {
  const [board] = useState(() => new Board());
  const [boardVersion, setBoardVersion] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [legalSquares, setLegalSquares] = useState<number[]>([]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  }, []);

  const handleUserMove = useCallback((from: number, to: number) => {
    const validMoves = board.getLegalSquares(from);

    if (validMoves.includes(to)) {
      board.roll(from, to);
      setBoardVersion(v => v + 1);
    }
    setLegalSquares([]);
  }, [board]);

  const handleDragStart = useCallback((square: number) => {
    setLegalSquares(board.getLegalSquares(square));
  }, [board]);

  const handleDragEnd = useCallback(() => {
    setLegalSquares([]);
  }, []);

  return (
    <div className="App" onMouseMove={handleMouseMove}>
      <BoardElement
        board={board}
        onUserAttemptsMove={handleUserMove}
        mouseX={mousePos.x}
        mouseY={mousePos.y}
        lastMove={null}
        legalSquares={legalSquares}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        key={boardVersion}
      />
    </div>
  );
};

export default App;
