import MyComponent from './MyComponent.js';

class MyStringClick extends MyComponent {
  process() {
    const that = this;
    this.htmlElem().addEventListener('click', function() {
      that.elem().broadcast('click');
    });
    return this;
  }
}

export default MyStringClick;
