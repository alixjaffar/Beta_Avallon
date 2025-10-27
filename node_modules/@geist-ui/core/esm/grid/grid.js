import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["children", "className"];
import _JSXStyle from "../styled-jsx.es.js";
import React from 'react';
import GridBasicItem from './basic-item';
import useScale, { withScale } from '../use-scale';
import useClasses from '../use-classes';
var defaultProps = {
  className: ''
};

var GridComponent = function GridComponent(_ref) {
  var children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _styles$className = {
    styles: /*#__PURE__*/React.createElement(_JSXStyle, {
      id: "1271839607",
      dynamic: [SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0, 'var(--grid-gap-unit)'), SCALES.pr(0, 'var(--grid-gap-unit)'), SCALES.pb(0, 'var(--grid-gap-unit)'), SCALES.pl(0, 'var(--grid-gap-unit)')]
    }, "div.__jsx-style-dynamic-selector{margin:".concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";box-sizing:border-box;padding:").concat(SCALES.pt(0, 'var(--grid-gap-unit)'), " ").concat(SCALES.pr(0, 'var(--grid-gap-unit)'), " ").concat(SCALES.pb(0, 'var(--grid-gap-unit)'), " ").concat(SCALES.pl(0, 'var(--grid-gap-unit)'), ";}")),
    className: _JSXStyle.dynamic([["1271839607", [SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0, 'var(--grid-gap-unit)'), SCALES.pr(0, 'var(--grid-gap-unit)'), SCALES.pb(0, 'var(--grid-gap-unit)'), SCALES.pl(0, 'var(--grid-gap-unit)')]]])
  },
      resolveClassName = _styles$className.className,
      styles = _styles$className.styles;
  var classes = useClasses(resolveClassName, className);
  return /*#__PURE__*/React.createElement(GridBasicItem, _extends({
    className: classes
  }, props), children, styles);
};

GridComponent.defaultProps = defaultProps;
GridComponent.displayName = 'GeistGrid';
var Grid = withScale(GridComponent);
export default Grid;