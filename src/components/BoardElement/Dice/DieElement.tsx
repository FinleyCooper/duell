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

const keyPips: number[][] = [[0, 0], [0, -100], [0, 100], [-100, 0], [100, 0]];

const DieElement: React.FC<DieProps> = ({ piece, style, onMouseDown, onMouseMove, onMouseUp }) => {
    const colour: string = piece.getColour() === Piece.WHITE ? "white" : "#28252c";
    const topFace = piece.getTopFace();
    const isKey = piece.isKeyPiece();
    const pips = isKey ? keyPips : (pipPositions[topFace] || []);

    return (
        <div style={style} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
            <svg viewBox="-300 -300 600 600">
                <rect x="-250" y="-250" width="500" height="500" rx="50" style={{ fill: colour, stroke: colour === "white" ? "#28252c" : "white", strokeWidth: 8 }}/>
                {pips.map(([cx, cy], i) => {
                    const isCenterPip = cx === 0 && cy === 0;
                    const pipColour = colour === "white" ? "#28252c" : "white";
                    const pipRadius = isKey ? (isCenterPip ? 50 : 20) : 40;
                    return <circle key={i} cx={cx} cy={cy} r={pipRadius} style={{ fill: pipColour }} />
                })}
            </svg>
        </div>
    );
};

export default DieElement;
