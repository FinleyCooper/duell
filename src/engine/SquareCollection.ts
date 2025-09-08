export default class SquareCollection {
    private bitboard: bigint;
    private iteratingBoard: bigint;
    static readonly BOARD_SIZE = 72; // 9x8 board
    static readonly BITMASK = (1n << 72n) - 1n;

    constructor(bitboard: bigint = 0n) {
        this.bitboard = bitboard & SquareCollection.BITMASK;
        this.iteratingBoard = this.bitboard;
    }

    getBitboard() {
        return this.bitboard;
    }

    add(square: number) {
        if (square >= 0 && square < SquareCollection.BOARD_SIZE) {
            this.bitboard |= 1n << BigInt(square);
            this.bitboard &= SquareCollection.BITMASK;
        }
    }

    remove(square: number) {
        if (square >= 0 && square < SquareCollection.BOARD_SIZE) {
            this.bitboard &= ~(1n << BigInt(square));
            this.bitboard &= SquareCollection.BITMASK;
        }
    }

    or(collection: SquareCollection) {
        return new SquareCollection((this.bitboard | collection.bitboard) & SquareCollection.BITMASK);
    }

    and(collection: SquareCollection) {
        return new SquareCollection((this.bitboard & collection.bitboard) & SquareCollection.BITMASK);
    }

    not() {
        return new SquareCollection((~this.bitboard) & SquareCollection.BITMASK);
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < SquareCollection.BOARD_SIZE; i++) {
            if (i === 0) {
                this.iteratingBoard = this.bitboard;
            }
            if (this.iteratingBoard & 1n) {
                yield i;
            }
            this.iteratingBoard >>= 1n;
        }
        this.iteratingBoard = this.bitboard;
    }
}