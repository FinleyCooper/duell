class Move {
    readonly datum: number;

    // Des, src, and flag, on 72 square board

    private static DEST_SQUARE_MASK: number = 0x7F;
    private static SOURCE_SQUARE_MASK: number = 0x3F80;
    private static CAPTURE_MASK: number = 0x4000;

    constructor(datum: number) {
        this.datum = datum;
    }

    static create(destinationSquare: number, sourceSquare: number, isCapture: boolean): Move {
        return new Move(
            (destinationSquare & Move.DEST_SQUARE_MASK) |
            ((sourceSquare << 7) & Move.SOURCE_SQUARE_MASK) |
            ((isCapture ? 1 : 0) << 14) & Move.CAPTURE_MASK
        );
    }

    getDestinationSquare(): number {
        return this.datum & Move.DEST_SQUARE_MASK;
    }

    getSourceSquare(): number {
        return (this.datum & Move.SOURCE_SQUARE_MASK) >> 7;
    }

    isCapture(): boolean {
        return !!(this.datum & Move.CAPTURE_MASK);
    }
    
}

export default Move