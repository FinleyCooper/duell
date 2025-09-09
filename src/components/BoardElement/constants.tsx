interface BoardCustomisation {
    lightSquares: string
    darkSquares: string
    activeSquare: string
    allowedMove: string
    lastMoveDestination: string
    lastMoveSource: string
}

export const initialColours: BoardCustomisation = {
    lightSquares: "#f0d9b5",
    darkSquares: "#b58863",
    activeSquare: "#ffffff",
    allowedMove: "#000",
    lastMoveDestination: "#ffdd47",
    lastMoveSource: "#ffeb94"
}

export const Piece = {
    EMPTY: 0b0000000,
    ONE: 0b0000001,
    TWO: 0b0000010,
    THREE: 0b0000011,
    FOUR: 0b0000100,
    FIVE: 0b0000101,
    SIX: 0b0000110,
    WHITE: 0b0100000,
    BLACK: 0b1000000,
    KEY_PIECE: 0b10000000,
}