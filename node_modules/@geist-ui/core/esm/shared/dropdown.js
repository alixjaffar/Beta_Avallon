import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _JSXStyle from "../styled-jsx.es.js";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import usePortal from '../utils/use-portal';
import useResize from '../utils/use-resize';
import CssTransition from './css-transition';
import useClickAnyWhere from '../utils/use-click-anywhere';
import useDOMObserver from '../utils/use-dom-observer';
import useWarning from '../utils/use-warning';
import { getRefRect } from '../utils/layouts';
import useClasses from '../use-classes';
var defaultRect = {
  top: -1000,
  left: -1000,
  right: -1000,
  width: 0
};
var Dropdown = /*#__PURE__*/React.memo(function (_ref) {
  var children = _ref.children,
      parent = _ref.parent,
      visible = _ref.visible,
      disableMatchWidth = _ref.disableMatchWidth,
      getPopupContainer = _ref.getPopupContainer;
  var el = usePortal('dropdown', getPopupContainer);

  var _useState = useState(defaultRect),
      _useState2 = _slicedToArray(_useState, 2),
      rect = _useState2[0],
      setRect = _useState2[1];

  var classes = useClasses('dropdown', disableMatchWidth ? 'disable-match' : 'width-match');
  if (!parent) return null;
  /* istanbul ignore next */

  if (process.env.NODE_ENV !== 'production') {
    if (getPopupContainer && getPopupContainer()) {
      var _el = getPopupContainer();

      var style = window.getComputedStyle(_el);

      if (style.position === 'static') {
        useWarning('The element specified by "getPopupContainer" must have "position" set.');
      }
    }
  }

  var updateRect = function updateRect() {
    var _getRefRect = getRefRect(parent, getPopupContainer),
        top = _getRefRect.top,
        left = _getRefRect.left,
        right = _getRefRect.right,
        nativeWidth = _getRefRect.width;

    setRect({
      top: top,
      left: left,
      right: right,
      width: nativeWidth
    });
  };

  useResize(updateRect);
  useClickAnyWhere(function () {
    var _getRefRect2 = getRefRect(parent, getPopupContainer),
        top = _getRefRect2.top,
        left = _getRefRect2.left;

    var shouldUpdatePosition = top !== rect.top || left !== rect.left;
    if (!shouldUpdatePosition) return;
    updateRect();
  });
  useDOMObserver(parent, function () {
    updateRect();
  });
  useEffect(function () {
    if (!parent || !parent.current) return;
    parent.current.addEventListener('mouseenter', updateRect);
    /* istanbul ignore next */

    return function () {
      if (!parent || !parent.current) return;
      parent.current.removeEventListener('mouseenter', updateRect);
    };
  }, [parent]);

  var clickHandler = function clickHandler(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    event.preventDefault();
  };

  var mouseDownHandler = function mouseDownHandler(event) {
    event.preventDefault();
  };

  if (!el) return null;
  return /*#__PURE__*/createPortal( /*#__PURE__*/React.createElement(CssTransition, {
    visible: visible
  }, /*#__PURE__*/React.createElement("div", {
    onClick: clickHandler,
    onMouseDown: mouseDownHandler,
    className: _JSXStyle.dynamic([["1644673105", [rect.top + 2, rect.left, rect.width, rect.width]]]) + " " + (classes || "")
  }, children, /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "1644673105",
    dynamic: [rect.top + 2, rect.left, rect.width, rect.width]
  }, ".dropdown.__jsx-style-dynamic-selector{position:absolute;top:".concat(rect.top + 2, "px;left:").concat(rect.left, "px;z-index:1100;}.width-match.__jsx-style-dynamic-selector{width:").concat(rect.width, "px;}.disable-match.__jsx-style-dynamic-selector{min-width:").concat(rect.width, "px;}")))), el);
});
export default Dropdown;