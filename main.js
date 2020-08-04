import { ToyReact, Compoment } from './toyReact';

class Mycomponent extends Compoment {
  render() {
    return <div>
      <span>hello</span>
      <span>world</span>

      <span>!!!</span>
      <div>
        {true}
        {this.children}
      </div>
    </div>
  }
};

let a = <Mycomponent name="q">
  <div>123</div>
</Mycomponent>

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