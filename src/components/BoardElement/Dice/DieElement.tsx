import React from "react";
import { Piece } from "../../../engine/constants";
import BasePiece from "../../../engine/Pieces/BasePiece";

interface DieProps {
    piece: BasePiece;
    style?: React.CSSProperties;
    onMouseDown?: (event: React.MouseEvent) => void;
    onMouseMove?: (event: React.MouseEvent) => void;
    onMouseUp?: () => void;
}

const pipPositions: { [key: number]: number[][] } = {
    1: [[0, 0]],
    2: [[-150, -150], [150, 150]],
    3: [[-150, -150], [0, 0], [150, 150]],
    4: [[-150, -150], [150, -150], [-150, 150], [150, 150]],
    5: [[-150, -150], [150, -150], [0, 0], [-150, 150], [150, 150]],
    6: [[-150, -150], [-150, 0], [-150, 150], [150, -150], [150, 0], [150, 150]],
};

const DieElement: React.FC<DieProps> = ({ piece, style, onMouseDown, onMouseMove, onMouseUp }) => {
    const colour: string = piece.getColour() === Piece.WHITE ? "white" : "black";
    const topFace = piece.getTopFace();
    const pips = pipPositions[topFace] || [];
    const isKey = piece.isKeyPiece();

    return (
        <div style={style} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
            <svg viewBox="-300 -300 600 600">
                <rect x="-250" y="-250" width="500" height="500" rx="50" style={{ fill: colour, stroke: colour === "white" ? "black" : "white", strokeWidth: 8 }}/>
                {pips.map(([cx, cy], i) => {
                    const isCenterPip = cx === 0 && cy === 0;
                    const pipColour = isKey && isCenterPip ? "orange" : (colour === "white" ? "black" : "white");
                    return <circle key={i} cx={cx} cy={cy} r={40} style={{ fill: pipColour }} />
                })}
            </svg>
        </div>
    );
};

export default DieElement;
