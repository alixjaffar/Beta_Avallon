import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["gap", "wrap", "children", "className"];
import _JSXStyle from "../styled-jsx.es.js";
import React, { useMemo } from 'react';
import GridBasicItem from './basic-item';
import useScale, { withScale } from '../use-scale';
import useClasses from '../use-classes';
var defaultProps = {
  gap: 0,
  wrap: 'wrap',
  className: ''
};

var GridContainerComponent = function GridContainerComponent(_ref) {
  var gap = _ref.gap,
      wrap = _ref.wrap,
      children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded);

  var _useScale = useScale(),
      unit = _useScale.unit,
      SCALES = _useScale.SCALES;

  var gapUnit = useMemo(function () {
    return "calc(".concat(gap, " * ").concat(unit, " * 1/3)");
  }, [gap, unit]);
  var _styles$className = {
    styles: /*#__PURE__*/React.createElement(_JSXStyle, {
      id: "3631618093",
      dynamic: [gapUnit, wrap, SCALES.width(1, 'var(--grid-container-width)'), SCALES.mt(0, 'var(--grid-container-margin)'), SCALES.mr(0, 'var(--grid-container-margin)'), SCALES.mb(0, 'var(--grid-container-margin)'), SCALES.ml(0, 'var(--grid-container-margin)')]
    }, "div.__jsx-style-dynamic-selector{--grid-gap-unit:".concat(gapUnit, ";--grid-container-margin:calc(-1 * var(--grid-gap-unit));--grid-container-width:calc(100% + var(--grid-gap-unit) * 2);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:").concat(wrap, ";-ms-flex-wrap:").concat(wrap, ";flex-wrap:").concat(wrap, ";box-sizing:border-box;width:").concat(SCALES.width(1, 'var(--grid-container-width)'), ";margin:").concat(SCALES.mt(0, 'var(--grid-container-margin)'), " ").concat(SCALES.mr(0, 'var(--grid-container-margin)'), " ").concat(SCALES.mb(0, 'var(--grid-container-margin)'), " ").concat(SCALES.ml(0, 'var(--grid-container-margin)'), ";}")),
    className: _JSXStyle.dynamic([["3631618093", [gapUnit, wrap, SCALES.width(1, 'var(--grid-container-width)'), SCALES.mt(0, 'var(--grid-container-margin)'), SCALES.mr(0, 'var(--grid-container-margin)'), SCALES.mb(0, 'var(--grid-container-margin)'), SCALES.ml(0, 'var(--grid-container-margin)')]]])
  },
      resolveClassName = _styles$className.className,
      styles = _styles$className.styles;
  var classes = useClasses(resolveClassName, className);
  return /*#__PURE__*/React.createElement(GridBasicItem, _extends({
    className: classes
  }, props), children, styles);
};

GridContainerComponent.defaultProps = defaultProps;
GridContainerComponent.displayName = 'GeistGridContainer';
var GridContainer = withScale(GridContainerComponent);
export default GridContainer;