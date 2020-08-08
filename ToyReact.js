

let childrenSymbol = Symbol('children');
class ElementWrapper {
  constructor(type) {
    this.type = type;
    this.props = Object.create(null);
    this[childrenSymbol] = [];
    this.children = [];
  }
  setAttribute(name, value) {
    // 以  ON 开头,添加事件
    /*if (name.match(/^on([\s\S]+)$/)) {
      // /s/S 是所有字符的意思 s 表示空白，S表示非空白，^ 表示头， $ 表示尾
      let eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase());
      this.root.addEventListener(eventName, value);
      // react 中是没有 remove 事件的，remove 了 react render 的合法性就被破坏了，只能把  dom 树销毁，重建一个 dom 树
    }
    if(name === 'className') {
      this.root.setAttribute("class", value);
    }
    this.root.setAttribute(name, value);*/
    this.props[name] = value;
  }
  appendChild(vchild) {
    /*let range = document.createRange();
    if (this.root.children.length) {
      range.setStartAfter(this.root.lastChild);
      range.setEndAfter(this.root.lastChild);
    } else {
      range.setStart(this.root, 0);
      range.setEnd(this.root, 0);
    }
    vchild.mountTo(range);*/
    this[childrenSymbol].push(vchild);
    this.children.push(vchild.vdom);
  }
  get vdom() {
    return this
  }
  mountTo(range) {
    this.range = range;
    let placeholder = document.createComment('placeholder');
    let endRange = document.createRange();
    endRange.setStart(range.endContainer,range.endOffset);
    endRange.setEnd(range.endContainer,range.endOffset);
    endRange.insertNode(placeholder);
    range.deleteContents();
    let element = document.createElement(this.type);
    for (let name in this.props) {
      let value = this.props[name];
      if (name.match(/^on([\s\S]+)$/)) {
        // /s/S 是所有字符的意思 s 表示空白，S表示非空白，^ 表示头， $ 表示尾
        let eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase());
        element.addEventListener(eventName, value);
        // react 中是没有 remove 事件的，remove 了 react render 的合法性就被破坏了，只能把  dom 树销毁，重建一个 dom 树
      }
      if(name === 'className') {
        element.setAttribute("class", value);
      }
      element.setAttribute(name, value)
    }
    for (let child of this.children) {
      let range = document.createRange();
      if (element.children.length) {
        range.setStartAfter(element.lastChild);
        range.setEndAfter(element.lastChild);
      } else {
        range.setStart(element, 0);
        range.setEnd(element, 0);
      }
      child.mountTo(range);
    }
    range.insertNode(element);
    // parent.appendChild(this.root);
  }
}

export class Component {
  constructor() {
    this.children = [];
    // 这样创建出来的对象不会带上默认的 object 的方法
    this.props = Object.create(null);
  }
  get type(){
    return this.constructor.name;
  }

  mountTo(range) {
    this.range = range;
    this.upDate();
  }

  upDate() {
    let vdom = this.vdom;
    if (this.oldVdom) {
      let isSameNode = (node1, node2) => {
        if (node1.type !== node2.type) {
          return false;
        }
        for (let name in node1.props) {
          /*if (typeof node1.props[name] === 'function' && typeof node2.props[name] === 'function' 
              && node1.props[name].toString() === node2.props[name].toString()) {
                continue;
              }*/
          if (typeof node1.props[name] === 'object' && typeof node2.props[name] === 'object' 
          && JSON.stringify(node1.props[name]) === JSON.stringify(node2.props[name])) {
            continue;
          }
          if (node1.props[name] !== node2.props[name]) {
            return false;
          }
        }
        if (Object.keys(node1.props).length !== Object.keys(node2.props).length) {
          return false;
        }
        return true;
      }

      let isSameTree = (node1, node2) => {
        if (!isSameNode(node1, node2)) {
          return false;
        }
        if(node1.children.length !== node2.children.length) {
          return false;
        }
        for (let i = 0; i < node1.children.length; i++) {
          if (!isSameTree(node1.children[i], node2.children[i])) {
            return false;
          }
        }
        return true;
      }

      let replace = (newTree, oldTree, indent)  => {
        if (isSameTree(newTree, oldTree)) {
          return;
        }
        if (!isSameNode(newTree, oldTree)) {
          newTree.mountTo(oldTree.range);
        } else {
          for ( let i = 0; i < newTree.children.length; i++) {
            replace(newTree.children[i], oldTree.children[i], ' ' + indent);
          }
        }
      }

      replace(vdom, this.oldVdom, '');
      
    } else {
      vdom.mountTo(this.range);
    }
    this.oldVdom = vdom;
    
  }

  get vdom() {
    return this.render().vdom;
  }
  setAttribute(name, value) {
    this.props[name]= value;
    this[name] = value;
  }
  appendChild(vchild) {
    this.children.push(vchild);
  }
  setState(state){
    let merge = (oldState, newState) => {
      for (let p in newState) {
        if (typeof newState[p] === 'object' && newState[p] !== null) {
          if (typeof oldState[p] !== 'object') {
            if (newState[p] instanceof Array) {
              oldState[p] = [];
            } else {
              oldState[p] = {};
            }
          }
          merge(oldState[p], newState[p])
        } else {
          oldState[p] = newState[p];
        }
      }
    }
    if (!this.state && state) {
      this.state = {};
    }
    merge(this.state, state);
    this.upDate();
  }
}


class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
    this.type = '#text';
    this.children = [];
    this.props = Object.create(null);
  }
  mountTo(range) {
    this.range = range;
    range.deleteContents();
    range.insertNode(this.root);
    // parent.appendChild(this.root);
  }
  get vdom() {
    return this
  }
}


export let ToyReact = {
  createElement(type, attributes, ...children) {
    let element;
    if (typeof type === 'string') {
      element = new ElementWrapper(type);
    } else {
      element = new type;
    }

    for (let name in attributes) {
      element.setAttribute(name, attributes[name]);
    }
    let insetChildren = children => {
      // 遍历 child
      for (let child of children) {
        // 如果传入的是字符串，不是 node 节点，则创建 textNode 节点
        // if (typeof child === 'string') {
        //   child = new TextWrapper(child);
        // }
        // 如果组件里面嵌套了 children，则会传入一个数组
        if (typeof child === 'object' && child instanceof Array) {
          insetChildren(child);
        } else {
          if (child === null|| child === void 0) {
            child = '';
          }
          // 如果组件中传入的 children 不是我们认识的，则 tostring 下
          if (!(child instanceof Component) && !(child instanceof ElementWrapper) && !(child instanceof TextWrapper)) {
            child = String(child);
          }
          if (typeof child === 'string') {
            child = new TextWrapper(child);
          }
          element.appendChild(child);
        }
      }
    }
    insetChildren(children);
    
    return element;
  },
  render(vdom, element) {
    let range = document.createRange();
    if (element.children.length) {
      range.setStartAfter(element.lastChild);
      range.setEndAfter(element.lastChild);
    } else {
      range.setStart(element, 0);
      range.setEnd(element, 0);
    }


    
    // 让 vdom 去做 mountTo 这件事
    vdom.mountTo(range);
  }
};
