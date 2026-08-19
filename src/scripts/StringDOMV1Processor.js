import StringDOMProcessorInterface from './StringDOMProcessorInterface.js';
import StringDOMV1DescriptionProcessor
  from './processors/StringDOMV1DescriptionProcessor.js';
import StringDOMV1DisplayModelProcessor
  from './processors/StringDOMV1DisplayModelProcessor.js';
import StringDOMV1ControllerProcessor
  from './processors/StringDOMV1ControllerProcessor.js';
import StringDOMV1SoundModelProcessor
  from './processors/StringDOMV1SoundModelProcessor.js';

class StringDOMV1Processor extends StringDOMProcessorInterface {

  process() {
    console.log(this.string().attr());
    this.processDescription();
    this.processDisplayModel();
    this.processController();
    this.processSoundModel();
  }

  processDescription() {
    const string_description = this.string().attr(
      'data-description',
      'v1/desc/a4-acoustic-guitar',
    );
    this.stringDescriptionProcessor(string_description).process();
  }

  processDisplayModel() {
    const display_model = this.string().attr(
      'data-display-model',
      'v1/pixels/500',
    );
    this.stringDisplayModelProcessor(display_model).process();
  }

  processController() {
    const controller = this.string().attr(
      'data-controller',
      'v1',
    );
    this.stringControllerProcessor(controller).process();
  }

  processSoundModel() {
    const sound_model = this.string().attr(
      'data-sound-model',
      'v1',
    );
    this.stringSoundModelProcessor(sound_model).process();
  }

  /**
   * @param {string} description
   * @returns {StringDOMProcessorInterface}
   */
  stringDescriptionProcessor(description) {
    switch (description) {
      case 'v1/desc/a4-acoustic-guitar':
        return new StringDOMV1DescriptionProcessor(this.string());
      default:
        throw new Error(`Unknown description: ${description}`);
    }
  }

  stringDisplayModelProcessor(display_model) {
    switch (display_model) {
      case 'v1/pixels/500':
        return new StringDOMV1DisplayModelProcessor(this.string());
      default:
        throw new Error(`Unknown display model: ${display_model}`);
    }
  }

  stringControllerProcessor(controller) {
    switch (controller) {
      case 'v1':
        return new StringDOMV1ControllerProcessor(this.string());
      default:
        throw new Error(`Unknown controller: ${controller}`);
    }
  }

  stringSoundModelProcessor(sound_model) {
    switch (sound_model) {
      case 'v1':
        return new StringDOMV1SoundModelProcessor(this.string());
      default:
        throw new Error(`Unknown sound model: ${sound_model}`);
    }
  }

}

export default StringDOMV1Processor;
