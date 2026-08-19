import MyComponent from '../components/MyComponent.js';

class MyDOMElement {
  /**
   *
   * @param {HTMLElement} htmlElement
   */
  constructor(htmlElement) {
    this._htmlElement = htmlElement;
  }
  htmlElem() {
    return this._htmlElement;
  }
  /**
   * @param {MyComponent} component
   * @returns {MyDOMElement}
   */
  addComponent(component) {
    if (!this._components) {
      this._components = [];
    }
    this._components.push(component.init(this).process());
    return this;
  }
  components() {
    if (typeof this._components !== 'undefined') {
      return this._components;
    }
    throw [];
  }
  /**
   *
   * @param {string} eventName
   */
  broadcast(eventName) {
    const that = this;
    this.components().forEach((component) => {
      component.reactTo(eventName, that);
    });
  }
}

export default MyDOMElement;
