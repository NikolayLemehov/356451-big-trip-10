const RenderPosition = {
  AFTERBEGIN: `prepend`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const renderElement = (container, component, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.AFTEREND:
      container.after(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
  }
};

const replaceElement = (newComponent, oldComponent) => {
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();
  const parentElement = oldElement.parentElement;
  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

export {createElement, renderElement, RenderPosition, replaceElement};
