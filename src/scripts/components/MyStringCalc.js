import MyComponent from './MyComponent.js';

class MyStringCalc extends MyComponent {
  process() {
    const desc = this.get('data-description', "v1/desc/a4-acoustic-guitar");

    this.processFromVariables({
      L: 0.648 * this.get('data-string-length', '1'),
      T: 101.62,
      u: 0.005,
    });

    return this;
  }

  processFromVariables({ f, L, T, u }) {
    if (L && T && u) {
      const candidate = (1 / (2 * L)) * Math.sqrt(T / u);
      if (f && Math.round(f, 2) !== Math.round(candidate, 2)) {
        throw new Error(`Inconsistent variables: f=${f} or ${candidate}, L=${L}, T=${T}, u=${u}`);
      }
      this.set('data-frequency', candidate);
      this.set('data-length', L);
      this.set('data-tension', T);
      this.set('data-linear-density', u);
    }
  }
}

export default MyStringCalc;
