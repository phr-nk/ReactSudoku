import React from 'react';
import ReactDOM from 'react-dom';
import sudoku from 'sudoku';
import './index.css';

var chunk = require('lodash.chunk');
var x = 0; //index

function Square(props)
{
  
     return (
        <input value= {props.value} className="square" onChange = {(e,i) => props.onChange(e.target.value, props.cellIndex)} >
    
        </input>
      );
}

  
function HintSquare(props)
{
  return (
     <input value= {props.value} className="hintsquare"  readOnly>
   
     </input>
   );
}
  class Board extends React.Component {
  
    renderSquare(i) 
    {
    
      x = x + 1
      return <Square
                cellIndex = {x}
                value ={i}
                key= {x}
                onChange = {this.props.onChange.bind(this) }
          
            />;
    }
    renderHintSquare(i) 
    {
      x = x + 1
      return <HintSquare 
                cellIndex = {x}
                value ={i}
                key= {x}
            
            />;
    }
    createTable = () => 
    {
      var sudo = chunk(this.props.squares,9)
      var hints = chunk(this.props.hints.squares,9)
      var table = []
      
      x = 0 //reset index
    
      console.log(sudo)
      for (let i = 0; i < 9; i++) 
      {
        let children = []
        for (let j = 0; j < 9; j++) 
        {
          

          if ( j%3 === 0) //for vertical styling
          {
            if(hints[i][j] != null )
            {
              children.push(<td className="ySodu">{ this.renderHintSquare(sudo[i][j])}</td>)
              
            }
            else if(sudo[i][j] == null)
            {
      
              children.push(<td className="ySodu">{ this.renderSquare("")}</td>)
            }
            else
            {
              children.push(<td className="ySodu">{ this.renderSquare(sudo[i][j] )}</td>)
            }
          }
          else
          {
            if( hints[i][j] != null)
            {
              children.push(<td>{ this.renderHintSquare(sudo[i][j])}</td>)
            }
            else if(sudo[i][j] == null)
            {
              children.push(<td>{ this.renderSquare("")}</td>)
            }
            else{
              children.push(<td>{ this.renderSquare(sudo[i][j] )}</td>)
            }
          }
      
        }

        if (i%3 === 0) //for horizontal styling
        {
          table.push(<tr className="xSodu">{children}</tr>)
        }
        else
        {
          table.push(<tr>{children}</tr>)
        }      
      }
      return table
    }
  
    render() 
    {
      return (
        <div>
        <table>
          <tbody>{this.createTable()}</tbody>

       </table>
       </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            history: [ { squares: sudoku.makepuzzle()}],
            stepNumber: 0,
  

        };
    }
   
    handleClick(i, cellId)
    {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

       
        squares[cellId-1] = parseInt(i)
       

        if(completePuzz(squares) == null) 
        {
          if (isNaN(i) || i > 8 || i < 0) //numbers other than allowed 
          {
            alert("only numbers 0-8 allowed")
            squares[cellId-1] = null
            return            
          }
          else if (i === "" ) //backspaces 
          {
            squares[cellId-1] = null
            this.setState({history: history.concat([{squares: squares}]), stepNumber: history.length});
            return
          }
          else //valid number
          {

          this.setState({history: history.concat([{squares: squares}]), stepNumber: history.length});
          
          return
          }
        }
        
        this.setState({history: history.concat([{squares: squares}]), stepNumber: history.length});
    }
    jumpTo(step)
    {
        this.setState({
            stepNumber: step,
          
        });
    }
    checkEqual(squares, solved)
    {
      if(solved == null) return false
      for (var i = 0; i < squares.length; i++) {
        if (squares[i] !== solved[i] || squares[i] == null) return false;
      }
      return true
    
    }
    solveClick()
    {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      var curr_hints = history[0].squares
      var solved = completePuzz(current.squares)
      if(curr_hints != null ) // check if first block is hint square
      {
        curr_hints[0] = null
        this.setState({hints: curr_hints })
      }
      solved[0] = null

      this.setState({history: history.concat([{squares: solved}]), stepNumber: history.length})

    }
    render() 
    {

      const history = this.state.history;
      const current = history[this.state.stepNumber];


      const solved = completePuzz(current.squares)
  

      var squares = current.squares
      const moves = history.map((step,move) =>
      {
          const desc = move ? 'Go to move #' + move : 'Go to game start';
          return (
              <li key={move}>
                  <button onClick={() => 
                    this.jumpTo(move)}>
                        {desc} 
                    </button>
              </li>
          );
      });
      let status = "Not Completed";
      var style = "game-board"
   
      if(this.checkEqual(squares,solved))
      {
        style = "game-win"
        status = "Completed"
      }
      return (
        <div className="game">
          <div className= { style }>
             <Board squares={squares} onChange={(val,index) => this.handleClick(val,index)} hints = {this.state.history[0]}/>
             
          </div>
          <div className="game-info">
            <button onClick={() => this.solveClick()}>Complete most of the puzzle</button>
            <div>{ status }</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  


  //helper function
  function completePuzz(array)
  {
    
    return sudoku.solvepuzzle(array)
    
  }