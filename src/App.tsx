import React, { useState, useCallback } from 'react';
import Engine from './engine';
import BoardElement from './components/BoardElement';
import { Piece } from './engine/constants';

import './App.css';

const App: React.FC = () => {
  const [engine, setEngine] = useState(() => new Engine());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [legalSquares, setLegalSquares] = useState<number[]>([]);
  const [_boardVersion, setBoardVersion] = useState(0); // State to force re-render
  const [winner, setWinner] = useState<number | null>(null);
  const [showRules, setShowRules] = useState(false);

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  // Touch tracking mirrors mouse so BoardElement math continues to work
  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    setMousePos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    setMousePos({ x: touch.clientX, y: touch.clientY });
  };

  // Check for game end
  const checkForGameEnd = () => {
    let winner = engine.board.hasSideWon();
      if (winner === Piece.WHITE) {
        setWinner(Piece.WHITE);
      } else if (winner === Piece.BLACK) {
        setWinner(Piece.BLACK);
      }
  };

  const resetGame = () => {
    setEngine(new Engine());
    setWinner(null);
    setLegalSquares([]);
    setBoardVersion(0);
  }

  const handleUserMove = useCallback((from: number, to: number) => {
    if (winner) return;
    if (engine.board.getSideToMove() === Piece.BLACK) return;
    const validMoves = engine.board.getLegalSquares(from);

    if (validMoves.includes(to)) {
      engine.board.roll(from, to);
      checkForGameEnd();
      setBoardVersion(prev => prev + 1);

      if (!engine.board.isBetweenMoves()) {
        const bestMove = engine.getBestMove();
        bestMove.path.forEach((_, idx) => {
          setTimeout(() => {
            if (winner) return;
            if (idx < bestMove.path.length - 1) {
              engine.board.roll(bestMove.path[idx], bestMove.path[idx + 1]);
              setBoardVersion(prev => prev + 1);
            }
          }, idx * 300);
        });

        setTimeout(() => {
          if (winner) return;
          checkForGameEnd();
        }
        , bestMove.path.length * 300);
      }
    }

    setLegalSquares([]);
  }, [engine, winner]);

  const handleDragStart = useCallback((square: number) => {
    if (winner) return;
    setLegalSquares(engine.board.getLegalSquares(square));
  }, [engine, winner]);

  const handleDragEnd = useCallback(() => {
    setLegalSquares([]);
  }, []);

  return (
  <div className="App" onMouseMove={handleMouseMove} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
      <div className="header">
        <div className="title">Duell <span>by Finley Cooper</span></div>
        <button className="rules-button" onClick={() => setShowRules(true)}>Rules</button>
      </div>
      {winner && (
        <div className="popup">
          <div className="popup-content">
            <h2>{winner === Piece.WHITE ? "White" : "Black"} has won!</h2>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
      {showRules && (
        <div className="popup">
          <div className="popup-content">
            <h2>Rules</h2>
            <h3>The Object</h3>
            <p>Is either to take your opponent's Key dice or land your Key dice on your opponent's Key dice square (which is marked on the board).</p>
            <h3>Playing the Game</h3>
            <p>Dice are moved the number of squares indicated by the number of spots on the uppermost face by 'tumbling' them from space to space and must never be lifted from the board, except when being captured.<br /> The Key Dice and be tumbled only one square at a time in any direction. Ordinary dice can be tumbled in any direction and may change directions, to either left or right but only once in any one move.<br /> No dice can touch the same square twice in one move, nor can it 'jump' over other dice. No dice (and that includes the Key dice) can tumble diagonally. To capture an opponent's playing piece you must move a dice which, at the end of its move, will land on the space occupied by the playing piece to be captured. The captured piece is removed from the board. The Key dice may capture an opponent's playing piece in the same way.<br /> Once you've starting tumbling a dice, you must finish the move with that dice.</p>
            <button onClick={() => setShowRules(false)}>Close</button>
          </div>
        </div>
      )}
      <BoardElement
        key={_boardVersion}
        board={engine.board}
        onUserAttemptsMove={handleUserMove}
        mouseX={mousePos.x}
        mouseY={mousePos.y}
        lastMove={null}
        legalSquares={legalSquares}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
        <footer className="footer">
                <a href="https://github.com/finleycooper/duell" target="_blank" className="footer-link">GitHub</a>
                <a href="https://finleycooper.co.uk" target="_blank" className="footer-link">Main Site</a>
        </footer>
    </div>
    
  );
};

export default App;
