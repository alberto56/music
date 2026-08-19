import StringDOMProcessorInterface from './StringDOMProcessorInterface.js';
import StringDOMV1Processor from './StringDOMV1Processor.js';

class StringDOMElem {
  /**
   *
   * @param {HTMLElement} string
   */
  constructor(string) {
    this.string = string;
  }

  onClick(callback) {
    this.string.addEventListener('click', callback);
  }

  broadcast(eventName) {
    const that = this;
    if (this.listeners === undefined) {
      return;
    }
    this.listeners.forEach((listener) => {
      listener.respondToEvent(eventName, that);
    });
  }

  subscribe(listener) {
    if (this.listeners === undefined) {
      this.listeners = [];
    }
    this.listeners.push(listener);
  }

  process() {
    // First make sure we have a processor.
    const processor = this.attr('data-processor', 'StringDOMProcessorV1');

    this.processor(processor, this).process();
  }

  setAttr(attr, value) {
    this.string.setAttribute(attr, value);
  }

  attr(attr, defaultValue = null) {
    return this.string.getAttribute(attr) || defaultValue;
  }

  /**
   *
   * @param {string} processorName
   * @param {StringDOMElem} elem
   * @returns {StringDOMProcessorInterface}
   */
  processor(processorName, elem) {
    switch (processorName) {
      case 'StringDOMProcessorV1':
        return new StringDOMV1Processor(elem);
      default:
        throw new Error(`Unknown processor: ${processorName}`);
    }
  }
}

export default StringDOMElem;
