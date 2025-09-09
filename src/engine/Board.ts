import type { BasePiece } from "./Pieces";
import { Empty } from "./Pieces";
import { Piece } from "./constants";
import Move from "./Move";
import { StartingBoard } from "./BoardSetup";

class Board {
    private sideToMove: number;
    private square: Array<BasePiece>;

    // Variables for handling the rolling which makes up an individual move
    private betweenMoves: boolean = false;
    private legalMovesList : Move[] = [];
    private rollsCompleted: number = 0;

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

    isBetweenMoves(): boolean {
        return this.betweenMoves;
    }   

    generateLegalMovesFrom(square: number): Move[] {
        const legalMoves: Move[] = [];
        const piece = this.square[square];

        if (piece.isEmpty() || piece.getColour() !== this.sideToMove) {
            return legalMoves;
        }

        const rolls = piece.getTopFace();

        const directions = [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 }
        ];

        const findPaths = (currentSquare: number, rollsRemaining: number, path: number[], lastDirection: { row: number, col: number } | null, hasTurned: boolean) => {
            if (rollsRemaining === 0) {
                const isCapture = !this.square[currentSquare].isEmpty() && this.square[currentSquare].getColour() !== this.sideToMove;
                legalMoves.push(new Move(square, currentSquare, path, isCapture));
                return;
            }

            for (const dir of directions) {
                if (hasTurned && lastDirection && dir !== lastDirection) {
                    continue;
                }

                const currentRow = Math.floor(currentSquare / 9);
                const currentCol = currentSquare % 9;
                const nextRow = currentRow + dir.row;
                const nextCol = currentCol + dir.col;

                if (nextRow >= 0 && nextRow < 8 && nextCol >= 0 && nextCol < 9) {
                    const nextSquare = nextRow * 9 + nextCol;
                    const nextPiece = this.square[nextSquare];
                    const isFinalRoll = rollsRemaining === 1;

                    const canMoveTo = (nextPiece.isEmpty() || (isFinalRoll && nextPiece.getColour() !== this.sideToMove)) && !path.includes(nextSquare);

                    if (canMoveTo) {
                        const newPath = [...path, nextSquare];
                        const turned = hasTurned || (lastDirection !== null && lastDirection !== dir);
                        findPaths(nextSquare, rollsRemaining - 1, newPath, dir, turned);
                    }
                }
            }
        };

        findPaths(square, rolls, [square], null, false);

        return legalMoves;
    }

    generateLegalMoves(): Move[] {
        return this.square.flatMap((_, index) => this.generateLegalMovesFrom(index));
    }

    getLegalSquares(square: number): number[] {
        if (!this.betweenMoves) {
            return this.generateLegalMovesFrom(square).map(move => move.path[1]);
        }
        if (square == this.legalMovesList[0].path[this.rollsCompleted]) {
            return this.legalMovesList.map(move => move.path[this.rollsCompleted + 1]);
        }

        return []
    }

    roll(from: number, to: number): void {
        const piece = this.square[from];

        if (!this.betweenMoves) {
            this.legalMovesList = this.generateLegalMovesFrom(from);
            this.betweenMoves = true;
        }

        const offset = (to - from) * (piece.getColour() === Piece.WHITE ? 1 : -1);
        const direction = offset === 9 ? 2 : offset === -9 ? 0 : offset === 1 ? 3 : 1;
        piece.roll(direction);

        this.square[to] = piece;
        this.square[from] = new Empty()
        
        this.legalMovesList = this.legalMovesList.filter(move => move.path[this.rollsCompleted + 1] === to);

        this.rollsCompleted++;

        if (this.rollsCompleted === this.legalMovesList[0].path.length - 1) {
            this.betweenMoves = false;
            this.sideToMove = this.sideToMove === Piece.WHITE ? Piece.BLACK : Piece.WHITE;
            this.rollsCompleted = 0;
        }
    }

}

export default Board