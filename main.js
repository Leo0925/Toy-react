import { ToyReact, Compoment } from './toyReact';

class Mycomponent extends Compoment {
  render() {
    return <div>
      <span>hello</span>
      <span>world</span>

      <span>!!!</span>

    </div>
  }
};

let a = <Mycomponent name="q"/>

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