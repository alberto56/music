import MyComponent from './MyComponent.js';
import GuitarString from '../sounds/GuitarString.js';

class MyStringSound extends MyComponent {
  process() {
    return this;
  }
  /**
   *
   * @param {string} eventName
   * @param {MyDOMElement} elem
   */
  reactTo(eventName, elem) {
    switch (eventName) {
      case 'click':
        this.strum(elem);
        break;
      default:
        break;
    }
  }
  /**
   *
   * @param {MyDOMElement} elem
   */
  strum(elem) {
    GuitarString.instance().strum({
      baseFreq: parseFloat(this.get('data-frequency', '110')),
      duration: parseFloat(this.get('data-duration', '1')),
    });
    // Subclasses can react.
  }
}

export default MyStringSound;
