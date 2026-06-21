function getElementsRecursive_(element, tagName) {
  let result = [];
  element.getChildren().forEach(child => {
    if (child.getName() === tagName) result.push(child);
    result = result.concat(getElementsRecursive_(child, tagName));
  });
  return result;
}

function getChildText_(element, tagName) {
  const child = element.getChild(tagName);
  return child ? child.getText().trim() : '';
}
