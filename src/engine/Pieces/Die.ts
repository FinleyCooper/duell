import { Directions, nextState, orientations } from "../constants";
import BasePiece from "./BasePiece";

type Direction = typeof Directions[keyof typeof Directions];

class Die extends BasePiece {
    static topFace: number[] = orientations.map(o => o[0]);
    static frontFace: number[] = orientations.map(o => o[1]);
    static nextState: Int8Array = nextState;

    static fromTopandFront(top: number, front: number, colour: number): Die {
        const idx = orientations.findIndex(([t, f]) => t === top && f === front);
        if (idx === -1) {
            throw new Error();
        }
        return new Die(idx | colour);
    }

    constructor(datum: number) {
        super(datum);
    }

    public override getTopFace(): number {
        return Die.topFace[this.datum & Die.ORIENTATION_MASK];
    }

    public override getFrontFace(): number {
        return Die.frontFace[this.datum & Die.ORIENTATION_MASK];
    }

    public override roll(dir: Direction): void {
        this.datum = (this.datum & ~Die.ORIENTATION_MASK) | Die.nextState[(this.datum & Die.ORIENTATION_MASK) << 2 | dir]
    }
}

export default Die;