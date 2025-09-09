import React, { useState, useCallback } from 'react';
import Engine from './engine';
import BoardElement from './components/BoardElement';
import { Piece } from './engine/constants';

import './App.css';

const App: React.FC = () => {
  const [engine] = useState(() => new Engine());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [legalSquares, setLegalSquares] = useState<number[]>([]);
  const [_boardVersion, setBoardVersion] = useState(0); // State to force re-render

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  }, []);

  const handleUserMove = useCallback((from: number, to: number) => {
    if (engine.board.getSideToMove() === Piece.BLACK) return;
    const validMoves = engine.board.getLegalSquares(from);

    if (validMoves.includes(to)) {
      engine.board.roll(from, to);
      setBoardVersion(prev => prev + 1);

      if (!engine.board.isBetweenMoves()) {
        const bestMove = engine.getBestMove();
        bestMove.path.forEach((_, idx) => {
          setTimeout(() => {
            if (idx < bestMove.path.length - 1) {
              engine.board.roll(bestMove.path[idx], bestMove.path[idx + 1]);
              setBoardVersion(prev => prev + 1);
            }
          }, idx * 300);
        });
      }
    }

    setLegalSquares([]);
  }, [engine]);

  const handleDragStart = useCallback((square: number) => {
    setLegalSquares(engine.board.getLegalSquares(square));
  }, [engine]);

  const handleDragEnd = useCallback(() => {
    setLegalSquares([]);
  }, []);

  return (
    <div className="App" onMouseMove={handleMouseMove}>
      <BoardElement
        board={engine.board}
        onUserAttemptsMove={handleUserMove}
        mouseX={mousePos.x}
        mouseY={mousePos.y}
        lastMove={null}
        legalSquares={legalSquares}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
};

export default App;
