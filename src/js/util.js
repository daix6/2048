module.exports = (function () {
  'use strict';
  return {
    addEvent: function(ele, event, handler) {
      if (ele.addEventListener)
        ele.addEventListener(event, handler);
      else
        ele.attachEvent('on' + event, handler);
    },
    hasClass: function(ele, classname) {
      if (ele.classList)
        return ele.classList.contains(classname);
      else {
        var reg = new RegExp('(\\s|^)' + classname + '(\\s|$)', 'g');
        return !!ele.classname.match(reg);
      }
    },
    addClass: function(ele, classname) {
      if (ele.classList)
        ele.classList.add(classname);
      else if (!hasClass(ele, classname))
        ele.className += ' ' + classname;
    },
    removeClass: function(ele, classname) {
      if (ele.classList)
        ele.classList.remove(classname);
      else if (hasClass(ele, classname)) {
        var reg = new RegExp('(\\s|^)' + classname + '(\\s|$)', 'g');
        ele.className = ele.className.replace(reg, ' ');
      }
    }
  };
})();
