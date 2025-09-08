import React, { useState, useRef, useMemo } from "react";
import type Move from "../../engine/Move";
import type Board from "../../engine/Board";
import { Piece } from "../../engine/constants";
import { squareLength, initialColours } from "./constants";
import DieElement from "./Dice/DieElement";
import "./index.css";

interface Props {
    board: Board;
    onUserAttemptsMove: (from: number, to: number) => void;
    mouseX: number;
    mouseY: number;
    lastMove: Move | null;
}

function pieceTranslation(isDragging: boolean, dragX: number, dragY: number, col: number, row: number) {
    if (isDragging) {
        return `translate(${(dragX) * 100}%, ${(dragY) * 100}%)`;
    }
    return `translate(${col * 100}%, ${row * 100}%)`;
}

const BoardElement: React.FC<Props> = ({ board, onUserAttemptsMove, mouseX, mouseY }) => {
    const [draggingPieceIndex, setDraggingPieceIndex] = useState<number | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    const getDraggingPieceOffsets = (mouseX: number, mouseY: number, draggingPieceIndex: number | null) => {
        if (draggingPieceIndex !== null && boardRef.current) {
            const boardRect: DOMRect = boardRef.current.getBoundingClientRect();
            const xOffset: number = Math.min(Math.max(mouseX - boardRect.x, 0), boardRect.width);
            const yOffset: number = Math.min(Math.max(mouseY - boardRect.y, 0), boardRect.height);
            const draggingPieceX: number = xOffset / squareLength - 0.5;
            const draggingPieceY: number = yOffset / squareLength - 0.5;
            return { draggingPieceX, draggingPieceY };
        }
        return { draggingPieceX: 0, draggingPieceY: 0 };
    };

    const { draggingPieceX, draggingPieceY } = useMemo(() => 
        getDraggingPieceOffsets(mouseX, mouseY, draggingPieceIndex),
        [mouseX, mouseY, draggingPieceIndex]
    );

    const handleMouseDown = (_: React.MouseEvent, index: number) => {
        setDraggingPieceIndex(index);
    };

    const handleMouseUp = () => {
        if (draggingPieceIndex === null) return;

        const col = Math.round(draggingPieceX);
        const row = Math.round(draggingPieceY);

        const newIndex = (ROWS - 1 - row) * COLUMNS + col;

        onUserAttemptsMove(draggingPieceIndex, newIndex);
        setDraggingPieceIndex(null);
    };

    const squares: React.JSX.Element[] = [];
    const pieces: React.JSX.Element[] = [];

    const boardState = board.getBoard();

    const ROWS = 8;
    const COLUMNS = 9;

    for (let i = 0; i < 72; i++) {
        const row: number = Math.floor(i / 9);
        const col: number = i % 9;
        const invertedIndex = (ROWS - 1 - row) * COLUMNS + col;

        const colour: string = (row + col) % 2 === 0 ? initialColours.darkSquares : initialColours.lightSquares;

        const squareStyles: React.CSSProperties = {
            backgroundColor: colour,
            width: squareLength,
            height: squareLength,
            gridRowStart: row + 1,
            gridColumnStart: col + 1,
        };

        squares.push(
            <div key={invertedIndex} className="square" style={squareStyles}>
            </div>
        );

        const piece = boardState[invertedIndex];
        if (piece.datum !== Piece.EMPTY) {
            const pieceStyles: React.CSSProperties = {
                zIndex: invertedIndex === draggingPieceIndex ? 10 : 5,
                transform: pieceTranslation(invertedIndex === draggingPieceIndex, draggingPieceX, draggingPieceY, col, row),
                width: squareLength,
                height: squareLength,
                position: "absolute",
                top: 0,
                left: 0,
            };

            pieces.push(
                <DieElement
                    piece={piece}
                    style={pieceStyles}
                    key={invertedIndex}
                    onMouseDown={(event: React.MouseEvent) => handleMouseDown(event, invertedIndex)}
                    onMouseUp={handleMouseUp}
                />
            );
        }
    }

    return (
        <div className="board" ref={boardRef} style={{ width: 9 * squareLength, height: 8 * squareLength }}>
            <div className="squares" draggable="false">
                {squares}
            </div>
            {pieces}
        </div>
    );
};

export default BoardElement;
