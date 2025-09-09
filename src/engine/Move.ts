class Move {
    public readonly sourceSquare: number;
    public readonly destinationSquare: number;
    public readonly path: number[];
    public readonly isCapture: boolean;

    constructor(sourceSquare: number, destinationSquare: number, path: number[], isCapture: boolean) {
        this.sourceSquare = sourceSquare;
        this.destinationSquare = destinationSquare;
        this.path = path;
        this.isCapture = isCapture;
    }
}

export default Move