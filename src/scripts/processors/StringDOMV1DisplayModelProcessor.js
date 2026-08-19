import StringDOMProcessorInterface from './../StringDOMProcessorInterface.js';

class StringDOMV1DisplayModelProcessor extends StringDOMProcessorInterface {
  data() {
    return this.string().attr('data-display-model');
  }
  process() {
    this.string().string.innerHTML = this.data();
    console.log('Processing ' + this.data());
    this.string().subscribe(this);
  }
}

export default StringDOMV1DisplayModelProcessor;
