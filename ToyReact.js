
class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    // 以  ON 开头,添加事件
    if (name.match(/^on([\s\S]+)$/)) {
      let eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase());
      this.root.addEventListener(eventName, value);
    }
    this.root.setAttribute(name, value);
  }
  appendChild(vchild) {
    vchild.mountTo(this.root);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

export class Component {
  constructor() {
    this.children = [];
    // 这样创建出来的对象不会带上默认的 object 的方法
    this.props = Object.create(null);
  }
  mountTo(parent) {
    let vdom = this.render();
    vdom.mountTo(parent);
  }
  setAttribute(name, value) {
    this.props[name]= value;
    this[name] = value;
  }
  appendChild(vchild) {
    this.children.push(vchild);
  }
}


class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
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
    // 让 vdom 去做 mountTo 这件事
    vdom.mountTo(element);
  }
};
