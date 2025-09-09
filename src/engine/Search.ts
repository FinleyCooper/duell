import Move from './Move';
import Board from './Board';
import Evaluation from './Evaluation';


function search(_board: Board, maxDepth: number): Move {
    let bestMove = new Move(-1, -1, [], false);

    function searchDepth(board: Board, depth: number, alpha: number, beta: number): number {
        if (depth == 0) {
            return simplifyPosition(board, alpha, beta);
        }

        const moves = board.generateLegalMoves();

        if (moves.length === 0) {
            return 0;
        }

        let estimatedMoveOrder = sortMoves(board, moves);

        for (let i=0; i < estimatedMoveOrder.length; i++) {
            const move = moves[estimatedMoveOrder[i]];
            board.playMove(move);

            const evaluation = -searchDepth(board, depth - 1, -beta, -alpha);

            board.unplayMove(move);

            if (evaluation >= beta) {
                if (depth === maxDepth) {
                    bestMove = move;
                }

                return beta;
            }

            if (evaluation > alpha) {
                if (depth === maxDepth) {
                    bestMove = move;
                }
                alpha = evaluation;
            }
        }
        return alpha;
    }
    
    searchDepth(_board, maxDepth, -Infinity, Infinity);
    
    if (bestMove.sourceSquare === -1) {
        throw new Error("No valid moves found");
    }

    return bestMove;
} 


function sortMoves(board: Board, moves: Move[]): number[] {
    const x = moves.map(move => estimateMoveGoodness(board, move))
    const y: number[] = Array(moves.length)

    for (let i = 0; i < y.length; i++) {
        y[i] = i
    }

    let i = 0

    while (i < moves.length) {
        let j = i
        while (j > 0 && x[j - 1] > x[j]) {
            [y[j], y[j - 1]] = [y[j - 1], y[j]];
            [x[j], x[j - 1]] = [x[j - 1], x[j]];

            j -= 1
        }
        i += 1
    }

    return y.reverse()
}

function estimateMoveGoodness(_board: Board, move: Move): number {
    let estimate = 0;

    estimate += move.isCapture ? 1000 : 0;

    return estimate;
}

function simplifyPosition(board: Board, alpha: number, beta: number): number {
    const evaluation = Evaluation(board);

    if (evaluation >= beta) {
        return beta;
    }
    
    if (evaluation > alpha) {
        return evaluation;
    }

    const captures = board.generateLegalMoves().filter(move => move.isCapture);

    const estimatedMoveOrder = sortMoves(board, captures);

    for (let i=0; i < estimatedMoveOrder.length; i++) {
        const move = captures[estimatedMoveOrder[i]];
        board.playMove(move);
        const evaluation = -simplifyPosition(board, -beta, -alpha);
        board.unplayMove(move);
        if (evaluation >= beta) {
            return beta;
        }
        if (evaluation > alpha) {
            alpha = evaluation;
        }
    }

    return alpha;
}

export default search;