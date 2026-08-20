import MyComponent from './MyComponent.js';

class MyStringDisplay extends MyComponent {
  process() {
    this.processLength();
    this.addGuitarString();
    return this;
  }
  processLength() {
    const desc = this.get('data-display-model', "v1/percent/100");
    if (desc.startsWith('v1/percent')) {
      this.processLengthPercent();
    } else if (desc.startsWith('v1/pixels')) {
      this.processLengthPixels();
    } else {
      throw new Error(`Unknown display model: ${desc}`);
    }
  }
  processLengthPercent() {
    const desc = this.get('data-display-model', "v1/percent/100");
    const percent = parseInt(desc.split('/')[2]);
    this.htmlElem().style.display = 'inline-block';
    this.htmlElem().style.height = '2rem';
    this.htmlElem().style.width = String(
      percent * parseFloat(this.get('data-string-length', '1')),
    ) + '%';
  }
  processLengthPixels() {
    const desc = this.get('data-display-model', "v1/pixels/500");
    const pixels = parseInt(desc.split('/')[2]);
    this.htmlElem().style.display = 'inline-block';
    this.htmlElem().style.height = '20px';
    this.htmlElem().style.width = String(
      pixels * parseFloat(this.get('data-string-length', '1')),
    ) + 'px';
  }
  addGuitarString() {
    const newDiv = document.createElement("div");

    newDiv.classList.add("my-guitar-string");

    this.newDiv = newDiv;
    this.htmlElem().appendChild(newDiv);

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
        this.newDiv.classList.remove('vibrate');
        void this.newDiv.offsetWidth;
        this.newDiv.classList.add('vibrate');
        break;
      default:
        break;
    }
  }
}

export default MyStringDisplay;
