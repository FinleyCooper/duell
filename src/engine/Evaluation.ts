import Board from "./Board";
import { Piece } from "./constants";

const keyPieceConstant = 9999999;

export default (board: Board) => {
    let score = 0;
    
    board.getBoard().reduce((acc, piece) => {
        if (piece.getColour() === Piece.WHITE) {
            score += 100;
        } else if (piece.getColour() === Piece.BLACK) {
            score -= 100;
        }
        return acc;
    }, 0);

    if (board.hasSideWon() === Piece.WHITE) {
        score += keyPieceConstant;
    } else if (board.hasSideWon() === Piece.BLACK) {
        score -= keyPieceConstant;
    }

    if (board.getSideToMove() === Piece.BLACK) {
        score = -score;
    }
    return score;
}