import type { BasePiece } from "./Pieces";
import { Empty } from "./Pieces";
import { Piece } from "./constants";
import Move from "./Move";
import { StartingBoard } from "./BoardSetup";

class Board {
    private sideToMove: number;
    private square: Array<BasePiece>;
    private isBetweenMoves: boolean = false;
    private rollCount: number = 0;
    private pieceBeingMoved: number | null = null; // Position of the current piece being moved. Null if not isBetweenMoves.

    constructor() {
        this.sideToMove = Piece.WHITE;
        this.square = StartingBoard;
    }

    getSideToMove(): number {
        return this.sideToMove;
    }

    getBoard(): Array<BasePiece> {
        return this.square;
    }

    generateLegalMoves(): Move[] {
        const legalMoves: Move[] = [];
        
        return legalMoves;
    }

    getLegalRollsFrom(square: number): number[] {
        const legalRolls: number[] = [];
        const piece = this.square[square];

        if (piece.isEmpty() || piece.getColour() !== this.sideToMove || (this.isBetweenMoves && this.pieceBeingMoved !== square)) {
            return legalRolls;
        }

        const directions = [
            { row: -1, col: 0 }, 
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 }
        ];

        const fromRow = Math.floor(square / 9);
        const fromCol = square % 9;

        for (const dir of directions) {
            const toRow = fromRow + dir.row;
            const toCol = fromCol + dir.col;

            if (toRow >= 0 && toRow < 8 && toCol >= 0 && toCol < 9) {
                const targetSquare = toRow * 9 + toCol;
                const targetPiece = this.square[targetSquare];

                if (targetPiece.isEmpty()) {
                    legalRolls.push(targetSquare);
                } else if (targetPiece.getColour() !== piece.getColour()) {
                    if (piece.getTopFace() === Piece.ONE || this.rollCount === 1) {
                        legalRolls.push(targetSquare);
                    }
                }
            }
        }

        return legalRolls;
    }

    roll(from: number, to: number): void {
        const piece = this.square[from];

        if (!this.isBetweenMoves) {
            this.isBetweenMoves = true;
            this.rollCount = piece.getTopFace();
        }

        this.pieceBeingMoved = to;

        const offset = (to - from) * (piece.getColour() === Piece.WHITE ? 1 : -1);
        const direction = offset === 9 ? 2 : offset === -9 ? 0 : offset === 1 ? 3 : 1;
        piece.roll(direction);

        this.square[to] = piece;
        this.square[from] = new Empty()

        this.rollCount--;

        if (this.rollCount == 0) {
            this.isBetweenMoves = false;
            this.sideToMove = this.sideToMove === Piece.WHITE ? Piece.BLACK : Piece.WHITE;
            this.pieceBeingMoved = null;
        }
    }
}

export default Board