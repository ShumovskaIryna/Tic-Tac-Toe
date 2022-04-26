import React, { useReducer } from "react";
import Board from './Board'
import Panda from "./Panda";
import Cat from "./Cat";

const reducer = (state, action) => {
    switch (action.type) {
        case 'JUMP':
              return {
                ...state,
                  xIsNext: action.payload.step % 2 === 0,
                  history: state.history.slice(0, action.payload.step +1),
            };
        case 'MOVE':
            return {
                ...state,
                history: state.history.concat({
                 squares: action.payload.squares,
                }),
                xIsNext: !state.xIsNext,
            };
        default:
            return state;
    }
};
export default function Game() {
    const [state, dispatch] = useReducer(reducer, {
        xIsNext: true,
        history: [{ squares: Array(9).fill(null) }]
    });
    const { xIsNext, history } = state;
    const jumpTo = (step) => {
        dispatch({ type: 'JUMP', payload: {step}})
    }
    const handleClick = (i) => {
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const winner = calculateWinner(squares);
     if (winner || squares[i]) {
       return;
     }
        squares[i] = xIsNext ? ' 🐼 ' : ' 🐱 ';
        dispatch({ type: 'MOVE', payload: { squares } });
    }
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);
    
    const status = winner
        ? winner === 'D'
            ? '🐼 ❤️ 🐱'
            : 'Winner is' + winner
        : 'NEXT STEP BY PLAYER ' + (xIsNext ? 'PANDA': 'CAT');
    
    const moves = history.map((step, move) => {
        const desc = move ? 'Return to step # ' + move : '⏪ Start the Game';
        return (
            <li className = "nextmove" key={move} >
                <button onClick={() => jumpTo(move)}>
                <b className="newMove">{desc}</b>
                </button>
            </li>
        );
    });
    const squares = Array(9).fill(null);
    return (
    

        <div className={winner ? "game disabled" : "game"}>
        <div className={xIsNext ? "panda disabled" : "panda"}>
            <Panda>
            </Panda></div>
        <div className={!xIsNext ? "cat disabled" : "cat"}>
                    <Cat>
                     </Cat></div>
        <div className="game-board">
            <Board onClick={(i) => handleClick(i)}
                    squares={current.squares}>
            </Board>
        </div>
        <div className="game-info">
            <div>{status}</div>
            <ul>{moves}</ul>
        </div>
    </div>
    
    );
}
const calculateWinner = (squares) => {
  const winnerLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
    let isDraw = true;
   for (let i = 0; i < winnerLines.length; i++) {
    const [a, b, c] = winnerLines[i];
     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
           return squares[a];
      //  присвоить [a, b, c] клас, а клас будет с цветом.
     }
        if (!squares[a] || !squares[b] || !squares[c]) {
          isDraw = false;
    }
   }
    if (isDraw) return 'D';
    return null;
}
