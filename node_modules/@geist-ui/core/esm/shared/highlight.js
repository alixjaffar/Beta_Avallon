import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["rect", "visible", "hoverHeightRatio", "hoverWidthRatio", "activeOpacity", "className"];
import _JSXStyle from "../styled-jsx.es.js";
import React, { useMemo, useRef } from 'react';
import { isUnplacedRect } from '../utils/layouts';
import usePrevious from '../utils/use-previous';
import useTheme from '../use-theme';
import useClasses from '../use-classes';

var Highlight = function Highlight(_ref) {
  var rect = _ref.rect,
      visible = _ref.visible,
      _ref$hoverHeightRatio = _ref.hoverHeightRatio,
      hoverHeightRatio = _ref$hoverHeightRatio === void 0 ? 1 : _ref$hoverHeightRatio,
      _ref$hoverWidthRatio = _ref.hoverWidthRatio,
      hoverWidthRatio = _ref$hoverWidthRatio === void 0 ? 1 : _ref$hoverWidthRatio,
      _ref$activeOpacity = _ref.activeOpacity,
      activeOpacity = _ref$activeOpacity === void 0 ? 0.8 : _ref$activeOpacity,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded);

  var theme = useTheme();
  var ref = useRef(null);
  var isFirstVisible = usePrevious(isUnplacedRect(rect));
  var position = useMemo(function () {
    var width = rect.width * hoverWidthRatio;
    var height = rect.height * hoverHeightRatio;
    return {
      width: "".concat(width, "px"),
      left: "".concat(rect.left + (rect.width - width) / 2, "px"),
      height: "".concat(height, "px"),
      top: "".concat(rect.elementTop + (rect.height - height) / 2, "px"),
      transition: isFirstVisible ? 'opacity' : 'opacity, width, left, top'
    };
  }, [rect, hoverWidthRatio, hoverHeightRatio]);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref
  }, props, {
    className: _JSXStyle.dynamic([["603024321", [theme.palette.accents_2, position.width, position.left, position.height, position.top, visible ? activeOpacity : 0, position.transition]]]) + " " + (props && props.className != null && props.className || useClasses('highlight', className) || "")
  }), /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "603024321",
    dynamic: [theme.palette.accents_2, position.width, position.left, position.height, position.top, visible ? activeOpacity : 0, position.transition]
  }, ".highlight.__jsx-style-dynamic-selector{background:".concat(theme.palette.accents_2, ";position:absolute;border-radius:5px;width:").concat(position.width, ";left:").concat(position.left, ";height:").concat(position.height, ";top:").concat(position.top, ";opacity:").concat(visible ? activeOpacity : 0, ";-webkit-transition:0.15s ease;transition:0.15s ease;-webkit-transition-property:").concat(position.transition, ";transition-property:").concat(position.transition, ";}")));
};

export default Highlight;