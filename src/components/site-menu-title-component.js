import AbstractComponent from "./abstract-component";

export default class SiteMenuTitleComponent extends AbstractComponent {
  getTemplate() {
    return (
      `<h2 class="visually-hidden">Switch trip view</h2>`
    );
  }
}
