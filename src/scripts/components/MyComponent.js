import MyDOMElement from '../dom/MyDOMElement.js';

class MyComponent {
  /**
   *
   * @param {MyDOMElement} elem
   * @returns
   */
  init(elem) {
    this._elem = elem;
    return this;
  }
  elem() {
    if (typeof this._elem !== 'undefined') {
      return this._elem;
    }
    throw new Error('MyComponent: elem() called before init()');
  }
  htmlElem() {
    return this.elem().htmlElem();
  }
  get(attr, defaultValue = null) {
    return this.htmlElem().getAttribute(attr) || defaultValue;
  }
  set(attr, value) {
    this.htmlElem().setAttribute(attr, value);
    return this;
  }
  process() {
    return this;
  }
  /**
   *
   * @param {string} eventName
   * @param {MyDOMElement} elem
   */
  reactTo(eventName, elem) {
    // Subclasses can react.
  }
}

export default MyComponent;
