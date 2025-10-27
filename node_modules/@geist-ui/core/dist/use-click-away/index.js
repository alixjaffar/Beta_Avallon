'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

var useClickAway = function useClickAway(ref, handler) {
  var handlerRef = react.useRef(handler);
  react.useEffect(function () {
    handlerRef.current = handler;
  }, [handler]);
  react.useEffect(function () {
    var callback = function callback(event) {
      var el = ref.current;
      if (!event || !el || el.contains(event.target)) return;
      handlerRef.current(event);
    };

    document.addEventListener('click', callback);
    return function () {
      return document.removeEventListener('click', callback);
    };
  }, [ref]);
};

var useClickAway$1 = useClickAway;

exports["default"] = useClickAway$1;
