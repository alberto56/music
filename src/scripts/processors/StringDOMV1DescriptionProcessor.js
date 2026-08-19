import StringDOMProcessorInterface from './../StringDOMProcessorInterface.js';

class StringDOMV1DescriptionProcessor extends StringDOMProcessorInterface {
  data() {
    return this.string().attr('data-description');
  }
  process() {
    if (!this.data().startsWith('v1')) {
      throw new Error(`Unknown description: ${this.data()}`);
    }
    if (!this.data().startsWith('v1/desc/')) {
      throw new Error(`Unknown description: ${this.data()}`);
    }
    this.processFromDescriptor();
    this.string().subscribe(this);
  }
  processFromDescriptor() {
    if (this.data() === 'v1/desc/a4-acoustic-guitar') {
      this.processFromVariables({
        f: 110.0,
        L: 0.648,
        T: 101.62,
        u: 0.005,
      });
    }
  }
  processFromVariables({ f, L, T, u }) {
    if (L && T && u) {
      const candidate = (1 / (2 * L)) * Math.sqrt(T / u);
      if (f && Math.round(f, 2) !== Math.round(candidate, 2)) {
        throw new Error(`Inconsistent variables: f=${f} or ${candidate}, L=${L}, T=${T}, u=${u}`);
      }
      this.string().setAttr('data-frequency', candidate);
      this.string().setAttr('data-length', L);
      this.string().setAttr('data-tension', T);
      this.string().setAttr('data-linear-density', u);
    }
  }
}

export default StringDOMV1DescriptionProcessor;
