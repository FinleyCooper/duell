import React from 'react';
import Board from './engine/Board';
import BoardElement from './components/BoardElement';

import './App.css';

interface State {
  board: Board;
  mouseX: number;
  mouseY: number;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      board: new Board(),
      mouseX: 0,
      mouseY: 0,
    };
  }

  handleMouseMove = (event: React.MouseEvent) => {
    this.setState({ mouseX: event.clientX, mouseY: event.clientY });
  };

  handleUserMove = (from: number, to: number) => {
    const validMoves = this.state.board.getLegalRollsFrom(from);

    if (validMoves.includes(to)) {
      this.state.board.roll(from, to);
      this.setState({ board: this.state.board });
    }

  };

  render() {
    return (
      <div className="App" onMouseMove={this.handleMouseMove}>
        <BoardElement
          board={this.state.board}
          onUserAttemptsMove={this.handleUserMove}
          mouseX={this.state.mouseX}
          mouseY={this.state.mouseY}
          lastMove={null}
        />
      </div>
    );
  }
}

export default App;
