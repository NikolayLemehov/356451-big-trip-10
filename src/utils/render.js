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

const renderElement = (container, component) => {
  container.append(component.getElement());
};

export {createElement, renderElement, RenderPosition};
