import type { BasePiece } from "./Pieces";
import { Empty, Die, Key } from "./Pieces";
import { Piece } from "./constants";
import Move from "./Move";

class Board {
    private sideToMove: number;
    private square: BasePiece[];
    private piecesCapturedPreviously: BasePiece[] = []; // For unplaying engine search moves in a stack

    // Variables for handling the rolling which makes up an individual move
    private betweenMoves: boolean = false;
    private legalMovesList : Move[] = [];
    private rollsCompleted: number = 0;

    constructor() {
        this.sideToMove = Piece.WHITE;
        this.square = [
            Die.fromTopandFront(Piece.FIVE, Piece.FOUR, Piece.WHITE),
            Die.fromTopandFront(Piece.ONE, Piece.FOUR, Piece.WHITE),
            Die.fromTopandFront(Piece.TWO, Piece.FOUR, Piece.WHITE),
            Die.fromTopandFront(Piece.SIX, Piece.FOUR, Piece.WHITE),
            new Key(Piece.WHITE),
            Die.fromTopandFront(Piece.SIX, Piece.FOUR, Piece.WHITE),
            Die.fromTopandFront(Piece.TWO, Piece.FOUR, Piece.WHITE),
            Die.fromTopandFront(Piece.ONE, Piece.FOUR, Piece.WHITE),
            Die.fromTopandFront(Piece.FIVE, Piece.FOUR, Piece.WHITE),
            ...Array(54).fill(new Empty()),
            Die.fromTopandFront(Piece.FIVE, Piece.FOUR, Piece.BLACK),
            Die.fromTopandFront(Piece.ONE, Piece.FOUR, Piece.BLACK),
            Die.fromTopandFront(Piece.TWO, Piece.FOUR, Piece.BLACK),
            Die.fromTopandFront(Piece.SIX, Piece.FOUR, Piece.BLACK),
            new Key(Piece.BLACK),
            Die.fromTopandFront(Piece.SIX, Piece.FOUR, Piece.BLACK),
            Die.fromTopandFront(Piece.TWO, Piece.FOUR, Piece.BLACK),
            Die.fromTopandFront(Piece.ONE, Piece.FOUR, Piece.BLACK),
            Die.fromTopandFront(Piece.FIVE, Piece.FOUR, Piece.BLACK),
        ]
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

    hasSideWon(): number {
        // Winning by capturing the opponent's key piece or moving your key piece to the opponent's starting square
        const whiteKeyCaptured = !this.square.some(piece => piece.getColour() === Piece.WHITE && piece.isKeyPiece());
        const blackKeyCaptured = !this.square.some(piece => piece.getColour() === Piece.BLACK && piece.isKeyPiece());
        const whiteKeyInBlackStart = this.square[67].getColour() === Piece.WHITE && this.square[67].isKeyPiece();
        const blackKeyInWhiteStart = this.square[4].getColour() === Piece.BLACK && this.square[4].isKeyPiece();
        if (whiteKeyCaptured || whiteKeyInBlackStart) return Piece.BLACK;
        if (blackKeyCaptured || blackKeyInWhiteStart) return Piece.WHITE;
        return 0;
    }

    playMove(move: Move): void {
        const piece = this.square[move.sourceSquare];

        for (let i = 0; i < move.path.length - 1; i++) {
            const offset = (move.path[i + 1] -  move.path[i]) * (piece.getColour() === Piece.WHITE ? 1 : -1);
            const direction = offset === 9 ? 2 : offset === -9 ? 0 : offset === 1 ? 3 : 1;
            piece.roll(direction);
        }


        this.piecesCapturedPreviously.push(this.square[move.destinationSquare]);
        this.square[move.destinationSquare] = piece;

        this.square[move.sourceSquare] = new Empty();
        this.sideToMove = this.sideToMove === Piece.WHITE ? Piece.BLACK : Piece.WHITE;
    }

    unplayMove(move: Move): void {
        const piece = this.square[move.destinationSquare];
        for (let i = move.path.length - 1; i > 0; i--) {
            const offset = (move.path[i - 1] -  move.path[i]) * (piece.getColour() === Piece.WHITE ? 1 : -1);
            const direction = offset === 9 ? 2 : offset === -9 ? 0 : offset === 1 ? 3 : 1;
            piece.roll(direction);
        }

        this.square[move.sourceSquare] = piece;
        this.square[move.destinationSquare] = this.piecesCapturedPreviously.pop() || new Empty();

        this.sideToMove = this.sideToMove === Piece.WHITE ? Piece.BLACK : Piece.WHITE;
    }
}

export default Board