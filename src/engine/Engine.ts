import Board from "./Board";
import Search from "./Search";
import Move from "./Move";

class Engine {
    public board: Board;

    constructor() {
        this.board = new Board();
    }

    getBestMove() : Move {
        return Search(this.board, this.board.generateLegalMoves());
    }
}

export default Engine;