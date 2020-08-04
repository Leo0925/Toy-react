export let ToyReact = {
  createElement(type, attributes, ...children) {
    let element = document.createElement(type);
    for (let name in attributes) {
      element.setAttribute(name, attributes[name]);
    }
    // 遍历 child
    for (let child of children) {
      // 如果传入的是字符串，不是 node 节点，则创建 textNode 节点
      if (typeof child === 'string') {
        child = document.createTextNode(child);
      }
      element.appendChild(child);
    }
    return element;
  }
};
