import { useState } from 'react';
import './App.css';
import produce from "immer";

function App() {
  const numOfRows = 10;
  const numOfCol = 10;


  // creating grid function
  const createGrid = (r, c) =>{
    const rows = [];
    for(let i = 0; i < r; i++){
      const column = [];
      for(let j = 0; j < c; j++){
        //false means the cell is dead.
        column.push(false)
      }
      rows.push(column);
    }
    return rows;
  }
  //The generation's state
  const [gen, SetGen] = useState(createGrid(numOfRows, numOfCol));


  return (
    <div>
      <div className="grid"  style = {{gridTemplateColumns: `repeat(${numOfCol}, ${1250/numOfCol+'px'})`}}>
        {gen.map((rows, r) => rows.map((column, c) => <div key = {r + "_" + c} className={"cell " + gen[r][c]} style={{height: 650/ {numOfRows}, width:1250/{numOfCol}}} onClick={() => {
                  const newGen = produce(gen, genCopy => {
                    genCopy[r][c] = gen[r][c] ? false : true;
                  });
                  SetGen(newGen);
                }}/>))}
      </div>
      <div className="btn-container">
        <div className="btn">Start</div>
        <div className="btn">Random</div>
        <div className="btn" onClick={()=>SetGen(createGrid(numOfRows, numOfCol))}>Clear</div>
      </div>
    </div>
  );
}

export default App;
