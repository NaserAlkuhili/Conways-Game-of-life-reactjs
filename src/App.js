import { useCallback, useRef, useState, useEffect } from 'react';
import './App.css';
import produce from "immer";
import { RiGoogleFill, RiTwitterFill, RiGithubFill, RiLinkedinBoxFill } from "react-icons/ri";


function App() {
  const numOfRows = useRef(25);
  const numOfCols = useRef(25);


  // creating grid function
  const createGrid = () =>{
    const rows = [];
    for(let i = 0; i < numOfRows.current; i++){
      const column = [];
      for(let j = 0; j < numOfCols.current; j++){
        //false means the cell is dead.
        column.push(false)
      }
      rows.push(column);
    }
    return rows;
  }

  // creating random generation
  const createRandomGrid = () =>{
    const rows = [];
    for(let i = 0; i < numOfRows.current; i++){
      const column = [];
      for(let j = 0; j < numOfCols.current; j++){
        //false means the cell is dead.
        column.push(Math.random() < 0.35 ? true : false)
      }
      rows.push(column);
    }
    return rows;
  }


  //The generation's state
  const [gen, setGen] = useState(createGrid());
  const [running, setRunning] = useState(false);


  const runningRef = useRef(running);
  runningRef.current = running;
  const speedRef = useRef(300);
  
  const nextGen = useCallback(()=>{
    if (!runningRef.current) {
      return;
    }


    setGen(gen => {
      return produce(gen, copyOfGen => {
        const cellStatus = {false: 0, true:1}
        for (let r = 0; r < numOfRows.current; r++) {
          for (let c = 0; c < numOfCols.current; c++) {
            var possibleNeighbors = [
              [r+1, c+1],
              [r, c+1],
              [r+1, c-1],
              [r-1, c+1],
              [r+1, c],
              [r-1, c],
              [r-1, c-1],
              [r, c-1]
            ]
            let liveNeighbors = 0;
            possibleNeighbors.forEach(([r,c])=>{
              if (r >= 0 && c >= 0 && r < numOfRows.current  && c < numOfCols.current) {
                liveNeighbors += cellStatus[gen[r][c]];
              }
            });

            if (liveNeighbors < 2 || liveNeighbors > 3) {
              copyOfGen[r][c] = false;
            } else if (gen[r][c] === false && liveNeighbors === 3) {
              copyOfGen[r][c] = true;
            }
          }
        }    
      })
    })
    setTimeout(nextGen, speedRef.current);
  }, [])

  //getting the width of the screen.
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerWidth);


  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);
  // console.log(width)
  



  return (
    <div className= "main_background">
      <h1 className="title">Conway's Game Of Life</h1>
      {/* Socials */}
      <div className = "socials">
        <a href="mailto:k4gam3r@gmail.com"> {/* Email */}
          <RiGoogleFill className="icon" size = {width < 1000 ? 15 : 45}/>
        </a>
        <a href="https://twitter.com/NasserAlkuhili"> {/* Twitter */}
          <RiTwitterFill className="icon" size = {width < 1000 ? 15 : 45}/>
        </a>
        <a  href="https://github.com/NaserAlkuhili"> {/* Github */}
          <RiGithubFill className="icon" size = {width < 1000 ? 15 : 45}/>
        </a>
        <a  href="https://www.linkedin.com/in/naser-alkuhili-b10461181/"> {/* Linkedin */}
          <RiLinkedinBoxFill className="icon" size = {width < 1000 ? 15 : 45}/>
        </a>
      </div>


      <div style = {{display:'flex', flexDirection:'row', justifyContent:"center", }}>
        <div className= "settings_container">
          {/* Changing the speed of next generations */}
          <h1 className = "settings">Speed:</h1>
            <select defaultValue="300" name="speed" id="speed" onChange={(val)=>{
              speedRef.current = (parseInt(val.target.value))
                
              }}>
              <option value="450">0.5</option>
              <option value="300">Normal</option>
              <option value="200">1.5</option>
              <option value="100">2</option>
          </select>
      </div>
      {/* changing the number of rows and columns*/}
      {!running && <>
          <div className= "settings_container">
            <h1 className = "settings">Rows: </h1>
            <input type="number" defaultValue={numOfRows.current} name="row" min="2" max="100" onChange={(val)=>{
                numOfRows.current = (parseInt(val.target.value))
                setGen(createGrid())
                }}></input>
          </div>
          <div className= "settings_container">
            <h1 className = "settings">Columns: </h1>
            <input type="number" defaultValue={numOfCols.current} name="row" min="2" max="100" onChange={(val)=>{
                numOfCols.current = (parseInt(val.target.value))
                setGen(createGrid())
                }}></input>
          </div>
      </>}
      </div>

      <div className="grid"  style = {{gridTemplateColumns: `repeat(${numOfCols.current}, ${(width)/numOfCols.current+'px'})`}}>
        {gen.map((rows, r) => rows.map((column, c) => <div key = {r + "_" + c} className={"cell " + gen[r][c]} onClick={() => {
                  const newGen = produce(gen, genCopy => {
                    genCopy[r][c] = gen[r][c] ? false : true;
                  });
                  setGen(newGen);
                }}/>))}
      </div>

      <div className="btn-container">
        <div className="btn" onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            nextGen();
          }
        }}>{!running ? 'Start' : 'Pause'}</div>
        <div className="btn" onClick={()=>{
          setRunning(false)
          setGen(createRandomGrid())}}>Random</div>
        <div className="btn" onClick={()=>{
          setRunning(false)
          setGen(createGrid())}}>Clear</div>
      </div>

    </div>
  );
}

export default App;
