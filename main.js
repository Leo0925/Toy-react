import { ToyReact, Component } from './toyReact';

class Square extends Component {

  render() {
    return (
      <button
        className="square"
        onClick={() => alert('click')}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends Component {
  renderSquare(i) {
    return (
      <Square
        value={i}
      />
    );
  }
  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

let a = <Board />

// let a = <div name='a' id='id'>
//   <span>hello</span>
//   <span>world</span>
//   <span>!</span> 
// </div>

// document.body.appendChild(a);
ToyReact.render(
  a,
  document.body
)