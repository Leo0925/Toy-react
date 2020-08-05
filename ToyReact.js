
class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    // 以  ON 开头,添加事件
    if (name.match(/^on([\s\S]+)$/)) {
      // /s/S 是所有字符的意思 s 表示空白，S表示非空白，^ 表示头， $ 表示尾
      let eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase());
      this.root.addEventListener(eventName, value);
      // react 中是没有 remove 事件的，remove 了 react render 的合法性就被破坏了，只能把  dom 树销毁，重建一个 dom 树
    }
    if(name === 'className') {
      this.root.setAttribute("class", value);
    }
    this.root.setAttribute(name, value);
  }
  appendChild(vchild) {
    let range = document.createRange();
    if (this.root.children.length) {
      range.setStartAfter(this.root.lastChild);
      range.setEndAfter(this.root.lastChild);
    } else {
      range.setStart(this.root, 0);
      range.setEnd(this.root, 0);
    }
    vchild.mountTo(range);
  }
  mountTo(range) {
    range.deleteContents();
    range.insertNode(this.root);
    // parent.appendChild(this.root);
  }
}

export class Component {
  constructor() {
    this.children = [];
    // 这样创建出来的对象不会带上默认的 object 的方法
    this.props = Object.create(null);
  }
  mountTo(range) {
    this.range = range;
    this.upDate();
  }

  upDate() {
    // 下面 deleteContents 之后会出现 dom 空白，导致方块移位，此处创建一个评论节点进行站位，防止位移
    let placeholder = document.createComment('placeholder');
    let range = document.createRange();
    range.setStart(this.range.endContainer, this.range.endOffset);
    range.setEnd(this.range.endContainer, this.range.endOffset);
    range.insertNode(placeholder);

    this.range.deleteContents();
    let vdom = this.render();
    vdom.mountTo(this.range);
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
        if (typeof newState[p] === 'object') {
          if (typeof oldState[p] === 'object') {
            oldState[p] = {};
          }
          merger(oldState[p], newState[p])
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
  }
  mountTo(range) {
    range.deleteContents();
    range.insertNode(this.root);
    // parent.appendChild(this.root);
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
