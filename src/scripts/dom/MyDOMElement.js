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
    const candidate = component.init(this).process();
    if (candidate !== component) {
      console.log(component);
      throw new Error('MyDOMElement: addComponent() expects process() to return the same component instance ');
    }
    this._components.push(candidate);
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
