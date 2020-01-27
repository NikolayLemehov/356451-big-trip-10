import AbstractComponent from './abstract-component';

export default class FilterListTitleComponent extends AbstractComponent {
  getTemplate() {
    return (
      `<h2 class="visually-hidden">Filter events</h2>`
    );
  }
}
