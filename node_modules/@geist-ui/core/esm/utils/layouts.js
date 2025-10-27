import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import { useState } from 'react';
export var getElementOffset = function getElementOffset(el) {
  if (!el) return {
    top: 0,
    left: 0
  };

  var _el$getBoundingClient = el.getBoundingClientRect(),
      top = _el$getBoundingClient.top,
      left = _el$getBoundingClient.left;

  return {
    top: top,
    left: left
  };
};
var defaultRect = {
  top: -1000,
  left: -1000,
  right: -1000,
  width: 0,
  height: 0,
  elementTop: -1000
};

var getRectFromDOMWithContainer = function getRectFromDOMWithContainer(domRect, getContainer) {
  if (!domRect) return defaultRect;
  var container = getContainer ? getContainer() : null;
  var scrollElement = container || document.documentElement;

  var _getElementOffset = getElementOffset(container),
      offsetTop = _getElementOffset.top,
      offsetLeft = _getElementOffset.left;

  return _extends({}, domRect, {
    width: domRect.width || domRect.right - domRect.left,
    height: domRect.height || domRect.top - domRect.bottom,
    top: domRect.bottom + scrollElement.scrollTop - offsetTop,
    left: domRect.left + scrollElement.scrollLeft - offsetLeft,
    elementTop: domRect.top + scrollElement.scrollTop - offsetTop
  });
};

export var isUnplacedRect = function isUnplacedRect(rect) {
  if (!rect) return true;
  return rect.top === defaultRect.top && rect.left === defaultRect.left;
};
export var getRefRect = function getRefRect(ref, getContainer) {
  if (!ref || !ref.current) return defaultRect;
  var rect = ref.current.getBoundingClientRect();
  return getRectFromDOMWithContainer(rect, getContainer);
};
export var getEventRect = function getEventRect(event, getContainer) {
  var _event$target;

  var rect = event === null || event === void 0 ? void 0 : (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.getBoundingClientRect();
  if (!rect) return defaultRect;
  return getRectFromDOMWithContainer(rect, getContainer);
};

var isRefTarget = function isRefTarget(eventOrRef) {
  return typeof (eventOrRef === null || eventOrRef === void 0 ? void 0 : eventOrRef.target) === 'undefined';
};

export var useRect = function useRect(initialState) {
  var _useState = useState(initialState || defaultRect),
      _useState2 = _slicedToArray(_useState, 2),
      rect = _useState2[0],
      setRect = _useState2[1];

  var updateRect = function updateRect(eventOrRef, getContainer) {
    if (isRefTarget(eventOrRef)) return setRect(getRefRect(eventOrRef, getContainer));
    setRect(getEventRect(eventOrRef, getContainer));
  };

  return {
    rect: rect,
    setRect: updateRect
  };
};