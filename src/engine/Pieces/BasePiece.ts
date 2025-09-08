import { Piece } from "../constants";
import { Directions } from "../constants";

type Direction = typeof Directions[keyof typeof Directions];

class BasePiece {
    public datum: number;

    static ORIENTATION_MASK: number = 0b111111;
    static COLOUR_MASK: number = 0b11000000;
    static KEY_PIECE_MASK: number = 0b100000000;
    
    constructor(datum: number) {
        if (this.constructor === BasePiece) {
            throw new Error();
        }

        this.datum = datum;
    }

    public getColour(): number {
        return (this.datum & BasePiece.COLOUR_MASK);
    }

    public isEmpty(): boolean {
        return this.datum === Piece.EMPTY;
    }

    public isKeyPiece(): boolean {
        return (this.datum & BasePiece.KEY_PIECE_MASK) !== 0;
    }

    public getTopFace(): number {
        return 0;
    }

    public getFrontFace(): number {
        return 0;
    }

    public roll(_dir: Direction): void {
    }
}

export default BasePiece;