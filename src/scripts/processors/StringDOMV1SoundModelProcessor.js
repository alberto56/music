import StringDOMProcessorInterface from './../StringDOMProcessorInterface.js';
import StringSound from './../sounds/String.js';

class StringDOMV1SoundModelProcessor extends StringDOMProcessorInterface {
  data() {
    return this.string().attr('data-sound-model');
  }
  process() {
    console.log('Processing ' + this.data());
    this.string().subscribe(this);
  }
  respondToEvent(eventName, elem) {
    if (eventName === 'click') {
      this.strum(elem);
    }
  }
  strum(elem) {
    StringSound.instance().strum({
      frequency: elem.htmlElem().attr('data-frequency') || 110,
      duration: elem.htmlElem().attr('data-duration') || 1,
    });
  }
}

export default StringDOMV1SoundModelProcessor;
