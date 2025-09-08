import BasePiece from "./BasePiece";

class KeyPiece extends BasePiece {
    constructor(colour: number) {
        super(BasePiece.KEY_PIECE_MASK | (colour & BasePiece.COLOUR_MASK));
    }

    public override getTopFace(): number {
        return 1;
    }

    public override getFrontFace(): number {
        return 1;
    }

    public roll(_dir: number): void {
        // Key Piece is not affected by rolling
        return;
    }
}

export default KeyPiece;
