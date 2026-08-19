import StringDOMElem from './StringDOMElem.js';

class StringDOMElemProcessor {
  static instance() {
    if (!StringDOMElemProcessor._instance) {
      StringDOMElemProcessor._instance = new StringDOMElemProcessor();
    }
    return StringDOMElemProcessor._instance;
  }

  /**
   *
   * @param {HTMLElement} string
   */
  processString(string) {
    console.log(typeof string)
    const stringObj = new StringDOMElem(string);
    stringObj.process();
  }

}

export default StringDOMElemProcessor;
