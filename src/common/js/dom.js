/*为元素添加样式*/
export function addClass(element, className) {
  if (hasClass(element, className)) return;
  else {
    let newClasses = element.className.split(' ');
    newClasses.push(className);
    element.className = newClasses.join(' ');
  }
}

/*判断元素是否含有某个class，element.className的大概格式："current_page loaded"*/
export function hasClass(element, className) {
  let reg = RegExp(`(^|\\s)${className}(\\s|$)`)
  let result = reg.test(element.className);
  return result;
}

/*元素元素【data-】开头的属性*/
export function getData(el, name, val) {
  const prefix = 'data-';
  let attrName = prefix + name;
  if (val) return el.setAttribute(attrName, val);
  else return el.getAttribute(attrName);
}
