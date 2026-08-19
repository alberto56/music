import StringDOMProcessorInterface from './../StringDOMProcessorInterface.js';

class StringDOMV1ControllerProcessor extends StringDOMProcessorInterface {
  data() {
    return this.string().attr('data-controller');
  }
  process() {
    const that = this;
    this.string().onClick(function() {
      that.string().broadcast('click');
    });
    this.string().subscribe(this);
  }
}

export default StringDOMV1ControllerProcessor;
