import React, { useState, useRef, useMemo, useLayoutEffect, useCallback } from "react";
import type Move from "../../engine/Move";
import type Board from "../../engine/Board";
import { Piece } from "../../engine/constants";
import { initialColours } from "./constants";
import DieElement from "./Dice/DieElement";
import "./index.css";

interface Props {
    board: Board;
    onUserAttemptsMove: (from: number, to: number) => void;
    mouseX: number;
    mouseY: number;
    lastMove: Move | null;
    legalSquares: number[];
    onDragStart: (square: number) => void;
    onDragEnd: () => void;
}

function pieceTranslation(isDragging: boolean, dragX: number, dragY: number, col: number, row: number) {
    if (isDragging) {
        return `translate(${(dragX) * 100}%, ${(dragY) * 100}%)`;
    }
    return `translate(${col * 100}%, ${row * 100}%)`;
}

const BoardElement: React.FC<Props> = ({ board, onUserAttemptsMove, mouseX, mouseY, legalSquares, onDragStart, onDragEnd }) => {
    const [draggingPieceIndex, setDraggingPieceIndex] = useState<number | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);
    const [squareLength, setSquareLength] = useState<number>(100);

    // Keep square size in sync with rendered board size for responsiveness
    useLayoutEffect(() => {
        const el = boardRef.current;
        if (!el) return;

        const updateSize = () => {
            const rect = el.getBoundingClientRect();
            // Board has 9 columns; derive square size from width
            const newSquare = rect.width / 9;
            if (newSquare > 0) setSquareLength(newSquare);
        };

        updateSize();

        // Observe size changes
        const ro = new ResizeObserver(() => updateSize());
        ro.observe(el);
        // Also update on orientation changes
        window.addEventListener('orientationchange', updateSize);
        window.addEventListener('resize', updateSize);
        return () => {
            ro.disconnect();
            window.removeEventListener('orientationchange', updateSize);
            window.removeEventListener('resize', updateSize);
        };
    }, []);

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
        onDragStart(index);
    };

    const handleMouseUp = () => {
        if (draggingPieceIndex === null) return;

        const col = Math.round(draggingPieceX);
        const row = Math.round(draggingPieceY);

        const newIndex = (ROWS - 1 - row) * COLUMNS + col;

        onUserAttemptsMove(draggingPieceIndex, newIndex);
        setDraggingPieceIndex(null);
        onDragEnd();
    };

    // Touch support: rely on App updating mouseX/mouseY via onTouchMove
    const handleTouchStart = useCallback((event: React.TouchEvent, index: number) => {
        event.preventDefault();
        setDraggingPieceIndex(index);
        onDragStart(index);
    }, [onDragStart]);

    const handleTouchMove = useCallback((event: React.TouchEvent) => {
        if (draggingPieceIndex === null) return;
        // prevent page scroll while dragging; App updates coordinates
        event.preventDefault();
    }, [draggingPieceIndex]);

    const handleTouchEnd = useCallback((event?: React.TouchEvent<HTMLDivElement | HTMLDivElement>) => {
        if (event) event.preventDefault();
        if (draggingPieceIndex === null) return;
        const boardEl = boardRef.current;
        const changed = event?.changedTouches?.[0];
        if (boardEl && changed) {
            const rect = boardEl.getBoundingClientRect();
            const xOffset: number = Math.min(Math.max(changed.clientX - rect.x, 0), rect.width);
            const yOffset: number = Math.min(Math.max(changed.clientY - rect.y, 0), rect.height);
            const localX: number = xOffset / squareLength - 0.5;
            const localY: number = yOffset / squareLength - 0.5;
            const col = Math.round(localX);
            const row = Math.round(localY);
            const newIndex = (ROWS - 1 - row) * COLUMNS + col;
            onUserAttemptsMove(draggingPieceIndex, newIndex);
            setDraggingPieceIndex(null);
            onDragEnd();
            return;
        }
        // Fallback
        handleMouseUp();
    }, [draggingPieceIndex, squareLength, onUserAttemptsMove, onDragEnd, handleMouseUp]);

    const squares: React.JSX.Element[] = [];
    const pieces: React.JSX.Element[] = [];
    const masks: React.JSX.Element[] = [];

    const boardState = board.getBoard();

    const ROWS = 8;
    const COLUMNS = 9;

    for (let i = 0; i < 72; i++) {
        const row: number = Math.floor(i / 9);
        const col: number = i % 9;
        const invertedIndex = (ROWS - 1 - row) * COLUMNS + col;

        const colour: string = (row + col) % 2 === 0 ? initialColours.darkSquares : initialColours.lightSquares;

        let adjustedColour = colour;
        if (invertedIndex === 4 || invertedIndex === 67) {
            if ((row + col) % 2 === 0) {
                // Dark square, make darker
                adjustedColour = "#75553cff";
            } else {
                // Light square, make lighter
                adjustedColour = "#bdb2a5ff";
            }
        }

        const squareStyles: React.CSSProperties = {
            backgroundColor: adjustedColour,
            width: squareLength,
            height: squareLength,
            gridRowStart: row + 1,
            gridColumnStart: col + 1,
        };

        squares.push(
            <div key={invertedIndex} className="square" style={squareStyles}>
            </div>
        );

        if (legalSquares.includes(invertedIndex)) {
            const maskStyles: React.CSSProperties = {
                backgroundColor: 'rgba(80, 32, 192, 0.5)',
                width: squareLength,
                height: squareLength,
                gridRowStart: row + 1,
                gridColumnStart: col + 1,
            };

            masks.push(
                <div key={`mask-${invertedIndex}`} className="square-mask" style={maskStyles}>
                </div>
            );
        }

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
            cursor: 'pointer',
        };
        pieces.push(
                <DieElement
                    piece={piece}
                    style={pieceStyles}
                    key={invertedIndex}
                    onMouseDown={(event: React.MouseEvent) => handleMouseDown(event, invertedIndex)}
                    onMouseUp={handleMouseUp}
            onTouchStart={(event: React.TouchEvent) => handleTouchStart(event, invertedIndex)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
                />
            );
        }
    }

    return (
    <div className="board" ref={boardRef} onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd}>
            <div className="squares" draggable="false">
                {squares}
            </div>
            <div className="square-masks" draggable="false">
                {masks}
            </div>
            {pieces}
        </div>
    );
};

export default BoardElement;
