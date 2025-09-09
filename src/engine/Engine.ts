import Board from "./Board";
import Search from "./Search";
import Move from "./Move";

class Engine {
    public board: Board;

    constructor() {
        this.board = new Board();
    }

    getBestMove() : Move {
        return Search(this.board, 4);
    }
}

export default Engine;