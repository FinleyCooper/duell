import { Die, Key, Empty } from "./Pieces";
import { Piece } from "./constants";
import type { BasePiece } from "./Pieces";

export const StartingBoard: Array<BasePiece> = [
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