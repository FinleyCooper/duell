import Move from './Move';
import Board from './Board';


function search(_board: Board, moves: Move[]): Move {
    return moves[Math.floor(Math.random() * moves.length)];
} 

export default search;