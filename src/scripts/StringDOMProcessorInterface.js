class StringDOMProcessorInterface {

  /**
   *
   * @param {StringDOMElem} string
   */
  constructor(string) {
    this._string = string;
  }

  /**
   *
   * @returns {StringDOMElem}
   */
  string() {
    return this._string;
  }

  process() {
    throw new Error('process() method must be implemented in subclass');
  }

  respondToEvent(eventName, string) {
  }

}

export default StringDOMProcessorInterface;
