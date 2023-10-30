import { useCallback, useState, useMemo } from "react";
import "./App.css"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from "@mui/material/styles";
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  margin: "5px",
  padding: theme.spacing(2),
  textAlign: "center",
  borderRadius: "5px",
  width: "20px",
  height: "20px",
  color: theme.palette.text.secondary,
}));

function TestGrid(){
  var testgrid = [[0, 1, 2, 3, 4],
                  [0, 1, 2, 3, 4],
                  [0, 1, 2, 3, 4],
                  [0, 1, 2, 3, 4],
                  [0, 1, 2, 3, 4]];
  return (
    <>
      <Box style = {{margin: "0 auto"}}>
        {Array.from(testgrid).map((_, x) => (
          <Grid container>
            {Array.from(testgrid[x].map((_,y) => (
              <Item>
                {x}, {y}
              </Item>
              ))
            )}
          </Grid>
        ))}
      </Box>
    </>
  )
}


function Square({value, onSquareClick}){
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
    );
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] != "□" && squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay }){

  function handleClick(i){
    if (squares[i] != "□" || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner){
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X": "O");
  }
  
  return (
  <>
    <div className="status">{status}</div>
    <div className="board-row">
      <Square value = {squares[0]} onSquareClick = {() => handleClick(0)}/>
      <Square value = {squares[1]} onSquareClick = {() => handleClick(1)}/>
      <Square value = {squares[2]} onSquareClick = {() => handleClick(2)}/>
    </div>
    <div className="board-row">
      <Square value = {squares[3]} onSquareClick = {() => handleClick(3)}/>
      <Square value = {squares[4]} onSquareClick = {() => handleClick(4)}/>
      <Square value = {squares[5]} onSquareClick = {() => handleClick(5)}/>
    </div>
    <div className="board-row">
      <Square value = {squares[6]} onSquareClick = {() => handleClick(6)}/>
      <Square value = {squares[7]} onSquareClick = {() => handleClick(7)}/>
      <Square value = {squares[8]} onSquareClick = {() => handleClick(8)}/>
    </div>
   </>
  );
}

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill("□")]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = useMemo(()=>currentMove % 2 === 0,[currentMove]);
  const currentSquares = useMemo(()=>history[currentMove],[history, currentMove]);

  const handlePlay = useCallback((nextSquares)=> {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);

  },[history, currentMove, setHistory,setCurrentMove]);

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start'
    }
    return (
      <li key = {move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <body>
      <h1 style={{marginLeft : "30px"}}>Tic-Tac-Toe</h1>
        <div className = "game">
          <div className = "gameBox" style={{border: "2px solid powderblue", padding: "30px", margin: "30px", display: "table"}}>
            <div className="game-board">
              <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="game-info">
              <ol>{moves}</ol>
            </div>
          </div>
        </div>
        <TestGrid className= "grid"/>
    </body>
  )
}