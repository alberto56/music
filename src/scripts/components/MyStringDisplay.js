import MyComponent from './MyComponent.js';

class MyStringDisplay extends MyComponent {
  process() {
    const desc = this.get('data-display-model', "v1/pixels/500");
    if (!desc.startsWith('v1/pixels/')) {
      throw new Error('Invalid display model: ' + desc);
    }
    const pixels = parseInt(desc.split('/')[2]);
    this.htmlElem().style.display = 'inline-block';
    this.htmlElem().style.background = 'red';
    this.htmlElem().style.height = '20px';
    this.htmlElem().style.width = pixels + 'px';

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
