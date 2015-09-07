module.exports = (function() {
  'use strict';

  function addEvent(ele, event, handler) {
    if (ele.addEventListener)
      ele.addEventListener(event, handler, false);
    else if (ele.attachEvent)
      ele.attachEvent('on' + event, handler);
  }

  function removeEvent(ele, event, handler) {
    if (ele.removeEventListener)
      ele.removeEventListener(event, handler, false);
    else if (ele.detachEvent)
      ele.detachEvent('on' + event, handler);
  }

  function getClass(ele) {
    return ele.getAttribute && ele.getAttribute('class') || '';
  }

  function hasClass(ele, cl) {
    if (getClass(ele).indexOf(cl) > -1)
      return true;
    return false;
  }

  function addClass(ele, cl) {
    if (hasClass(ele, cl))
      return;

    var classname = ' ' + getClass(ele) + ' ';
    classname += cl + ' ';
    ele.setAttribute('class', classname.trim());
  }

  function removeClass(ele, cl) {
    if (!hasClass(ele, cl))
      return;

    var reg = new RegExp('(\\s|^)' + cl + '(\\s|$)', 'g');
    ele.setAttribute('class', getClass(ele).replace(reg, ' ').trim());
  }

  return {
    addEvent: addEvent,
    removeEvent: removeEvent,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass
  };

}());
