import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useRef, useState } from 'react';
var defaultOptions = {
  scrollLayer: false,
  delayReset: 0
};
var elementStack = new Map();

var getOwnerPaddingRight = function getOwnerPaddingRight(element) {
  var owner = (element === null || element === void 0 ? void 0 : element.ownerDocument) || document;
  var view = owner.defaultView || window;
  return Number.parseInt(view.getComputedStyle(element).paddingRight, 10) || 0;
};

var getOwnerScrollbarWidth = function getOwnerScrollbarWidth(element) {
  var doc = (element === null || element === void 0 ? void 0 : element.ownerDocument) || document;
  return Math.abs(window.innerWidth - doc.documentElement.clientWidth);
};

var useBodyScroll = function useBodyScroll(elementRef, options) {
  /* istanbul ignore next */
  if (typeof document === 'undefined') return [false, function (t) {
    return t;
  }];
  var elRef = elementRef || useRef(document.body);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      hidden = _useState2[0],
      setHidden = _useState2[1];

  var safeOptions = _extends({}, defaultOptions, options || {});

  useEffect(function () {
    if (!elRef || !elRef.current) return;
    var lastOverflow = elRef.current.style.overflow;

    if (hidden) {
      if (elementStack.has(elRef.current)) return;
      var paddingRight = getOwnerPaddingRight(elRef.current);
      var scrollbarWidth = getOwnerScrollbarWidth(elRef.current);
      elementStack.set(elRef.current, {
        overflow: lastOverflow,
        paddingRight: elRef.current.style.paddingRight
      });
      elRef.current.style.overflow = 'hidden';
      elRef.current.style.paddingRight = "".concat(paddingRight + scrollbarWidth, "px");
      return;
    } // reset element overflow


    if (!elementStack.has(elRef.current)) return;

    var reset = function reset(el) {
      var store = elementStack.get(el);
      if (!store) return;
      el.style.overflow = store.overflow;
      el.style.paddingRight = store.paddingRight;
      elementStack["delete"](el);
    };

    var timer = window.setTimeout(function () {
      reset(elRef.current);
      window.clearTimeout(timer);
    }, safeOptions.delayReset);
  }, [hidden, elRef]);
  return [hidden, setHidden];
};

export default useBodyScroll;